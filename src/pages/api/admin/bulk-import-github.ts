import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import { Match } from '@/lib/models/Match';
import { transformCricketJson } from '@/lib/importers/cricketJsonImporter';

interface BulkImportResult {
  success: number;
  failed: number;
  errors: { file: string; error: string }[];
}

/**
 * Bulk import matches from GitHub repository
 *
 * Request body:
 * {
 *   "adminPassword": "admin123",
 *   "githubOwner": "your-username",
 *   "githubRepo": "match-data",
 *   "githubPath": "matches",  // folder containing JSON files
 *   "githubToken": "optional-token-for-private-repos"
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { adminPassword, githubOwner, githubRepo, githubPath, githubToken } = req.body;

    // Verify admin password
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!githubOwner || !githubRepo || !githubPath) {
      return res.status(400).json({
        error: 'Missing required fields: githubOwner, githubRepo, githubPath',
      });
    }

    await connectDB();

    const result: BulkImportResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Fetch list of files from GitHub API
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    const apiUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${githubPath}`;

    const filesResponse = await fetch(apiUrl, { headers });

    if (!filesResponse.ok) {
      return res.status(400).json({
        error: `Failed to fetch from GitHub: ${filesResponse.statusText}`,
      });
    }

    const files = await filesResponse.json();

    if (!Array.isArray(files)) {
      return res.status(400).json({
        error: 'GitHub path does not contain files or is not a directory',
      });
    }

    // Filter for JSON files only
    const jsonFiles = files.filter((file: any) => file.name.endsWith('.json'));

    if (jsonFiles.length === 0) {
      return res.status(400).json({
        error: 'No JSON files found in the specified GitHub path',
      });
    }

    // Process each JSON file
    for (const file of jsonFiles) {
      try {
        // Fetch raw file content
        const rawUrl = `https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/main/${githubPath}/${file.name}`;
        const fileResponse = await fetch(rawUrl);

        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
        }

        const jsonData = await fileResponse.json();

        // Transform and save
        const matchData = transformCricketJson(jsonData);
        const match = new Match(matchData);
        await match.save();

        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          file: file.name,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return res.status(200).json({
      message: `Imported ${result.success}/${jsonFiles.length} matches successfully`,
      result,
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
