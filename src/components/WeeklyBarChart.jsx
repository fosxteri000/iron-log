import React from "react";

export default function WeeklyBarChart({ data, height = 140 }) {
  if (!data || data.length === 0) return null;

  const width = 300;
  const padL = 18, padR = 8, padT = 8, padB = 22;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const maxY = 7;
  const slotW = chartW / data.length;
  const barW = slotW * 0.55;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 2, 4, 6].map(v => (
        <line
          key={v}
          x1={padL} y1={padT + chartH - (v / maxY) * chartH}
          x2={width - padR} y2={padT + chartH - (v / maxY) * chartH}
          stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5"
        />
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const x = padL + i * slotW + (slotW - barW) / 2;
        const sH = (d.strength / maxY) * chartH;
        const cH = (d.cardio / maxY) * chartH;
        const baseY = padT + chartH;
        return (
          <g key={i}>
            {d.strength > 0 && (
              <rect x={x} y={baseY - sH} width={barW} height={sH}
                fill="currentColor" rx="2" />
            )}
            {d.cardio > 0 && (
              <rect x={x} y={baseY - sH - cH} width={barW} height={cH}
                fill="currentColor" fillOpacity="0.3" rx="2" />
            )}
            {d.cheat && (
              <circle cx={x + barW / 2} cy={baseY + 6} r="1.5" fill="var(--t-cheat, #e85d04)" />
            )}
            <text x={x + barW / 2} y={height - 2} textAnchor="middle"
              fontSize="5.5" fill="currentColor" opacity="0.35">
              {d.label}
            </text>
          </g>
        );
      })}

      {/* Y labels */}
      {[0, 3, 7].map(v => (
        <text key={v} x={padL - 4}
          y={padT + chartH - (v / maxY) * chartH + 2.5}
          textAnchor="end" fontSize="5.5" fill="currentColor" opacity="0.25">
          {v}
        </text>
      ))}
    </svg>
  );
}
