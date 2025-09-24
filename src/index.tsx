import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './timeline.scss';
import 'swiper/css';
import gsap from 'gsap';

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

  const total = pts.length;
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === total - 1;

  const goPrev = () => setActiveIndex((i) => (i - 1 + pts.length) % pts.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % pts.length);

  // управление слайдером событий
  const sliderRef = useRef<SwiperInstance | null>(null);
  const [isBegin, setIsBegin] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const bindEdges = (sw?: SwiperInstance | null) => {
    if (!sw) return;
    setIsBegin(sw.isBeginning);
    setIsEnd(sw.isEnd);
  };

  // GSAP: плавный пересчёт лет
  const leftYearRef = useRef<HTMLSpanElement | null>(null);
  const rightYearRef = useRef<HTMLSpanElement | null>(null);
  const yearFrom = useRef<{ v: number }>({ v: periods[0].from });
  const yearTo = useRef<{ v: number }>({ v: periods[0].to });

  useEffect(() => {
    const leftEl = leftYearRef.current;
    const rightEl = rightYearRef.current;
    if (!leftEl || !rightEl) return;

    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.to(
      yearFrom.current,
      {
        v: periods[activeIndex].from,
        duration: 0.6,
        onUpdate: () => {
          if (leftEl) {
            leftEl.textContent = String(Math.round(yearFrom.current.v));
          }
        },
      },
      0,
    );
    tl.to(
      yearTo.current,
      {
        v: periods[activeIndex].to,
        duration: 0.6,
        onUpdate: () => {
          if (rightEl) {
            rightEl.textContent = String(Math.round(yearTo.current.v));
          }
        },
      },
      0,
    );

    return () => {
      tl.kill();
    };
  }, [activeIndex]);

  // Поворот контейнера точек: активная в первой четверти (около -45°)
  const dotsRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef<{ val: number }>({ val: 0 });
  const getAngleDeg = (i: number) => -90 + (360 / pts.length) * i; // как в генераторе
  useEffect(() => {
    const targetDeg = -45;
    const currentDeg = getAngleDeg(activeIndex);
    const targetRotation = targetDeg - currentDeg;

    const el = dotsRef.current;
    if (!el) return;

    gsap.to(rotationRef.current, {
      val: targetRotation,
      duration: 0.8, // медленнее прокрутка
      ease: 'power2.out',
      onUpdate: () => {
        const v = rotationRef.current.val;
        el.style.setProperty('--rot', `${v}deg`);
        el.style.setProperty('--counter-rot', `${-v}deg`);
      },
    });
  }, [activeIndex, pts.length]);

  return (
    <section className="timeline" aria-labelledby="timeline-title">
      <div className="timeline__container">
        <h2 id="timeline-title" className="timeline__title">
          Исторические даты
        </h2>

        <div className="timeline__stage">
          <div className="timeline__years">
            <span className="timeline__year timeline__year--left">
              <span className="timeline__year-inner" ref={leftYearRef}>
                {periods[activeIndex].from}
              </span>
            </span>
            <span className="timeline__year timeline__year--right">
              <span className="timeline__year-inner" ref={rightYearRef}>
                {periods[activeIndex].to}
              </span>
            </span>
          </div>
          <div className="timeline__circle">
            <svg className="timeline__svg" viewBox="0 0 800 800">
              <circle className="timeline__ring" cx="400" cy="400" r="300" />
            </svg>
            <div className="timeline__dots" ref={dotsRef}>
              {pts.map((p, i) => (
                <span
                  key={i}
                  className={`timeline__dot ${i === activeIndex ? 'is-active' : ''}`}
                  style={{ left: `${(p.x / 800) * 100}%`, top: `${(p.y / 800) * 100}%` }}
                  onClick={() => setActiveIndex(i)}
                >
                  {i === activeIndex && <span className="timeline__dot-num">{i + 1}</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="timeline__switcher" role="group" aria-label="Переключение периода">
          <div className="timeline__switcher-num">{`${String(activeIndex + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`}</div>
          <div className="timeline__switcher-controls">
            <button
              type="button"
              className="timeline__switcher-btn"
              aria-label="Предыдущий период"
              onClick={goPrev}
              disabled={isFirst}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M15 18l-6-6 6-6"
                  fill="none"
                  stroke="#303e58"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="timeline__switcher-btn"
              aria-label="Следующий период"
              onClick={goNext}
              disabled={isLast}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M9 6l6 6-6 6"
                  fill="none"
                  stroke="#303e58"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="timeline__slider-wrap">
          <button
            type="button"
            className="timeline-slider-nav timeline-slider-prev"
            aria-label="Назад"
            disabled={isBegin}
            onClick={() => sliderRef.current?.slidePrev()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="#303e58"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="timeline__slider">
            <Swiper
              key={activeIndex}
              spaceBetween={100}
              slidesPerView={'auto'}
              slidesPerGroup={1}
              centeredSlides={false}
              watchOverflow={true}
              observer={true}
              observeParents={true}
              slidesOffsetBefore={0}
              slidesOffsetAfter={0}
              onSwiper={(sw) => {
                sliderRef.current = sw;
                bindEdges(sw);
              }}
              onSlideChange={(sw) => bindEdges(sw)}
              navigation={{ prevEl: '.timeline-slider-prev', nextEl: '.timeline-slider-next' }}
              pagination={{ clickable: true }}
              breakpoints={{
                0: { spaceBetween: 16, slidesPerView: 'auto' as const },
                601: { spaceBetween: 80, slidesPerView: 'auto' as const },
              }}
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

          <button
            type="button"
            className="timeline-slider-nav timeline-slider-next"
            aria-label="Вперёд"
            disabled={isEnd}
            onClick={() => sliderRef.current?.slideNext()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="#303e58"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing');
createRoot(container).render(<App />);
