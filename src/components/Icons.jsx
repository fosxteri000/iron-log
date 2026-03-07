import React from "react";

export function DumbbellIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6.5 6.5h11M6.5 17.5h11" />
      <rect x="2" y="4" width="4" height="16" rx="1" />
      <rect x="18" y="4" width="4" height="16" rx="1" />
      <line x1="12" y1="6.5" x2="12" y2="17.5" />
    </svg>
  );
}

export function BarbellIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="2" y1="12" x2="22" y2="12" />
      <rect x="4" y="7" width="3" height="10" rx="0.5" />
      <rect x="17" y="7" width="3" height="10" rx="0.5" />
      <rect x="1" y="9" width="2" height="6" rx="0.5" />
      <rect x="21" y="9" width="2" height="6" rx="0.5" />
    </svg>
  );
}

export function HeartPulseIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 21C12 21 3 13.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 12 5.09C12.09 3.81 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 13.5 12 21 12 21Z" />
      <polyline points="4,13 9,13 10,10 12,16 14,12 15,13 20,13" />
    </svg>
  );
}

export function ScaleIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M12 7v4" />
      <path d="M8 16a4 4 0 0 1 8 0" />
      <circle cx="12" cy="11" r="1" />
    </svg>
  );
}

export function FlameIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2C8 7 4 10 4 14a8 8 0 0 0 16 0c0-4-4-7-8-12Z" />
      <path d="M12 22c-2.2 0-4-1.8-4-4 0-2 2-3.5 4-6 2 2.5 4 4 4 6 0 2.2-1.8 4-4 4Z" />
    </svg>
  );
}

export function TrophyIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 2h12v6a6 6 0 0 1-12 0V2Z" />
      <path d="M6 4H3a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4" />
      <path d="M18 4h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4" />
      <line x1="12" y1="14" x2="12" y2="18" />
      <path d="M8 18h8a1 1 0 0 1 1 1v1H7v-1a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function LegIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3C12 3 10 8 10 12C10 15 9 18 7 21" />
      <path d="M12 3C12 3 14 8 14 12C14 15 15 18 17 21" />
      <path d="M5 21h4M15 21h4" />
    </svg>
  );
}

export function TimerIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="13" r="8" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="13" x2="15" y2="13" />
      <line x1="10" y1="2" x2="14" y2="2" />
      <line x1="12" y1="2" x2="12" y2="5" />
    </svg>
  );
}

export function CalendarIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function SettingsIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

export function TrashIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function UserIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function LightbulbIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18h6M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
    </svg>
  );
}

/* ─── Cardio Type Icons ───────────────────────────────────── */

export function RunningIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="14" cy="3.5" r="1.5" />
      <path d="M12 7l-3 5M12 7l2 4" />
      <path d="M9 12l-3 6M14 11l2 7" />
      <path d="M6 18l2 2M16 18h3" />
    </svg>
  );
}

export function WalkingIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="3.5" r="1.5" />
      <path d="M12 5.5l-1 6" />
      <path d="M8 9l3-1M11 10l4-1" />
      <path d="M11 11.5l-2 7M11 11.5l3 5" />
      <path d="M7 20l2-1M14 16.5l3 2" />
    </svg>
  );
}

export function EllipticalIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="12" rx="9" ry="5" />
      <path d="M12 7v10M3 12h18" strokeDasharray="3 2" />
      <circle cx="12" cy="7" r="1.5" />
    </svg>
  );
}

export function SwimmingIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="4" cy="10" r="1.5" />
      <path d="M5.5 10l5 2 5-3 4 1" />
      <path d="M10.5 12l3 3M15.5 9l3 5" />
      <path d="M2 18c2-2 4 0 6-2s4 0 6-2 4 0 6-2" />
    </svg>
  );
}

export function PaletteIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
      <path d="M12 21a3 3 0 0 1 0-6h3a3 3 0 0 0 3-3" />
    </svg>
  );
}

export function PlusIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* ─── Icon Maps ───────────────────────────────────────────── */

export const CATEGORY_ICONS = {
  Push:        DumbbellIcon,
  Pull:        BarbellIcon,
  Leg:         LegIcon,
  Legs:        LegIcon,
  Cardio:      HeartPulseIcon,
  Upper:       BarbellIcon,
  Lower:       LegIcon,
  "Full Body": DumbbellIcon,
  Chest:       DumbbellIcon,
  Back:        BarbellIcon,
  Shoulders:   DumbbellIcon,
  Arms:        DumbbellIcon,
  Core:        FlameIcon,
  Glutes:      LegIcon,
};

