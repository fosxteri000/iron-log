import React from "react";

export default function DonutChart({ segments, size = 200, centerValue, centerLabel }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const strokeWidth = size * 0.14;
  const circumference = 2 * Math.PI * radius;
  const gap = 3;

  const total = segments.reduce((acc, s) => acc + s.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center py-10 text-[10px] text-gray-300 tracking-widest">
        NO DATA
      </div>
    );
  }

  let cumOffset = 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[200px] mx-auto block">
      {segments.map((seg, i) => {
        const length = (seg.value / total) * circumference;
        const dashLength = Math.max(0, length - gap);
        const gapLength = circumference - dashLength;
        const offset = cumOffset;
        cumOffset += length;
        if (dashLength <= 0) return null;
        return (
          <circle
            key={i}
            r={radius}
            cx={cx}
            cy={cy}
            fill="none"
            stroke={seg.color}
            strokeOpacity={seg.opacity || 1}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${gapLength}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="28" fontWeight="bold" fill="currentColor">
        {centerValue}
      </text>
      <text
        x={cx} y={cy + 14} textAnchor="middle"
        fontSize="8" fill="currentColor" opacity="0.4" letterSpacing="0.12em"
      >
        {centerLabel}
      </text>
    </svg>
  );
}
