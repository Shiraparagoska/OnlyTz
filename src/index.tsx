import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './timeline.scss';
import 'swiper/css';

const toRad = (deg: number) => (deg * Math.PI) / 180;
const circlePoints = (n: number, cx: number, cy: number, r: number, startDeg = -90) =>
  Array.from({ length: n }, (_, i) => {
    const a = toRad(startDeg + (360 / n) * i);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

function App() {
  const pts = circlePoints(6, 400, 400, 300);

  const periods = [
    {
      from: 1990,
      to: 1995,
      events: [
        { year: 1990, text: 'Описание события 1990' },
        { year: 1991, text: 'Описание события 1991' },
        { year: 1992, text: 'Описание события 1992' },
        { year: 1993, text: 'Описание события 1993' },
        { year: 1994, text: 'Описание события 1994' },
        { year: 1995, text: 'Описание события 1995' },
      ],
    },
    {
      from: 1996,
      to: 2001,
      events: [
        { year: 1996, text: 'Описание события 1996' },
        { year: 1997, text: 'Описание события 1997' },
        { year: 1998, text: 'Описание события 1998' },
        { year: 1999, text: 'Описание события 1999' },
        { year: 2000, text: 'Описание события 2000' },
        { year: 2001, text: 'Описание события 2001' },
      ],
    },
    {
      from: 2002,
      to: 2007,
      events: [
        { year: 2002, text: 'Описание события 2002' },
        { year: 2003, text: 'Описание события 2003' },
        { year: 2004, text: 'Описание события 2004' },
        { year: 2005, text: 'Описание события 2005' },
        { year: 2006, text: 'Описание события 2006' },
        { year: 2007, text: 'Описание события 2007' },
      ],
    },
    {
      from: 2008,
      to: 2013,
      events: [
        { year: 2008, text: 'Описание события 2008' },
        { year: 2009, text: 'Описание события 2009' },
        { year: 2010, text: 'Описание события 2010' },
        { year: 2011, text: 'Описание события 2011' },
        { year: 2012, text: 'Описание события 2012' },
        { year: 2013, text: 'Описание события 2013' },
      ],
    },
    {
      from: 2014,
      to: 2019,
      events: [
        { year: 2014, text: 'Описание события 2014' },
        { year: 2015, text: 'Описание события 2015' },
        { year: 2016, text: 'Описание события 2016' },
        { year: 2017, text: 'Описание события 2017' },
        { year: 2018, text: 'Описание события 2018' },
        { year: 2019, text: 'Описание события 2019' },
      ],
    },
    {
      from: 2020,
      to: 2025,
      events: [
        { year: 2020, text: 'Описание события 2020' },
        { year: 2021, text: 'Описание события 2021' },
        { year: 2022, text: 'Описание события 2022' },
        { year: 2023, text: 'Описание события 2023' },
        { year: 2024, text: 'Описание события 2024' },
        { year: 2025, text: 'Описание события 2025' },
      ],
    },
  ] as const;

  const [activeIndex, setActiveIndex] = useState(0);

  return (
      <section className="timeline" aria-labelledby="timeline-title">
        <div className="timeline__container">
        <h2 id="timeline-title" className="timeline__title">
          Исторические даты
        </h2>
        <div className="timeline__stage">
        <div className="timeline__years">
          <span className="timeline__year timeline__year--left">{periods[activeIndex].from}</span>
          <span className="timeline__year timeline__year--right">{periods[activeIndex].to}</span>
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
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
          </div>
        </div>
        <div className="timeline__slider">
          <Swiper
            spaceBetween={100}
            slidesPerView={3}
            centeredSlides={true}
            navigation={true}
            pagination={{ clickable: true }}
            className="timeline-swiper"
          >
            {periods[activeIndex].events.map((event, i) => (
              <SwiperSlide key={i}>
                <div className="event-card">
                  <div className="event-card__year">{event.year}</div>
                  <p className="event-card__text"> {event.text}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        </div>
      </section>
  );
}

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing');
createRoot(container).render(<App />);
