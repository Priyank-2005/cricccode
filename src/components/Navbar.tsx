import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tournaments', label: 'Tournaments' },
  { href: '/schedules', label: 'Schedules' },
  { href: '/results', label: 'Results' },
  { href: '/teams', label: 'Teams' },
  { href: '/rankings', label: 'Rankings' },
];

export const Navbar: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          🏏 CricCode
        </Link>

        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`navbar-link ${
                  router.pathname === link.href ? 'active' : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
