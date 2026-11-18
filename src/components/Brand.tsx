export function BeanMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path d="M8 21h30v5.6C38 35.2 32.2 41 23 41S8 34.7 8 26.7V21Z" fill="currentColor" />
      <path d="M37 23h3.6c7.1 0 6.1 10.8-4.5 10.8" stroke="currentColor" strokeWidth="3.2" />
      <path d="M5.6 44.5h35.6" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M21 16.8C15.6 11 21 3.1 29.9 2.4 33.1 10.1 29.1 17.2 21 16.8Z" fill="currentColor" />
      <path
        d="M20.5 18.1c.5-5.7 5.3-6.4 7.6-13"
        stroke="var(--bean-cut, #f9f6ee)"
        strokeWidth="1.4"
      />
    </svg>
  )
}
export function Brand() {
  return (
    <span className="brand">
      <BeanMark className="brand-icon" />
      <span className="brand-type">
        <b>کافه دانه</b>
        <span lang="en" dir="ltr">
          DANEH COFFEE HOUSE
        </span>
      </span>
    </span>
  )
}
export function Rosette({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m12 0 2.1 7.1 6-3.7-3.4 6.2L24 12l-7.3 2.1 3.6 6.2-6.2-3.6L12 24l-2.2-7.3-6.1 3.6 3.6-6.2L0 12l7.2-2.3-3.5-6.1 6.1 3.5Z" />
    </svg>
  )
}
export function CafeSeal() {
  return (
    <svg viewBox="0 0 104 104" className="cafe-seal" aria-hidden="true" fill="none">
      <defs>
        <path id="seal-ring" d="M52 52m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
      </defs>
      <circle cx="52" cy="52" r="49" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="52" cy="52" r="31.5" stroke="currentColor" strokeWidth=".85" />
      <text
        fill="currentColor"
        fontSize="8.4"
        fontWeight="600"
        fontFamily="Arial,sans-serif"
        letterSpacing="2.5"
        direction="ltr"
      >
        <textPath href="#seal-ring" textLength="238" lengthAdjust="spacing">
          DANEH COFFEE HOUSE · SLOW BREW ·{' '}
        </textPath>
      </text>
      <g stroke="currentColor" strokeWidth="1.8" transform="rotate(25 52 52)">
        <ellipse cx="52" cy="52" rx="11" ry="18" />
        <path d="M53 34c-9 12 7 20-2 36" />
      </g>
      <path
        d="m29 51 1 2 2 1-2 1-1 2-1-2-2-1 2-1Zm45-3 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"
        fill="currentColor"
      />
    </svg>
  )
}
export function BrassClip() {
  return (
    <svg viewBox="0 0 124 39" className="brass-clip" aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="clip-bar" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#b08a55" />
          <stop offset=".1" stopColor="#e2c591" />
          <stop offset=".22" stopColor="#8c6b42" />
          <stop offset=".42" stopColor="#d6b988" />
          <stop offset=".75" stopColor="#eed8ad" />
          <stop offset="1" stopColor="#9f7c48" />
        </linearGradient>
        <linearGradient id="clip-wire">
          <stop stopColor="#775737" />
          <stop offset=".08" stopColor="#e9d5a5" />
          <stop offset=".2" stopColor="#9c7746" />
          <stop offset=".72" stopColor="#e8d4a3" />
          <stop offset=".95" stopColor="#8e6e42" />
          <stop offset="1" stopColor="#735636" />
        </linearGradient>
      </defs>
      <path
        d="M15 7h-3c-5 0-8 3-8 8v14c0 4 2 6 6 6h104c4 0 6-2 6-6V15c0-6-3-8-9-8h-3"
        stroke="#725b3e"
        strokeWidth="3.8"
      />
      <path
        d="M15 7h-3c-5 0-8 3-8 8v14c0 4 2 6 6 6h104c4 0 6-2 6-6V15c0-6-3-8-9-8h-3"
        stroke="url(#clip-wire)"
        strokeWidth="2.7"
      />
      <rect
        x="11.5"
        y="2"
        width="101"
        height="12.5"
        rx="2.3"
        fill="url(#clip-bar)"
        stroke="#886b44"
        strokeWidth=".8"
      />
      <path d="M14 3.6h96M14 12.8h96" stroke="#f3dfb7" strokeWidth=".7" />
    </svg>
  )
}