export const CARDIO_TYPE_ICONS = {
  Run:        RunningIcon,
  Walk:       WalkingIcon,
  Elliptical: EllipticalIcon,
  Swim:       SwimmingIcon,
  Other:      HeartPulseIcon,
};

export const CARDIO_TYPES = ["Run", "Walk", "Elliptical", "Swim", "Other"];

/* ─── Cheat Day Icons ─────────────────────────────────────── */

export function DevilIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="14" r="6" />
      <path d="M8 8L6 3M16 8L18 3" />
      <circle cx="10" cy="13" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="13" r="0.8" fill="currentColor" stroke="none" />
      <path d="M10 16.5c1 1 3 1 4 0" />
    </svg>
  );
}

export function HaloIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="15" r="6" />
      <ellipse cx="12" cy="5" rx="5" ry="2" />
      <circle cx="10" cy="14" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="14" r="0.8" fill="currentColor" stroke="none" />
      <path d="M10 17c1 1 3 1 4 0" />
    </svg>
  );
}

// Dumbbell with Zzz above
export function SkippedTrainingIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="16" x2="20" y2="16" />
      <rect x="6" y="13" width="3" height="6" rx="0.5" />
      <rect x="15" y="13" width="3" height="6" rx="0.5" />
      <text x="13" y="7" fontSize="6" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="sans-serif">Z</text>
      <text x="16" y="5" fontSize="5" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="sans-serif">z</text>
      <text x="18.5" y="3.5" fontSize="4" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="sans-serif">z</text>
    </svg>
  );
}

// Running shoe with X
export function SkippedCardioIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 17h18l-2-4H7l-2-3-2 1z" />
      <path d="M9 13l1-3M13 13l1-3" />
      <line x1="5" y1="5" x2="19" y2="19" strokeWidth="2.5" />
    </svg>
  );
}

// Burger stacked high
export function BurgerIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 10a7 7 0 0 1 14 0" />
      <path d="M4 12h16" />
      <path d="M5 14l2-1 2 1 2-1 2 1 2-1 2 1" />
      <path d="M5 16h14v1c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-1z" />
    </svg>
  );
}

// Stick figure lying flat
export function LazyIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="2" y1="18" x2="22" y2="18" />
      <circle cx="18" cy="14" r="1.5" />
      <line x1="4" y1="15" x2="16" y2="15" />
      <path d="M4 15l-1-3M8 15l2-4" />
      <path d="M12 15l3-3" />
    </svg>
  );
}

// Beer mug with foam
export function BeerIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="8" width="10" height="13" rx="1" />
      <path d="M15 11h3a2 2 0 0 1 0 4h-3" />
      <path d="M5 8c1-2 3-3 5-3s4 1 5 3" />
    </svg>
  );
}

// Cigarette with curling smoke
export function CigaretteIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="14" width="15" height="3" rx="0.5" />
      <line x1="15" y1="14" x2="15" y2="17" />
      <path d="M5 14c0-1 1-3 2-5s0-4 0-4" />
      <path d="M8 14c0-1 1-3 2-5s0-4 0-4" />
    </svg>
  );
}

// Moon with tired half-closed eyes
export function StayedUpLateIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      <path d="M9 13h1.5" strokeWidth="2.5" />
      <path d="M13.5 13H15" strokeWidth="2.5" />
      <path d="M10 16c.8.5 3.2.5 4 0" />
    </svg>
  );
}

// Dry water bottle tipped over
export function ZeroWaterIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 4l5 14H10L5 4" />
      <path d="M9 2h6" />
      <path d="M10 4v-2M14 4v-2" />
      <path d="M18 20l2 1" strokeDasharray="2 2" />
      <path d="M19 17l3 0" strokeDasharray="2 2" />
    </svg>
  );
}

// Fork flying into mouth at speed
export function StressEatingIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="18" cy="10" r="4" />
      <path d="M16.5 9.5h0M19.5 9.5h0" strokeWidth="3" strokeLinecap="round" />
      <path d="M17 12.5c.5.3 1.5.3 2 0" />
      <line x1="3" y1="10" x2="14" y2="10" />
      <path d="M3 7v6M5 7v6M7 7v6" />
      <path d="M1 11l3-1M1 9l3 1" />
    </svg>
  );
}

// Stick figure refusing to bend
export function SkippedStretchingIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="4" r="2" />
      <line x1="12" y1="6" x2="12" y2="15" />
      <line x1="12" y1="15" x2="9" y2="21" />
      <line x1="12" y1="15" x2="15" y2="21" />
      <path d="M7 9l5 1 5-1" />
      <path d="M4 7l2 2M20 7l-2 2" />
    </svg>
  );
}

export function EyeIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  );
}

/* ─── Split Program Icons (sketchy/quirky 48x48) ──────────── */

