import React from "react";

export default function WeeklyBarChart({ data, height = 140 }) {
  if (!data || data.length === 0) return null;

  // Responsive width using viewBox (will scale with container)
  const width = 400;
  const padL = 28, padR = 12, padT = 12, padB = 28;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const maxY = 7;
  const slotW = chartW / data.length;
  const barW = Math.max(8, slotW * 0.5);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ minHeight: `${height}px` }}
    >
      {/* Background */}
      <rect width={width} height={height} fill="none" />

      {/* Grid lines */}
      {[1, 2, 3, 4, 5, 6, 7].map(v => (
        <line
          key={`grid-${v}`}
          x1={padL} y1={padT + chartH - (v / maxY) * chartH}
          x2={width - padR} y2={padT + chartH - (v / maxY) * chartH}
          stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.6"
        />
      ))}

      {/* Y-axis */}
      <line
        x1={padL} y1={padT}
        x2={padL} y2={padT + chartH}
        stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.8"
      />

      {/* Y-axis labels */}
      {[0, 2, 4, 6, 7].map(v => (
        <g key={`y-${v}`}>
          <text
            x={padL - 6}
            y={padT + chartH - (v / maxY) * chartH + 3}
            textAnchor="end"
            fontSize="7"
            fill="currentColor"
            opacity="0.35"
            fontWeight="500"
          >
            {v}
          </text>
        </g>
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const centerX = padL + i * slotW + slotW / 2;
        const x = centerX - barW / 2;
        const sH = (d.strength / maxY) * chartH;
        const cH = (d.cardio / maxY) * chartH;
        const baseY = padT + chartH;

        return (
          <g key={`bar-${i}`}>
            {/* Strength bar (black) */}
            {d.strength > 0 && (
              <rect
                x={x}
                y={baseY - sH}
                width={barW}
                height={sH}
                fill="currentColor"
                opacity="1"
              />
            )}

            {/* Cardio bar (gray, stacked on top) */}
            {d.cardio > 0 && (
              <rect
                x={x}
                y={baseY - sH - cH}
                width={barW}
                height={cH}
                fill="currentColor"
                opacity="0.3"
              />
            )}

            {/* Cheat day indicator (orange dot) */}
            {d.cheat && (
              <circle
                cx={centerX}
                cy={baseY + 8}
                r="2"
                fill="var(--t-cheat, #ea580c)"
              />
            )}

            {/* X-axis label */}
            <text
              x={centerX}
              y={height - 4}
              textAnchor="middle"
              fontSize="7"
              fill="currentColor"
              opacity="0.4"
            >
              {d.label}
            </text>
          </g>
        );
      })}

      {/* X-axis line */}
      <line
        x1={padL} y1={padT + chartH}
        x2={width - padR} y2={padT + chartH}
        stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.8"
      />
    </svg>
  );
}
