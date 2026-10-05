import { Link } from 'react-router-dom';
import { objectives } from '../data/objectives.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h4>VisaSolutions NG</h4>
          <p>Clear, honest visa guidance for Nigerians travelling, studying, working and relocating abroad.</p>
        </div>
        <div>
          <h4>Travel purposes</h4>
          <ul>
            {objectives.map((o) => (
              <li key={o.id}>
                <Link to={`/purpose/${o.id}`}>{o.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul>
            <li><Link to="/assessment">Readiness Check</Link></li>
            <li><Link to="/assist">Request Assistance</Link></li>
            <li><Link to="/resources">Documents & FAQs</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-note">
        We are not a government agency and cannot guarantee any visa. Decisions are made only by the embassy or immigration
        authority. Always check fees and rules on official websites before you apply.
      </div>
    </footer>
  );
}
