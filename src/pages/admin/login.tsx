import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const adminPassword = password;
      localStorage.setItem('adminPassword', adminPassword);

      // Try a test call to verify password
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword,
          matches: [],
        }),
      });

      if (res.status === 401) {
        setError('Invalid password');
        localStorage.removeItem('adminPassword');
        setLoading(false);
        return;
      }

      // Login successful
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Login failed');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - CricCode</title>
      </Head>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#0f1419',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '2rem',
            backgroundColor: '#1a1f26',
            borderRadius: '8px',
            border: '1px solid #2d3339',
          }}
        >
          <h1 style={{ color: '#e8ecf1', marginBottom: '2rem', textAlign: 'center' }}>
            Admin Login
          </h1>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#a0aab8',
                }}
              >
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#252c35',
                  color: '#e8ecf1',
                  border: '1px solid #2d3339',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
                disabled={loading}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255, 68, 68, 0.1)',
                  color: '#ff4444',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#4da6ff',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#a0aab8', fontSize: '0.9rem' }}>
            Default password: admin123
          </p>
        </div>
      </div>
    </>
  );
}
