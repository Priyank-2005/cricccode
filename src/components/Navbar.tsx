import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Schedules', href: '/schedules' },
    { label: 'Results', href: '/results' },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: '#111620',
        borderBottom: '1px solid #2d3339',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4da6ff' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#4da6ff' }}>
          CricCode
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              color: isActive(item.href) ? '#4da6ff' : '#a0aab8',
              textDecoration: 'none',
              fontWeight: isActive(item.href) ? 'bold' : 'normal',
              borderBottom: isActive(item.href) ? '2px solid #4da6ff' : 'none',
              paddingBottom: '0.25rem',
              transition: 'all 0.3s ease',
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
