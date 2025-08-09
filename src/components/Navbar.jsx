import React from "react";
import { NavLink, Link } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion"; // Use alias 'Motion' to satisfy linter usage
import {
  Home as HomeIcon,
  UserRound,
  Briefcase,
  FileText,
  Menu,
  Mail,
  Linkedin,
  Github,
  Instagram,
} from "lucide-react";
import XIcon from "./icons/XIcon";
import BearIconSVG from "./BearIcon";

const sections = [
  {
    title: "Navigation",
    items: [
      { kind: "internal", to: "/", label: "Home", Icon: HomeIcon },
      { kind: "internal", to: "/about", label: "About", Icon: UserRound },
      { kind: "internal", to: "/work", label: "Work", Icon: Briefcase },
      { kind: "internal", to: "/projects", label: "Projects", Icon: FileText },
    ],
  },
  {
    title: "Contact",
    items: [
      // Fill these with your real links any time
      { kind: "external", href: "mailto:aaryanj@outlook.com", label: "Email", Icon: Mail },
      { kind: "external", href: "https://www.linkedin.com/in/aaryanj/", label: "LinkedIn", Icon: Linkedin },
      { kind: "external", href: "https://github.com/aCupOfCoff33", label: "GitHub", Icon: Github },
      { kind: "external", href: "https://x.com/aaryanj05", label: "X", Icon: XIcon },
      { kind: "external", href: "https://www.instagram.com/aaryan.s/", label: "Instagram", Icon: Instagram },
    ],
  },
];

const SectionLabel = ({ children }) => (
  <div className="px-1">
    <p className="text-[12px] tracking-[0.08em] uppercase text-neutral-400/60">{children}</p>
  </div>
);

const CardButton = React.memo(function CardButton({ label, icon: IconComponent, className = "", children, active = false }) {
  return (
    <div
      className={[
        "w-full rounded-xl border transition-colors min-h-[32px]",
        active
          ? "border-transparent bg-neutral-800/80 text-neutral-100 ring-1 ring-white/10 hover:bg-neutral-800/90"
          : "border-white/10 bg-neutral-900/40 hover:bg-white/5 text-neutral-300",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-2.5 px-3 py-1.5">
        <div className="shrink-0 opacity-90">
          {IconComponent ? <IconComponent className="h-4 w-4" /> : null}
        </div>
        <span className={["text-md leading-none font-normal font-adamant", active ? "text-neutral-100" : "text-neutral-200"].join(" ")}>{label}</span>
        <div className="ml-auto opacity-50">{children}</div>
      </div>
    </div>
  );
});

function InternalLink({ to, label, Icon: IconComponent, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-xl"
      aria-label={label}
    >
      {({ isActive }) => <CardButton label={label} icon={IconComponent} active={isActive} />}
    </NavLink>
  );
}

function ExternalLink({ href, label, Icon: IconComponent }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener" : undefined}
      aria-label={label}
      className="text-neutral-300 hover:text-white"
    >
      <CardButton label={label} icon={IconComponent} />
    </a>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (menuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [menuOpen]);

  // Removed unused year to satisfy linter

  return (
    <>
      {/* Desktop vertical sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-screen w-60 pt-8 px-4 border-r border-white/10 bg-[#0C100D]/95 backdrop-blur flex-col gap-4 z-40"
        style={{ "--left-color": "#121813" }}
      >
        {/* Brand */}
        <div className="w-full pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <BearIconSVG className="h-16 w-16" />
            <Link to="/" className="text-white text-2xl font-semibold leading-none">
              aaryan
            </Link>
          </div>
        </div>

        {/* Sections */}
        <div className="flex-1 w-full overflow-y-auto pr-1">
          <nav className="w-full flex flex-col gap-4">
            {sections.map((section) => (
              <div key={section.title} className="w-full">
                <SectionLabel>{section.title}</SectionLabel>
                <div className="mt-2 grid grid-cols-1 gap-2.5">
                  {section.items.map((item) =>
                    item.kind === "internal" ? (
                      <InternalLink key={item.label} {...item} />
                    ) : (
                      <ExternalLink key={item.label} {...item} />
                    ),
                  )}
                </div>
              </div>
            ))}
          </nav>
        </div>

      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 flex items-center justify-between px-3 py-2 z-50 bg-[#0C100D]/95 backdrop-blur border-b border-white/10">
        <div className="flex items-center gap-3">
          <BearIconSVG className="h-8 w-8" />
          <Link to="/" className="text-white text-lg font-semibold">
            aaryan
          </Link>
        </div>
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="rounded-full p-2.5 bg-neutral-900/70 text-white hover:bg-neutral-800 transition"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile dropdown panel - slides from top */}
      <AnimatePresence>
        {menuOpen && (
          <Motion.div
            key="mobile-panel"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.26 }}
            className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0C100D]/95 backdrop-blur border-b border-white/10 rounded-b-2xl pt-20 pb-6 px-4"
          >
            <nav className="flex flex-col gap-5">
              {sections.map((section) => (
                <div key={section.title}>
                  <SectionLabel>{section.title}</SectionLabel>
                  <div className="mt-2 grid grid-cols-1 gap-2.5">
                    {section.items.map((item) =>
                      item.kind === "internal" ? (
                        <InternalLink key={item.label} {...item} onClick={() => setMenuOpen(false)} />
                      ) : (
                        <ExternalLink key={item.label} {...item} />
                      ),
                    )}
                  </div>
                </div>
              ))}
            </nav>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default React.memo(Navbar); // Optimized to prevent unnecessary rerenders
