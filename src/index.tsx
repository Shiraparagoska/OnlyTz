import React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './timeline.scss';

const toRad = (deg: number) => (deg * Math.PI) / 180;
const circlePoints = (n: number, cx: number, cy: number, r: number, startDeg = -90) =>
  Array.from({ length: n }, (_, i) => {
    const a = toRad(startDeg + (360 / n) * i);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

function App() {
  const pts = circlePoints(6, 400, 400, 300);

  const periods = [
	{ from: 2015, to: 2015 },
	{ from: 2016, to: 2016 },
	{ from: 2017, to: 2017 },
	{ from: 2018, to: 2018 },
	{ from: 2019, to: 2019 },
	{ from: 2022, to: 2022 },
  ] as const;

  const [active, setActive] = useState(0);

  return (
    <main className="app" style={{ padding: 16, border: '1px dashed #999' }}>
      <h1 style={{ color: '#d00', fontSize: 32, margin: 0 }}>Старт</h1>
      <p>Пустая страница. Дальше будем добавлять блок по шагам.</p>

      <section className="timeline" aria-labelledby="timeline-title">
        <h2 id="timeline-title" className="timeline__title">
          Исторические даты
        </h2>
        <div className="timeline__years">
          <span className="timeline__year timeline__year--left">{periods[active].from}</span>
          <span className="timeline__year timeline__year--right">{periods[active].to}</span>
        </div>
        <div className="timeline__circle">
          <svg className="timeline__svg" viewBox="0 0 800 800">
            <circle className="timeline__ring" cx="400" cy="400" r="300" />
          </svg>
          <div className="timeline__dots">
            {pts.map((p, i) => (
              <span
                key={i}
                className="timeline__dot"
                style={{ left: `${(p.x / 800) * 100}%`, top: `${(p.y / 800) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing');
createRoot(container).render(<App />);
