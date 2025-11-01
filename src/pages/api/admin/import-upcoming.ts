import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import { Match } from '@/lib/models/Match';
import { transformUpcomingMatches } from '@/lib/importers/upcomingMatchesImporter';

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

    // Transform the JSON data to matches array
    const matchesData = transformUpcomingMatches(jsonData);

    if (matchesData.length === 0) {
      return res.status(400).json({
        error: 'No matches found in JSON data',
        details: 'Could not parse series_tournaments from provided JSON',
      });
    }

    const results = [];
    let imported = 0;
    let updated = 0;
    let failed = 0;

    // Import each match
    for (const matchData of matchesData) {
      try {
        const existingMatch = await Match.findOne({ matchId: matchData.matchId });

        let result;
        if (existingMatch) {
          result = await Match.findByIdAndUpdate(
            existingMatch._id,
            matchData,
            { new: true }
          );
          updated++;
        } else {
          result = await Match.create(matchData);
          imported++;
        }

        results.push({
          matchId: matchData.matchId,
          status: existingMatch ? 'updated' : 'imported',
          match: `${matchData.team1?.name} vs ${matchData.team2?.name}`,
        });
      } catch (error) {
        failed++;
        results.push({
          matchId: matchData.matchId,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Import completed: ${imported} imported, ${updated} updated, ${failed} failed`,
      stats: {
        imported,
        updated,
        failed,
        total: matchesData.length,
      },
      results,
    });
  } catch (error) {
    console.error('Error importing upcoming matches:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
