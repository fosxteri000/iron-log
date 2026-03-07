// Hand-crafted stroke-only SVG icons for Sleep sections.

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function CrescentMoonIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      {/* Crescent: large arc cut by smaller arc */}
      <path d="M21 12 A9 9 0 1 1 12 3 A6 6 0 0 0 21 12" />
    </svg>
  );
}

export function HourglassIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      {/* Top and bottom bars */}
      <line x1="5" y1="3" x2="19" y2="3" />
      <line x1="5" y1="21" x2="19" y2="21" />
      {/* Hourglass body */}
      <path d="M5 3 L12 12 L19 3" />
      <path d="M5 21 L12 12 L19 21" />
    </svg>
  );
}

export function SparkleIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} className={className}>
      {/* 4-point star */}
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  );
}
