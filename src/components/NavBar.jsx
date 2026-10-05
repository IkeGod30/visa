import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Travel Purpose', end: true },
  { to: '/assessment', label: 'Readiness Check' },
  { to: '/resources', label: 'Resources' },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">🛂</span>
          <span>
            Visa<strong>Solutions</strong> <small>NG</small>
          </span>
        </Link>
        <button className="nav-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          ☰
        </button>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={close}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/assist" className="btn btn-sm" onClick={close}>
            Get Assistance
          </Link>
        </nav>
      </div>
    </header>
  );
}
