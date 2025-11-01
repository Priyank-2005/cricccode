import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Match {
  _id: string;
  matchId: string;
  team1: { name: string };
  team2: { name: string };
  date: string;
  status: string;
  result?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminPassword, setAdminPassword] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'view' | 'import' | 'update'>('view');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [updateData, setUpdateData] = useState<any>({});
  const [importFile, setImportFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('adminPassword');
    if (!stored) {
      router.push('/admin/login');
    } else {
      setAdminPassword(stored);
      fetchMatches(stored);
    }
  }, [router]);

  const fetchMatches = async (password: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/matches?limit=1000');
      const data = await res.json();
      setMatches(data.data || []);
    } catch (error) {
      setMessage('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    try {
      const res = await fetch(`/api/match/${selectedMatch.matchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword,
          ...updateData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Match updated successfully!');
        setSelectedMatch(null);
        setUpdateData({});
        fetchMatches(adminPassword);
      } else {
        setMessage(data.error || 'Update failed');
      }
    } catch (error) {
      setMessage('Update failed');
    }
  };

  const handleImportJSON = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;

    try {
      const text = await importFile.text();
      const matches = JSON.parse(text);

      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword,
          matches: Array.isArray(matches) ? matches : [matches],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          `Import successful! Imported: ${data.stats.imported}, Updated: ${data.stats.updated}`
        );
        setImportFile(null);
        fetchMatches(adminPassword);
      } else {
        setMessage(data.error || 'Import failed');
      }
    } catch (error) {
      setMessage('Invalid JSON file');
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
        <title>Admin Dashboard - CricCode</title>
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
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
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
          {/* Quick Links */}
          <div style={{ marginBottom: '2rem', textAlign: 'right' }}>
            <a
              href="/admin/import-data"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#4caf50',
                color: 'white',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              Paste JSON Data
            </a>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              borderBottom: '1px solid #2d3339',
            }}
          >
            {(['view', 'import', 'update'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: activeTab === tab ? '#4da6ff' : 'transparent',
                  color: activeTab === tab ? '#000' : '#a0aab8',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab ? 'bold' : 'normal',
                  textTransform: 'capitalize',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {message && (
            <div
              style={{
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: message.includes('failed')
                  ? 'rgba(255, 68, 68, 0.1)'
                  : 'rgba(76, 175, 80, 0.1)',
                color: message.includes('failed') ? '#ff4444' : '#4caf50',
                borderRadius: '4px',
              }}
            >
              {message}
            </div>
          )}

          {/* View Matches Tab */}
          {activeTab === 'view' && (
            <div>
              <h2>All Matches ({matches.length})</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gap: '1rem',
                  }}
                >
                  {matches.map((match) => (
                    <div
                      key={match._id}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#1a1f26',
                        border: '1px solid #2d3339',
                        borderRadius: '4px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {match.team1.name} vs {match.team2.name}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#a0aab8' }}>
                          {new Date(match.date).toLocaleDateString()} •{' '}
                          <span
                            style={{
                              color:
                                match.status === 'completed'
                                  ? '#4caf50'
                                  : match.status === 'live'
                                  ? '#ff4444'
                                  : '#4da6ff',
                            }}
                          >
                            {match.status.toUpperCase()}
                          </span>
                        </div>
                        {match.result && (
                          <div style={{ fontSize: '0.9rem', color: '#ffa500', marginTop: '0.25rem' }}>
                            {match.result}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedMatch(match);
                          setActiveTab('update');
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#4da6ff',
                          color: '#000',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Import Tab */}
          {activeTab === 'import' && (
            <div>
              <h2>Import Matches from JSON</h2>
              <form onSubmit={handleImportJSON}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Select JSON file:
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#1a1f26',
                      color: '#e8ecf1',
                      border: '1px solid #2d3339',
                      borderRadius: '4px',
                      width: '100%',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!importFile}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: importFile ? '#4da6ff' : '#2d3339',
                    color: importFile ? '#000' : '#6b7684',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: importFile ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                  }}
                >
                  Import
                </button>
              </form>
            </div>
          )}

          {/* Update Tab */}
          {activeTab === 'update' && selectedMatch && (
            <div>
              <h2>Update Match</h2>
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#1a1f26',
                  borderRadius: '4px',
                  border: '1px solid #2d3339',
                }}
              >
                <p>
                  <strong>{selectedMatch.team1.name} vs {selectedMatch.team2.name}</strong>
                </p>
                <p style={{ color: '#a0aab8' }}>
                  {new Date(selectedMatch.date).toLocaleDateString()}
                </p>
              </div>

              <form onSubmit={handleUpdateMatch}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status</label>
                  <select
                    value={updateData.status || selectedMatch.status}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, status: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: '#1a1f26',
                      color: '#e8ecf1',
                      border: '1px solid #2d3339',
                      borderRadius: '4px',
                    }}
                  >
                    <option>upcoming</option>
                    <option>live</option>
                    <option>completed</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Result</label>
                  <input
                    type="text"
                    value={updateData.result || selectedMatch.result || ''}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, result: e.target.value })
                    }
                    placeholder="e.g., Team A won by 5 runs"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: '#1a1f26',
                      color: '#e8ecf1',
                      border: '1px solid #2d3339',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Man of the Match
                  </label>
                  <input
                    type="text"
                    value={updateData.manOfTheMatch || ''}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, manOfTheMatch: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: '#1a1f26',
                      color: '#e8ecf1',
                      border: '1px solid #2d3339',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMatch(null)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#2d3339',
                      color: '#a0aab8',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
