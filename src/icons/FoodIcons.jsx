// Hand-crafted stroke-only SVG icons for Food sections.
// All icons: fill="none", stroke="currentColor", strokeWidth="1.5",
// strokeLinecap="round", strokeLinejoin="round"

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// Meal type icons ─────────────────────────────────────────────

export function BreakfastIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      {/* Horizon line */}
      <line x1="2" y1="16" x2="22" y2="16" />
      {/* Sun arc (upper half) */}
      <path d="M6 16 A6 6 0 0 1 18 16" />
      {/* Three rays */}
      <line x1="12" y1="4" x2="12" y2="7" />
      <line x1="5.6" y1="7.6" x2="7.4" y2="9.4" />
      <line x1="18.4" y1="7.6" x2="16.6" y2="9.4" />
    </svg>
  );
}

export function LunchIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      {/* Bowl */}
      <path d="M5 11 Q5 19 12 19 Q19 19 19 11" />
      <line x1="4" y1="11" x2="20" y2="11" />
      <line x1="9" y1="19" x2="15" y2="19" />
      {/* Steam */}
      <path d="M9 8 C10 6 8 4 9 2" />
      <path d="M15 8 C16 6 14 4 15 2" />
    </svg>
  );
}

export function DinnerIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      {/* Base plate */}
      <line x1="3" y1="17" x2="21" y2="17" />
      {/* Cloche dome */}
      <path d="M5 17 Q5 8 12 8 Q19 8 19 17" />
      {/* Handle/knob */}
      <line x1="12" y1="8" x2="12" y2="5" />
      <circle cx="12" cy="4.5" r="1.5" />
    </svg>
  );
}

export function SnackIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      {/* Apple body */}
      <circle cx="12" cy="14" r="7" />
      {/* Stem */}
      <path d="M12 7 C12 5 14 4 13 2" />
      {/* Leaf */}
      <path d="M12 5 C14 3 17 4 15 6" />
    </svg>
  );
}

export function OtherFoodIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

// Quality icons ────────────────────────────────────────────────

export function CleanFoodIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      {/* Leaf with center vein */}
      <path d="M12 3 C19 5 21 13 12 21 C3 13 5 5 12 3" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  );
}

export function MixedFoodIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      {/* Circle divided in half */}
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  );
}

export function JunkFoodIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      {/* Top bun arc */}
      <path d="M4 9 Q12 3 20 9" />
      {/* Patty lines */}
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="15" x2="20" y2="15" />
      {/* Bottom bun arc */}
      <path d="M4 15 Q12 21 20 15" />
    </svg>
  );
}

// Step-label icons ─────────────────────────────────────────────

export function FlameIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      <path d="M12 21 C7 21 4 17 4 13 C4 8 8 5 12 3 C11 7 14 9 15 12 C17 10 17 6 19 6 C21 9 21 15 18 18 C16 20 14 21 12 21" />
    </svg>
  );
}

export function MacrosBarsIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      <line x1="2" y1="19" x2="22" y2="19" />
      <path d="M4 19 L4 10 L8 10 L8 19" />
      <path d="M10 19 L10 6 L14 6 L14 19" />
      <path d="M16 19 L16 13 L20 13 L20 19" />
    </svg>
  );
}
