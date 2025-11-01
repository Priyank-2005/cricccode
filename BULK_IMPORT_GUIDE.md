# Bulk Import Guide - Import Thousands of Match JSON Files

## Overview

Your cricket app now supports bulk importing thousands of match JSON files from GitHub. This guide shows you how to set up and use this feature.

## Step 1: Create a GitHub Repository

### Option A: Create a New Repository
1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon (top right) → **New repository**
3. Repository name: `match-data` (or any name you prefer)
4. Description: "Cricket match data files"
5. Select **Public** (so the app can fetch files without authentication)
6. Click **Create repository**

### Option B: Use an Existing Repository
If you already have a repository, you can use it. Just create a folder for match files.

---

## Step 2: Upload Your Match JSON Files to GitHub

### Method 1: Upload Files via GitHub Web UI (Easy for small batches)

1. Open your repository
2. Click **Add file** → **Create new file** or **Upload files**
3. For new folder:
   - Type `matches/` in the filename field
   - Then upload files or create files

### Method 2: Use Git Command Line (Best for thousands of files)

```bash
# 1. Clone your repository
git clone https://github.com/YOUR-USERNAME/match-data.git
cd match-data

# 2. Create matches folder
mkdir matches

# 3. Copy all your JSON files into matches folder
# Put your 1000s of JSON files here
cp /path/to/your/json/files/*.json matches/

# 4. Add all files
git add matches/

# 5. Commit with a message
git commit -m "Add 1000 match data files"

# 6. Push to GitHub
git push origin main
```

### Method 3: GitHub Desktop (GUI Alternative)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Clone your repository
3. Create `matches` folder locally
4. Copy all JSON files into it
5. Commit and push in GitHub Desktop

---

## Step 3: Verify Files on GitHub

1. Go to your GitHub repository
2. Click on the `matches` folder
3. You should see all your JSON files listed
4. Click on one to preview that it's valid JSON

---

## Step 4: Use Bulk Import in Admin Panel

### In Your CricCode App:

1. Go to **Admin Panel** → **Login** (enter your admin password)
2. Click **Bulk Import (GitHub)** tab
3. Fill in the form:
   - **Repository Owner**: Your GitHub username
   - **Repository Name**: `match-data` (the repo you created)
   - **Folder Path**: `matches` (the folder with JSON files)
   - **Access Token**: Leave blank if repo is public
4. Click **Start Bulk Import**
5. Watch the progress! The system will:
   - Fetch all JSON files from GitHub
   - Parse each one
   - Store in your MongoDB database
   - Show success/failure for each file

---

## Step 5: Handle Large Batches (1000s of files)

### GitHub API Rate Limits

GitHub allows **60 requests per hour** for unauthenticated access.

**Solution: Use Personal Access Token**

1. Go to GitHub Settings → [Developer settings](https://github.com/settings/tokens)
2. Click **Personal access tokens** → **Tokens (classic)**
3. Click **Generate new token (classic)**
4. Add a name: `criccode-import`
5. Select scopes:
   - ✓ `public_repo` (for public repos)
   - ✓ `repo` (if using private repo)
6. Click **Generate token**
7. Copy the token (you won't see it again!)
8. In admin panel, paste into **GitHub Personal Access Token** field
9. This gives you **5,000 requests per hour**

---

## Repository Structure Example

```
match-data/
├── README.md
├── matches/
│   ├── match-001.json
│   ├── match-002.json
│   ├── match-003.json
│   ├── match-004.json
│   └── ... (thousands more)
└── upcoming/
    ├── november-2025.json
    └── december-2025.json
```

---

## Tips for Organization

### Organize by Date/Format

```
matches/
├── 2025/
│   ├── january/
│   │   ├── match-001.json
│   │   ├── match-002.json
│   │   └── ...
│   ├── february/
│   │   └── ...
│   └── ...
└── 2024/
    └── ...
```

Then import from: `matches/2025/january`

---

## Troubleshooting

### Problem: "No JSON files found"
- Check folder path is correct
- Verify files are .json extension
- Make sure repo is public (or token is provided)

### Problem: "Failed to fetch from GitHub"
- Is your repo public? If private, you need access token
- Is the folder path correct?
- Are you over GitHub API limits? (Use access token)

### Problem: "Import fails on some files"
- Check JSON format is valid
- Some files may not match the ball-by-ball schema
- System shows which files failed - fix those and retry

### Problem: "Rate limit exceeded"
- GitHub limits unauthenticated requests to 60/hour
- Solution: Generate a Personal Access Token (see Step 5)
- With token: 5,000 requests/hour

---

## File Format Requirements

Your match JSON files must match the ball-by-ball format. Example:

```json
{
  "match_id": "unique-id",
  "status": "completed",
  "series": {
    "id": "series-id",
    "name": "Series Name"
  },
  "format": "Test",
  "team1": {
    "name": "Team A",
    "id": "team-a-id",
    "innings": [
      {
        "runs": 250,
        "wickets": 8,
        "overs": 50,
        "batsmen": [...],
        "bowlers": [...]
      }
    ]
  },
  "team2": { ... },
  "venue": "Stadium Name",
  "date": "2025-01-15T10:00:00Z",
  "result": "Team A won by 5 runs"
}
```

---

## Bulk Import in Action

The bulk import process:

1. **Fetches** all JSON files from your GitHub repository
2. **Validates** each file is valid JSON
3. **Transforms** using the cricket data importer
4. **Saves** to MongoDB atomically
5. **Reports** success/failure for each file with statistics:
   - ✓ Successful imports
   - ✗ Failed imports with error details
   - Total time taken

---

## Automate Future Imports

### Git Workflow (Recommended)

```bash
# Keep adding new match files
cp new-matches/*.json match-data/matches/
cd match-data
git add matches/
git commit -m "Add $(date +%Y-%m-%d) matches"
git push

# Then bulk import via admin panel
```

---

## Next Steps

1. ✓ Create GitHub repository with match files
2. ✓ Use admin panel bulk import
3. ✓ Watch your website populate with thousands of matches
4. ✓ All matches now visible on homepage, schedules, results pages

Enjoy your fully-populated cricket database! 🏏
