import { useEffect, useState } from 'react';
import { load, save } from '../utils/storage.js';

// Interactive document checklist; progress persists per guide in localStorage.
export default function Checklist({ storageKey, items }) {
  const [checked, setChecked] = useState(() => load(storageKey, {}));

  useEffect(() => {
    setChecked(load(storageKey, {}));
  }, [storageKey]);

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    save(storageKey, next);
  };

  const done = items.filter((i) => checked[i.id]).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <div className="checklist">
      <div className="progress-row">
        <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-bar" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-label">
          {done}/{items.length} ready
        </span>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={checked[item.id] ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={!!checked[item.id]} onChange={() => toggle(item.id)} />
              <span>
                <strong>{item.name}</strong>
                {item.detail && <span className="muted"> — {item.detail}</span>}
                {item.where && <span className="where">Where: {item.where}</span>}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
