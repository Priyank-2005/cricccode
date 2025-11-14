import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import { Match } from '@/lib/models/Match';
import { transformCricketJson } from '@/lib/importers/cricketJsonImporter';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { adminPassword, jsonData } = req.body;

    // Verify admin password
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!jsonData) {
      return res.status(400).json({ error: 'JSON data is required' });
    }

    await connectDB();

    // Transform the JSON data
    const matchData = transformCricketJson(jsonData);

    // Check if match already exists
    const existingMatch = await Match.findOne({ matchId: matchData.matchId });

    let result;
    let action = 'imported';

    if (existingMatch) {
      // Update existing match
      result = await Match.findByIdAndUpdate(
        existingMatch._id,
        matchData,
        { new: true }
      );
      action = 'updated';
    } else {
      // Create new match
      result = await Match.create(matchData);
      action = 'imported';
    }

    res.status(200).json({
      success: true,
      message: `Match ${action} successfully`,
      matchId: result.matchId,
      action,
      data: result,
    });
  } catch (error) {
    console.error('Error importing JSON:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
