import { useRef, useState, useEffect, useCallback, useMemo } from "react";

const ITEM_H = 40;

/**
 * DrumPicker — CSS scroll-snap drum wheel.
 * Sharp corners only. No border-radius anywhere.
 *
 * Props:
 *   items        [{value, label}]
 *   initialValue  value to scroll to on mount
 *   onChange(value)
 *   dim           when true, mutes all items (IDK state)
 *   label         optional column header (uppercase)
 */
export default function DrumPicker({ items, initialValue, onChange, dim = false, label }) {
  const ref            = useRef(null);
  const scrollTimer    = useRef(null);
  const isProgrammatic = useRef(false);

  const initIdx = useMemo(() => {
    const idx = items.findIndex(it => it.value === initialValue);
    return idx >= 0 ? idx : 0;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [centerIdx, setCenterIdx] = useState(initIdx);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    isProgrammatic.current = true;
    el.scrollTop = initIdx * ITEM_H;
    setTimeout(() => { isProgrammatic.current = false; }, 100);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onScroll = useCallback(() => {
    if (isProgrammatic.current) return;
    const el = ref.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM_H)));
    setCenterIdx(idx);
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      onChange?.(items[idx].value);
    }, 80);
  }, [items, onChange]);

  return (
    <div>
      {label && (
        <p className="text-[10px] tracking-widest text-gray-400 text-center mb-2">{label}</p>
      )}
      <div style={{ position: "relative", height: ITEM_H * 3 }}>
        {/* Center highlight — thin lines, no rounded corners */}
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          top: ITEM_H,
          height: ITEM_H,
          pointerEvents: "none",
          borderTop: "1px solid var(--t-border-mid)",
          borderBottom: "1px solid var(--t-border-mid)",
        }} />

        <div
          ref={ref}
          onScroll={onScroll}
          className="drum-scroll"
          style={{
            height: ITEM_H * 3,
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ paddingTop: ITEM_H, paddingBottom: ITEM_H }}>
            {items.map((item, i) => {
              const isCenter = i === centerIdx;
              return (
                <div
                  key={item.value ?? i}
                  style={{
                    height: ITEM_H,
                    scrollSnapAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: dim ? 0.15 : isCenter ? 1 : 0.25,
                    fontSize: !dim && isCenter ? 18 : 13,
                    fontWeight: !dim && isCenter ? 600 : 400,
                    color: "var(--t-text)",
                    userSelect: "none",
                    letterSpacing: isCenter ? "0.05em" : 0,
                    transition: "opacity 0.1s ease, font-size 0.1s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (ref.current) {
                      ref.current.scrollTo({ top: i * ITEM_H, behavior: "smooth" });
                    }
                  }}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
