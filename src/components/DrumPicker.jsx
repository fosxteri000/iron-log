import { useRef, useState, useEffect, useCallback, useMemo } from "react";

const ITEM_H = 40;

/**
 * DrumPicker — CSS scroll-snap drum wheel.
 *
 * Props:
 *   items       [{value, label}]   list of selectable values
 *   initialValue                   value to scroll to on mount
 *   onChange(value)                called when user scrolls to a new item
 *   dim                            when true, all items shown at low opacity (IDK state)
 *   label                          optional column header label
 */
export default function DrumPicker({ items, initialValue, onChange, dim = false, label }) {
  const ref = useRef(null);
  const scrollTimer = useRef(null);
  const isProgrammatic = useRef(false);

  const initIdx = useMemo(() => {
    const idx = items.findIndex(it => it.value === initialValue);
    return idx >= 0 ? idx : 0;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally only on mount

  const [centerIdx, setCenterIdx] = useState(initIdx);

  // Scroll to initial position on mount
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    isProgrammatic.current = true;
    el.scrollTop = initIdx * ITEM_H;
    // Allow time for the scroll to settle before re-enabling user scroll detection
    setTimeout(() => { isProgrammatic.current = false; }, 80);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onScroll = useCallback(() => {
    if (isProgrammatic.current) return;
    const el = ref.current;
    if (!el) return;

    // Update visual highlight immediately during scroll
    const rawIdx = el.scrollTop / ITEM_H;
    const idx = Math.max(0, Math.min(items.length - 1, Math.round(rawIdx)));
    setCenterIdx(idx);

    // Debounce the onChange call so it fires once scroll snap settles
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      onChange?.(items[idx].value);
    }, 80);
  }, [items, onChange]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      {label && (
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--t-muted)",
          }}
        >
          {label}
        </span>
      )}

      <div style={{ position: "relative", width: "100%" }}>
        {/* Center highlight band */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: ITEM_H,
            height: ITEM_H,
            pointerEvents: "none",
            borderTop: "1px solid var(--t-border-mid)",
            borderBottom: "1px solid var(--t-border-mid)",
          }}
        />

        {/* Scroll container */}
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
          {/* Padding top + bottom allows first/last items to center */}
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
                    fontSize: !dim && isCenter ? 20 : 15,
                    fontWeight: !dim && isCenter ? 700 : 400,
                    color: "var(--t-text)",
                    userSelect: "none",
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
