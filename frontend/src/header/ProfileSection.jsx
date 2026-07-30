import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

/**
 * ProfileSection
 * The rounded dark "pill" showing the signed-in user's avatar + name.
 * Renamed from ProfileSecction.jsx (typo fix). Optionally opens a small
 * dropdown menu when `menuItems` is provided.
 */
export default function ProfileSection({
  name = "User",
  avatarUrl,
  menuItems = [],
  compactOn = null, // "sm" | "md" | null — hides the name label below that breakpoint
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasMenu = menuItems.length > 0;

  const nameHiddenClass =
    compactOn === "sm" ? "hidden sm:inline" : compactOn === "md" ? "hidden md:inline" : "";
  const pillPaddingClass =
    compactOn === "sm" ? "pr-1.5 sm:pr-4" : compactOn === "md" ? "pr-1.5 md:pr-4" : "pr-4";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => hasMenu && setOpen((v) => !v)}
        aria-haspopup={hasMenu ? "menu" : undefined}
        aria-expanded={hasMenu ? open : undefined}
        aria-label={nameHiddenClass ? `Profile menu for ${name}` : undefined}
        className={`flex items-center gap-2 rounded-full bg-slate-800/70 py-1.5 pl-1.5 ${pillPaddingClass} ring-1 ring-slate-700/60 transition-colors hover:bg-slate-800`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-7 w-7 rounded-full object-cover ring-1 ring-blue-500/40"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/40">
            <FaUserCircle size={20} aria-hidden="true" />
          </span>
        )}
        <span className={`font-mono text-sm text-slate-200 ${nameHiddenClass}`}>{name}</span>
        {hasMenu && (
          <FaChevronDown
            size={11}
            className={`text-slate-400 transition-transform ${nameHiddenClass} ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        )}
      </button>

      {hasMenu && open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-lg border border-slate-700/60 bg-slate-900 shadow-lg shadow-black/40"
        >
          {menuItems.map(({ label, onClick }) => (
            <button
              key={label}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onClick?.();
              }}
              className="block w-full px-4 py-2.5 text-left font-mono text-sm text-slate-300 hover:bg-slate-800"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
