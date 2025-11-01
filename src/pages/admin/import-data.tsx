import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

type ImportMode = 'ballbyball' | 'upcoming' | 'bulk';
type ImportTab = 'single' | 'bulk';

export default function AdminImportData() {
  const router = useRouter();
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState<ImportTab>('single');
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [importMode, setImportMode] = useState<ImportMode>('upcoming');

  // Bulk import states
  const [githubOwner, setGithubOwner] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [githubPath, setGithubPath] = useState('matches');
  const [githubToken, setGithubToken] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('adminPassword');
    if (!stored) {
      router.push('/admin/login');
    } else {
      setAdminPassword(stored);
    }
  }, [router]);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jsonInput.trim()) {
      setMessage('Please paste JSON data');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      // Parse JSON to validate
      const jsonData = JSON.parse(jsonInput);

      // Determine the correct endpoint based on import mode
      const endpoint = importMode === 'ballbyball'
        ? '/api/admin/import-json'
        : '/api/admin/import-upcoming';

      // Send to API
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword,
          jsonData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (importMode === 'ballbyball') {
          // Single match response
          setMessage(`✓ ${data.message} - Match ID: ${data.matchId}`);
        } else {
          // Batch import response
          setMessage(`✓ ${data.message}`);
        }
        setMessageType('success');
        setJsonInput('');
      } else {
        setMessage(`✗ ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`✗ Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!githubOwner.trim() || !githubRepo.trim()) {
      setMessage('Please enter GitHub owner and repository name');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const res = await fetch('/api/admin/bulk-import-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword,
          githubOwner,
          githubRepo,
          githubPath,
          githubToken: githubToken || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          `✓ ${data.message}\n\nSuccessful: ${data.result.success}\nFailed: ${data.result.failed}${
            data.result.errors.length > 0
              ? `\n\nFailed Files:\n${data.result.errors.map((e: any) => `- ${e.file}: ${e.error}`).join('\n')}`
              : ''
          }`
        );
        setMessageType('success');
        setGithubOwner('');
        setGithubRepo('');
        setGithubToken('');
      } else {
        setMessage(`✗ ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(
        `✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminPassword');
    router.push('/admin/login');
  };

  if (!adminPassword) return null;

  return (
    <>
      <Head>
        <title>Import Match Data - CricCode Admin</title>
      </Head>

      <div style={{ backgroundColor: '#0f1419', minHeight: '100vh', color: '#e8ecf1' }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: '#111620',
            padding: '1rem',
            borderBottom: '1px solid #2d3339',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1 style={{ margin: 0 }}>Import Match Data</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div
            style={{
              backgroundColor: '#1a1f26',
              border: '1px solid #2d3339',
              borderRadius: '8px',
              padding: '2rem',
            }}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #2d3339', paddingBottom: '1rem' }}>
              <button
                onClick={() => setActiveTab('single')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: activeTab === 'single' ? '#4da6ff' : 'transparent',
                  color: activeTab === 'single' ? '#000' : '#a0aab8',
                  border: activeTab === 'single' ? '1px solid #4da6ff' : '1px solid #2d3339',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                }}
              >
                Single Import
              </button>
              <button
                onClick={() => setActiveTab('bulk')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: activeTab === 'bulk' ? '#4da6ff' : 'transparent',
                  color: activeTab === 'bulk' ? '#000' : '#a0aab8',
                  border: activeTab === 'bulk' ? '1px solid #4da6ff' : '1px solid #2d3339',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                }}
              >
                Bulk Import (GitHub)
              </button>
            </div>

            {activeTab === 'single' && (
              <>
                <h2 style={{ marginTop: 0, color: '#e8ecf1' }}>Paste Cricket Match JSON</h2>

            <form onSubmit={handleImport}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    color: '#a0aab8',
                    fontWeight: 'bold',
                  }}
                >
                  Import Type
                </label>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      color: '#e8ecf1',
                    }}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="ballbyball"
                      checked={importMode === 'ballbyball'}
                      onChange={(e) => setImportMode(e.target.value as ImportMode)}
                      disabled={loading}
                      style={{ cursor: 'pointer' }}
                    />
                    Ball-by-Ball Match (Single)
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      color: '#e8ecf1',
                    }}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="upcoming"
                      checked={importMode === 'upcoming'}
                      onChange={(e) => setImportMode(e.target.value as ImportMode)}
                      disabled={loading}
                      style={{ cursor: 'pointer' }}
                    />
                    Upcoming Matches (Batch)
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    color: '#a0aab8',
                    fontWeight: 'bold',
                  }}
                >
                  {importMode === 'ballbyball'
                    ? 'Cricket Match JSON (Ball-by-Ball Data)'
                    : 'Upcoming Matches JSON (Tournament Data)'}
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  style={{
                    width: '100%',
                    height: '400px',
                    padding: '1rem',
                    backgroundColor: '#252c35',
                    color: '#e8ecf1',
                    border: '1px solid #2d3339',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                  }}
                  placeholder='Paste your cricket match JSON here...'
                  disabled={loading}
                />
              </div>

              {message && (
                <div
                  style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor:
                      messageType === 'success'
                        ? 'rgba(76, 175, 80, 0.1)'
                        : 'rgba(255, 68, 68, 0.1)',
                    color: messageType === 'success' ? '#4caf50' : '#ff4444',
                    borderRadius: '4px',
                    border: `1px solid ${messageType === 'success' ? '#4caf50' : '#ff4444'}`,
                    wordBreak: 'break-word',
                  }}
                >
                  {message}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={loading || !jsonInput.trim()}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: jsonInput.trim() ? '#4da6ff' : '#2d3339',
                    color: jsonInput.trim() ? '#000' : '#6b7684',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: jsonInput.trim() ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  {loading
                    ? 'Importing...'
                    : importMode === 'ballbyball'
                      ? 'Import Match'
                      : 'Import Matches'}
                </button>

                <button
                  type="button"
                  onClick={() => setJsonInput('')}
                  disabled={loading}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#2d3339',
                    color: '#a0aab8',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Clear
                </button>
              </div>
            </form>

                <div
                  style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    backgroundColor: '#252c35',
                    borderRadius: '4px',
                    border: '1px solid #2d3339',
                  }}
                >
                  <h3 style={{ marginTop: 0, color: '#e8ecf1' }}>Instructions</h3>
                  {importMode === 'ballbyball' ? (
                    <ul style={{ color: '#a0aab8', lineHeight: '1.8' }}>
                      <li>Get your match JSON file with ball-by-ball data</li>
                      <li>Copy the entire JSON content</li>
                      <li>Paste it in the textarea above</li>
                      <li>Click "Import Match"</li>
                      <li>The system will parse and store the completed match data in database</li>
                      <li>Includes all innings, batsmen, bowlers, and deliveries</li>
                    </ul>
                  ) : (
                    <ul style={{ color: '#a0aab8', lineHeight: '1.8' }}>
                      <li>Get your upcoming matches JSON file (series_tournaments array)</li>
                      <li>Copy the entire JSON content</li>
                      <li>Paste it in the textarea above</li>
                      <li>Click "Import Matches"</li>
                      <li>The system will batch import all upcoming matches from the file</li>
                      <li>Each match is parsed to extract teams, dates, venue, and format</li>
                    </ul>
                  )}
                </div>
              </>
            )}

            {activeTab === 'bulk' && (
              <>
                <h2 style={{ marginTop: 0, color: '#e8ecf1' }}>Bulk Import from GitHub</h2>

                <form onSubmit={handleBulkImport}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#a0aab8',
                        fontWeight: 'bold',
                      }}
                    >
                      GitHub Repository Owner
                    </label>
                    <input
                      type="text"
                      value={githubOwner}
                      onChange={(e) => setGithubOwner(e.target.value)}
                      placeholder="e.g., your-username"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#252c35',
                        color: '#e8ecf1',
                        border: '1px solid #2d3339',
                        borderRadius: '4px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#a0aab8',
                        fontWeight: 'bold',
                      }}
                    >
                      Repository Name
                    </label>
                    <input
                      type="text"
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value)}
                      placeholder="e.g., match-data"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#252c35',
                        color: '#e8ecf1',
                        border: '1px solid #2d3339',
                        borderRadius: '4px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#a0aab8',
                        fontWeight: 'bold',
                      }}
                    >
                      Folder Path (default: matches)
                    </label>
                    <input
                      type="text"
                      value={githubPath}
                      onChange={(e) => setGithubPath(e.target.value)}
                      placeholder="e.g., matches or data/2025"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#252c35',
                        color: '#e8ecf1',
                        border: '1px solid #2d3339',
                        borderRadius: '4px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#a0aab8',
                        fontWeight: 'bold',
                      }}
                    >
                      GitHub Personal Access Token (optional for private repos)
                    </label>
                    <input
                      type="password"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="Leave blank for public repos"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#252c35',
                        color: '#e8ecf1',
                        border: '1px solid #2d3339',
                        borderRadius: '4px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  {message && (
                    <div
                      style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        backgroundColor:
                          messageType === 'success'
                            ? 'rgba(76, 175, 80, 0.1)'
                            : 'rgba(255, 68, 68, 0.1)',
                        color: messageType === 'success' ? '#4caf50' : '#ff4444',
                        borderRadius: '4px',
                        border: `1px solid ${messageType === 'success' ? '#4caf50' : '#ff4444'}`,
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                        maxHeight: '300px',
                        overflowY: 'auto',
                      }}
                    >
                      {message}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="submit"
                      disabled={loading || !githubOwner.trim() || !githubRepo.trim()}
                      style={{
                        padding: '0.75rem 2rem',
                        backgroundColor:
                          githubOwner.trim() && githubRepo.trim()
                            ? '#4da6ff'
                            : '#2d3339',
                        color:
                          githubOwner.trim() && githubRepo.trim()
                            ? '#000'
                            : '#6b7684',
                        border: 'none',
                        borderRadius: '4px',
                        cursor:
                          githubOwner.trim() && githubRepo.trim()
                            ? 'pointer'
                            : 'not-allowed',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                      }}
                    >
                      {loading ? 'Importing...' : 'Start Bulk Import'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGithubOwner('');
                        setGithubRepo('');
                        setGithubPath('matches');
                        setGithubToken('');
                      }}
                      disabled={loading}
                      style={{
                        padding: '0.75rem 2rem',
                        backgroundColor: '#2d3339',
                        color: '#a0aab8',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </form>

                <div
                  style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    backgroundColor: '#252c35',
                    borderRadius: '4px',
                    border: '1px solid #2d3339',
                  }}
                >
                  <h3 style={{ marginTop: 0, color: '#e8ecf1' }}>Instructions</h3>
                  <ol style={{ color: '#a0aab8', lineHeight: '1.8' }}>
                    <li>Create a GitHub repository (or use existing one)</li>
                    <li>Create a folder named "matches" (or your preferred path)</li>
                    <li>Upload all your match JSON files to this folder</li>
                    <li>Enter your GitHub username in "Repository Owner"</li>
                    <li>Enter your repo name in "Repository Name"</li>
                    <li>Enter the folder path where JSON files are stored</li>
                    <li>Click "Start Bulk Import"</li>
                    <li>
                      The system will fetch all JSON files and import them
                      automatically
                    </li>
                  </ol>
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: '#1a1f26',
                      borderRadius: '4px',
                      border: '1px solid #2d3339',
                    }}
                  >
                    <strong style={{ color: '#4da6ff' }}>Note:</strong>
                    <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                      <li>Repository must be public (or provide access token)</li>
                      <li>All files in folder will be processed (must be JSON)</li>
                      <li>Failed imports are reported with error details</li>
                      <li>Duplicate matches (same match ID) will be skipped</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