// PPL: Three panels - push, pull, kick
export function SplitPPLIcon({ size = 48, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Panel dividers */}
      <line x1="16" y1="6" x2="16" y2="42" strokeDasharray="3 2" />
      <line x1="32" y1="6" x2="32" y2="42" strokeDasharray="3 2" />
      {/* Push: arm pushing forward */}
      <circle cx="6" cy="14" r="2" />
      <path d="M6 16v8M6 20l6-2" />
      <path d="M12 18l2 0" strokeWidth="2" />
      {/* Pull: arm pulling back */}
      <circle cx="24" cy="14" r="2" />
      <path d="M24 16v8M24 20l-5 0" />
      <path d="M19 20l-2 0" strokeWidth="2" />
      {/* Leg: leg kicking */}
      <circle cx="40" cy="14" r="2" />
      <path d="M40 16v6M40 22l-3 6M40 22l4 4" />
      <path d="M37 28l-1 2" />
      {/* Motion lines */}
      <path d="M13 17l1.5 0M13 19l1.5 0" strokeWidth="1" opacity="0.5" />
      <path d="M44 25l1 1M44 27l1 1" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

// Upper/Lower: Body split at waist
export function SplitUpperLowerIcon({ size = 48, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Head */}
      <circle cx="24" cy="8" r="3" />
      {/* Upper body flexing */}
      <path d="M24 11v10" />
      <path d="M24 14l-7-2" />
      <path d="M17 12l-1-4" strokeWidth="2" />
      <path d="M24 14l7-2" />
      <path d="M31 12l1-4" strokeWidth="2" />
      {/* Waist cut line */}
      <line x1="14" y1="22" x2="34" y2="22" strokeDasharray="4 2" strokeWidth="2" opacity="0.6" />
      {/* Lower body squatting */}
      <path d="M24 22l-5 8" />
      <path d="M24 22l5 8" />
      <path d="M19 30l-2 6M29 30l2 6" />
      {/* Cut indicator */}
      <path d="M12 20l2 2M12 24l2-2M36 20l-2 2M36 24l-2-2" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

// Full Body: star jump with motion lines
export function SplitFullBodyIcon({ size = 48, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Head */}
      <circle cx="24" cy="10" r="3" />
      {/* Body */}
      <path d="M24 13v10" />
      {/* Arms out */}
      <path d="M24 16l-10-4M24 16l10-4" />
      {/* Legs out */}
      <path d="M24 23l-8 12M24 23l8 12" />
      {/* Motion lines everywhere */}
      <path d="M11 10l-3-2M37 10l3-2" strokeWidth="1.5" opacity="0.5" />
      <path d="M10 14l-3 0M38 14l3 0" strokeWidth="1.5" opacity="0.5" />
      <path d="M14 36l-2 2M34 36l2 2" strokeWidth="1.5" opacity="0.5" />
      <path d="M24 5l0-2M21 6l-1-2M27 6l1-2" strokeWidth="1" opacity="0.4" />
      {/* Energy burst */}
      <circle cx="24" cy="18" r="6" strokeDasharray="2 3" opacity="0.3" />
    </svg>
  );
}

// Bro Split: bodybuilder with tiny sunglasses
export function SplitBroIcon({ size = 48, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Head */}
      <circle cx="24" cy="10" r="4" />
      {/* Sunglasses */}
      <rect x="20" y="9" width="3.5" height="2" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="24.5" y="9" width="3.5" height="2" rx="0.5" fill="currentColor" stroke="none" />
      <line x1="23.5" y1="10" x2="24.5" y2="10" strokeWidth="1" />
      {/* Neck */}
      <path d="M24 14v2" strokeWidth="3" />
      {/* Shoulders + traps wide */}
      <path d="M14 20h20" strokeWidth="2" />
      <path d="M24 16l-10 4M24 16l10 4" />
      {/* Arms flexing - double bicep */}
      <path d="M14 20l-2-6" strokeWidth="2.5" />
      <path d="M12 14l-3 0" strokeWidth="2.5" />
      <path d="M34 20l2-6" strokeWidth="2.5" />
      <path d="M36 14l3 0" strokeWidth="2.5" />
      {/* Torso */}
      <path d="M18 20v12M30 20v12" />
      <path d="M18 32l-2 8M30 32l2 8" />
      {/* V taper lines */}
      <path d="M20 20v10M28 20v10" strokeDasharray="2 2" opacity="0.3" />
    </svg>
  );
}

