# Quick Start: Bulk Import Your Thousands of Match JSON Files

## TL;DR - 3 Simple Steps

### Step 1: Create GitHub Repo with Your Match Files
```bash
# Create new repo on GitHub called "match-data"
# Then on your local machine:
git clone https://github.com/YOUR-USERNAME/match-data.git
cd match-data
mkdir matches

# Copy all your 1000s of JSON files here
cp /path/to/your/json/files/*.json matches/

# Upload to GitHub
git add matches/
git commit -m "Add match data"
git push origin main
```

### Step 2: Go to Admin Panel
1. Visit your app: `http://localhost:3000/admin/import-data` (or your domain)
2. Login with admin password
3. Click **"Bulk Import (GitHub)"** tab

### Step 3: Fill Form & Click Import
- **Repository Owner**: Your GitHub username (e.g., `john-doe`)
- **Repository Name**: `match-data`
- **Folder Path**: `matches`
- **Access Token**: Leave blank (for public repos)
- Click **"Start Bulk Import"**

**Done!** All matches will be imported and visible on your website.

---

## Repository Structure

```
match-data/
├── matches/
│   ├── match-001.json
│   ├── match-002.json
│   ├── match-003.json
│   └── ... (thousands more)
```

---

## For Thousands of Files

If you have **1000+ files**, use a Personal Access Token to avoid GitHub API limits:

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click **Generate new token (classic)**
3. Name it `criccode`
4. Select: `public_repo` scope
5. Generate and copy token
6. Paste in admin form under "GitHub Personal Access Token"

This gives you 5,000 requests/hour instead of 60.

---

## File Format

Your JSON files must have this structure (ball-by-ball format):

```json
{
  "match_id": "unique-id",
  "status": "completed",
  "series": {"id": "s1", "name": "Series Name"},
  "format": "Test",
  "team1": {
    "name": "India",
    "id": "india",
    "innings": [{
      "runs": 250,
      "wickets": 8,
      "overs": 50,
      "batsmen": [...],
      "bowlers": [...]
    }]
  },
  "team2": {...},
  "venue": "Stadium Name",
  "date": "2025-01-15T10:00:00Z",
  "result": "Team A won by 5 runs"
}
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "No JSON files found" | Check folder path, verify .json extension |
| "Failed to fetch from GitHub" | Make repo public OR add access token |
| "Import fails on some files" | System shows which ones - check their JSON format |
| "Rate limit exceeded" | Use Personal Access Token (see above) |

---

## What Happens After Import?

✓ All matches appear on homepage
✓ Visible in schedules/results pages
✓ Sortable by format, date, teams
✓ Full match details with scores
✓ All data stored in your MongoDB

---

## Organize Matches (Optional)

Group files by date/tournament for easier management:

```
matches/
├── 2025/
│   ├── january/
│   │   ├── ind-vs-aus-001.json
│   │   └── ind-vs-pak-001.json
│   └── february/
│       └── ...
└── 2024/
    └── ...
```

Import from: `matches/2025/january` (process all from that folder)

---

## Full Guide

For detailed instructions, see: `BULK_IMPORT_GUIDE.md`

Happy importing! 🏏
