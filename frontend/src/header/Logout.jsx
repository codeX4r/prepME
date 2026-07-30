import { FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";



export function Logout({ onLogout, confirmBeforeLogout = false, compactOn = null }) {
  const [confirming, setConfirming] = useState(false);

  const labelHiddenClass =
    compactOn === "sm"
      ? "hidden sm:inline"
      : compactOn === "md"
        ? "hidden md:inline"
        : "";

  return (
    <button
      type="button"
      onClick={() => onLogout?.()}
      onBlur={() => setConfirming(false)}
      aria-label={labelHiddenClass ? "Logout" : undefined}
      className="flex items-center gap-2 rounded-md px-3 py-2 font-mono text-sm text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
    >
      <FaSignOutAlt size={16} />
      <span className={labelHiddenClass}>Logout</span>
    </button>
  );
}