// PPLUL: brain with gears
export function SplitPPLULIcon({ size = 48, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Brain outline */}
      <path d="M16 28c-4-2-6-6-6-10 0-6 6-10 14-10s14 4 14 10c0 4-2 8-6 10" />
      <path d="M24 8v20" strokeDasharray="3 2" opacity="0.4" />
      {/* Brain wrinkles */}
      <path d="M16 14c4 2 8-1 8 2" opacity="0.6" />
      <path d="M24 16c4-2 8 1 8-2" opacity="0.6" />
      <path d="M14 20c5 1 6-2 10 0" opacity="0.6" />
      {/* Gear 1 */}
      <circle cx="18" cy="36" r="4" />
      <circle cx="18" cy="36" r="1.5" />
      <path d="M18 31v1M18 41v-1M13 36h1M23 36h-1" strokeWidth="2" />
      {/* Gear 2 */}
      <circle cx="32" cy="38" r="3" />
      <circle cx="32" cy="38" r="1" />
      <path d="M32 34.5v.5M32 41v-.5M28.5 38h.5M35 38h-.5" strokeWidth="1.5" />
      {/* Connection */}
      <path d="M21.5 37.5l7 1" strokeDasharray="2 1" opacity="0.4" />
    </svg>
  );
}

// Custom: notepad with question mark and pencil
export function SplitCustomIcon({ size = 48, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Notepad */}
      <rect x="10" y="6" width="22" height="32" rx="2" />
      <line x1="14" y1="6" x2="14" y2="38" strokeDasharray="3 2" opacity="0.3" />
      {/* Lines */}
      <line x1="17" y1="14" x2="28" y2="14" opacity="0.4" />
      <line x1="17" y1="19" x2="28" y2="19" opacity="0.4" />
      <line x1="17" y1="24" x2="25" y2="24" opacity="0.4" />
      {/* Question mark */}
      <text x="20" y="33" fontSize="10" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="serif">?</text>
      {/* Pencil */}
      <path d="M36 12l4-4 3 3-4 4z" fill="none" />
      <line x1="36" y1="12" x2="40" y2="16" />
      <path d="M34 16l2-4" />
      <path d="M33 18l1-2" strokeWidth="1" />
    </svg>
  );
}

// Day Split: 7-day calendar with different colors
export function SplitDaySplitIcon({ size = 48, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Calendar frame */}
      <rect x="4" y="8" width="40" height="34" rx="2" />
      <line x1="4" y1="16" x2="44" y2="16" />
      {/* Calendar hooks */}
      <line x1="14" y1="5" x2="14" y2="11" strokeWidth="2" />
      <line x1="34" y1="5" x2="34" y2="11" strokeWidth="2" />
      {/* 7 day cells with different fills */}
      <rect x="6"  y="18" width="10" height="10" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="19" y="18" width="10" height="10" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="32" y="18" width="10" height="10" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="6"  y="30" width="10" height="10" rx="1" fill="currentColor" opacity="0.1" />
      <rect x="19" y="30" width="10" height="10" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="32" y="30" width="10" height="10" rx="1" fill="currentColor" opacity="0.3" />
      {/* Day labels */}
      <text x="9" y="25" fontSize="5" fill="currentColor" stroke="none" opacity="0.7" fontFamily="sans-serif">M</text>
      <text x="22.5" y="25" fontSize="5" fill="currentColor" stroke="none" opacity="0.7" fontFamily="sans-serif">T</text>
      <text x="35" y="25" fontSize="5" fill="currentColor" stroke="none" opacity="0.7" fontFamily="sans-serif">W</text>
      <text x="9.5" y="37" fontSize="5" fill="currentColor" stroke="none" opacity="0.7" fontFamily="sans-serif">T</text>
      <text x="23" y="37" fontSize="5" fill="currentColor" stroke="none" opacity="0.7" fontFamily="sans-serif">F</text>
      <text x="35" y="37" fontSize="5" fill="currentColor" stroke="none" opacity="0.7" fontFamily="sans-serif">S</text>
    </svg>
  );
}

export function ForkKnifeIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 2v7c0 1.1.9 2 2 2h1v11h2V11h1a2 2 0 0 0 2-2V2" />
      <line x1="5" y1="2" x2="5" y2="7" />
      <line x1="8" y1="2" x2="8" y2="7" />
      <path d="M17 2v20M17 2c2 0 4 2 4 5s-2 5-4 5" />
    </svg>
  );
}

export function MoonIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function EditIcon({ size = 14, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

export const SPLIT_ICONS = {
  PPL:          SplitPPLIcon,
  "Upper/Lower": SplitUpperLowerIcon,
  "Full Body":  SplitFullBodyIcon,
  "Bro Split":  SplitBroIcon,
  PPLUL:        SplitPPLULIcon,
  Custom:       SplitCustomIcon,
  "Day Split":  SplitDaySplitIcon,
};
