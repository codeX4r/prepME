import { FaTerminal, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import NavMenu from "./NavMenu";
import ProfileSection from "./ProfileSection";
import { Logout } from "./Logout";


export function Header({
  userName = "User",
  avatarUrl,
  activeNav = "dashboard",
  onNavigate,
  onLogout,
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function handleNavigate(id) {
    setMobileNavOpen(false);
    onNavigate?.(id);
  }

  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        {/* Brand */}
        <a href="/dashboard" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30">
            <FaTerminal size={16} aria-hidden="true" />
          </span>
          <span className="font-mono text-lg font-bold tracking-tight text-blue-400 sm:text-xl"  >
            Prep <span className="text-slate-100">Me</span>
          </span>
        </a>

        {/* Primary nav — inline on md+ */}
        {/* <div className="hidden flex-1 justify-center md:flex">
          <NavMenu active={activeNav} onNavigate={handleNavigate} />
        </div> */}

        {/* Profile + logout + mobile nav toggle */}
        <div className="flex items-center gap-1 shrink-0 sm:gap-2">
          <ProfileSection name={userName} avatarUrl={avatarUrl} compactOn="sm" />
          <Logout onLogout={onLogout} compactOn="sm" />

          {/* Hamburger toggle, mobile only */}
          {/* <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav"
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-md text-slate-300 ring-1 ring-slate-700/60 hover:bg-slate-800/60 md:hidden"
          >
            {mobileNavOpen ? <FaTimes size={16} aria-hidden="true" /> : <FaBars size={16} aria-hidden="true" />}
          </button> */}
        </div>
      </div>

      {/* Collapsible nav, mobile only */}
      {/* {mobileNavOpen && (
        <div id="mobile-nav" className="border-t border-slate-800/60 px-4 py-3 md:hidden">
          <NavMenu active={activeNav} onNavigate={handleNavigate} mobile />
        </div>
      )} */}
    </header>
  );
}
