import { FaTachometerAlt, FaComments, FaFileAlt, FaChartBar } from "react-icons/fa";

/**
 * NavMenu
 * Primary navigation for the InterviewPrep AI dashboard header.
 * Pass `active` to highlight the current section (defaults to "dashboard").
 */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt, href: "/dashboard" },
  { id: "mock-interviews", label: "Mock Interviews", icon: FaComments, href: "/mock-interviews" },
  { id: "resources", label: "Resources", icon: FaFileAlt, href: "/resources" },
  { id: "progress", label: "Progress", icon: FaChartBar, href: "/progress" },
];

export default function NavMenu({ active = "dashboard", onNavigate, mobile = false }) {
  return (
    <nav
      aria-label="Primary"
      className={mobile ? "flex flex-col gap-1" : "flex items-center gap-1"}
    >
      {NAV_ITEMS.map(({ id, label, icon: Icon, href }) => {
        const isActive = id === active;
        return (
          <a
            key={id}
            href={href}
            aria-current={isActive ? "page" : undefined}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(id);
              }
            }}
            className={[
              "flex items-center gap-2 rounded-md px-3 py-2 font-mono text-sm transition-colors",
              mobile ? "w-full" : "",
              isActive
                ? "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
            ].join(" ")}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{label}</span>
          </a>
        );
      })}
    </nav>
  );
}
