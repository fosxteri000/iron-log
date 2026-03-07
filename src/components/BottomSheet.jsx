import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function BottomSheet({ open, onClose, children }) {
  // Lock body scroll while sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 modal-backdrop"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative sheet-up bg-white flex flex-col"
        style={{ borderRadius: "20px 20px 0 0", maxHeight: "92vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div
            className="bg-gray-200"
            style={{ width: 36, height: 4, borderRadius: 2 }}
          />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
