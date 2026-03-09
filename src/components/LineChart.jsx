import React from "react";

export default function LineChart({ data, width = 400, height = 90 }) {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center py-12 text-[10px] text-gray-300 tracking-widest">
        NOT ENOUGH DATA
      </div>
    );
  }

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const padL = 24, padR = 8, padT = 12, padB = 18;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const points = data.map((d, i) => {
    const x = padL + (i / (data.length - 1)) * chartW;
    const y = padT + chartH - ((d.value - min) / range) * chartH;
    return { x, y, ...d };
  });

  // Smooth path using cubic bezier
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const mx = (prev.x + curr.x) / 2;
    pathD += ` Q ${prev.x + (mx - prev.x) * 0.5} ${prev.y}, ${mx} ${(prev.y + curr.y) / 2}`;
    if (i === points.length - 1) {
      pathD += ` T ${curr.x} ${curr.y}`;
    }
  }

  const areaPath = pathD + ` L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ minHeight: `${height}px` }}
    >
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((ratio, i) => (
        <line
          key={`grid-${i}`}
          x1={padL}
          y1={padT + chartH * (1 - ratio)}
          x2={width - padR}
          y2={padT + chartH * (1 - ratio)}
          stroke="currentColor"
          strokeOpacity="0.06"
          strokeWidth="0.5"
        />
      ))}

      {/* Y-axis */}
      <line
        x1={padL}
        y1={padT}
        x2={padL}
        y2={padT + chartH}
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="0.8"
      />

      {/* X-axis */}
      <line
        x1={padL}
        y1={padT + chartH}
        x2={width - padR}
        y2={padT + chartH}
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="0.8"
      />

      {/* Area fill */}
      <path d={areaPath} fill="currentColor" fillOpacity="0.04" />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Start dot */}
      <circle cx={points[0].x} cy={points[0].y} r="2.5" fill="currentColor" opacity="0.3" />

      {/* End dot (highlighted) */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3.5" fill="currentColor" />

      {/* Start label */}
      <text
        x={points[0].x}
        y={height - 2}
        textAnchor="start"
        fontSize="7"
        fill="currentColor"
        opacity="0.4"
      >
        {points[0].label}
      </text>

      {/* End label */}
      <text
        x={points[points.length - 1].x}
        y={height - 2}
        textAnchor="end"
        fontSize="7"
        fill="currentColor"
        opacity="0.4"
      >
        {points[points.length - 1].label}
      </text>

      {/* Current value tooltip */}
      <text
        x={points[points.length - 1].x - 3}
        y={points[points.length - 1].y - 8}
        textAnchor="end"
        fontSize="8"
        fontWeight="bold"
        fill="currentColor"
      >
        {points[points.length - 1].value.toLocaleString()}
      </text>
    </svg>
  );
}
