import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion as Motion, LayoutGroup } from "framer-motion"; // Use alias 'Motion' to satisfy linter usage
import {
  Home as HomeIcon,
  UserRound,
  Briefcase,
  FileText,
  Menu,
  X as CloseIcon,
  Mail,
  Linkedin,
  Github,
  Instagram,
} from "lucide-react";
import XIcon from "../icons/XIcon";
import TOC from "../notes/TOC";
import { useNotesTOC } from "../notes/NotesContext";
import { useBearState } from "../../hooks/useBearState";
import UnifiedBearIcon from "../common/UnifiedBearIcon";

const sections = [
  {
    title: "Navigation",
    items: [
      { kind: "internal", to: "/", label: "Home", Icon: HomeIcon },
      { kind: "internal", to: "/projects", label: "Projects", Icon: Briefcase },
      { kind: "internal", to: "/about", label: "About", Icon: UserRound },
    ],
  },
  {
    title: "Contact",
    items: [
      {
        kind: "external",
        href: "mailto:aaryanj@outlook.com",
        label: "Email",
        Icon: Mail,
      },
      {
        kind: "external",
        href: "https://www.linkedin.com/in/aaryanj/",
        label: "LinkedIn",
        Icon: Linkedin,
      },
      {
        kind: "external",
        href: "https://github.com/aCupOfCoff33",
        label: "GitHub",
        Icon: Github,
      },
      {
        kind: "external",
        href: "https://x.com/aaryanj05",
        label: "X",
        Icon: XIcon,
      },
    ],
  },
];

const SectionLabel = ({ children }) => (
  <div className="px-1">
    <p className="text-[12px] tracking-[0.08em] uppercase text-neutral-400/60">
      {children}
    </p>
  </div>
);

const CardButton = React.memo(function CardButton({
  label,
  icon: IconComponent,
  className = "",
  children,
  active = false,
  iconLayoutId,
}) {
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
        <div className="shrink-0 opacity-90 flex items-center justify-center">
          {/* ensure icon stays centered */}
          {IconComponent ? (
            iconLayoutId ? (
              // Use a single layout node and center the icon using flexbox — no hard-coded y offsets
              <Motion.div
                layout
                layoutId={iconLayoutId}
                transition={{
                  layout: {
                    type: "spring",
                    stiffness: 300,
                    damping: 28,
                    bounce: 0.18,
                  },
                }}
                className="flex items-center justify-center"
              >
                <IconComponent className="h-4 w-4" />
              </Motion.div>
            ) : (
              <IconComponent className="h-4 w-4" />
            )
          ) : null}
        </div>
        <span
          className={[
            "text-md leading-none font-normal font-adamant",
            active ? "text-neutral-100" : "text-neutral-200",
          ].join(" ")}
        >
          {label}
        </span>
        <div className="ml-auto opacity-50">{children}</div>
      </div>
    </div>
  );
});

function InternalLink({ to, label, Icon: IconComponent, onClick }) {
  // Always behave as a normal internal link; remove special-case "dead" behavior on home
  const handleClick = (e) => {
    if (onClick) onClick(e);
  };

  return (
    <NavLink
      to={to}
      onClick={handleClick}
      className={
        "block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-xl"
      }
      aria-label={label}
    >
      {({ isActive }) => (
        <CardButton label={label} icon={IconComponent} active={isActive} />
      )}
    </NavLink>
  );
}

function ExternalLink({
  href,
  label,
  Icon: IconComponent,
  layoutId,
  iconLayoutId,
}) {
  const Anchor = layoutId ? Motion.a : "a";
  return (
    <Anchor
      {...(layoutId ? { layout: true, layoutId } : {})}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener" : undefined}
      aria-label={label}
      className="text-neutral-300 hover:text-white"
      transition={
        layoutId
          ? {
              layout: {
                type: "spring",
                stiffness: 500,
                damping: 38,
                bounce: 0.2,
              },
            }
          : undefined
      }
    >
      <CardButton
        label={label}
        icon={IconComponent}
        iconLayoutId={iconLayoutId}
      />
    </Anchor>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { tocItems, tocVisible, contactCollapsed } = useNotesTOC();
  const location = useLocation();
  const isNotesRoute = location.pathname.startsWith("/notes");
  // use bear state at top level so hooks are not called conditionally or inside callbacks
  useBearState();
  // Collapse only based on contactCollapsed so it can revert when scrolling back up
  const collapsed = isNotesRoute && contactCollapsed;

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

  // Render the unified icon; size via tailwind classes
  const renderUnifiedBear = (size) => (
    <div style={{ width: size, height: size }}>
      <UnifiedBearIcon
        className={
          size > 70 ? "h-20 w-20" : size > 40 ? "h-16 w-16" : "h-8 w-8"
        }
      />
    </div>
  );

  return (
    <>
      {/* Desktop vertical sidebar */}
      <aside
        className="hidden md:flex w-60 pt-8 px-4 flex-col gap-4 z-40 h-full bg-[#0C100D]"
        style={{ "--left-color": "#121813" }}
      >
        {/* Brand */}
        <div className="w-full pb-5 border-b border-white/10">
          <div
            className="flex items-center gap-3"
            style={{ position: "relative" }}
          >
            {/* unified bear icon */}
            {renderUnifiedBear(80)}
            <Link
              to="/"
              className="text-white text-3xl font-semibold leading-none"
            >
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
                {section.title === "Contact" && isNotesRoute ? (
                  <LayoutGroup id="contact-shared">
                    <Motion.div layout initial={false} className="mt-2">
                      <AnimatePresence mode="wait" initial={false}>
                        {collapsed ? (
                          <Motion.div
                            key="contact-horizontal"
                            layout
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{
                              duration: 0.35,
                              layout: {
                                type: "spring",
                                stiffness: 300,
                                damping: 28,
                                bounce: 0.18,
                              },
                            }}
                            className="grid grid-cols-4 gap-2 w-full"
                          >
                            {section.items.map((item) => (
                              <Motion.a
                                key={item.label}
                                layout
                                layoutId={`contact-${item.label}`}
                                href={item.href}
                                aria-label={item.label}
                                title={item.label}
                                target={
                                  item.href?.startsWith("http")
                                    ? "_blank"
                                    : undefined
                                }
                                rel={
                                  item.href?.startsWith("http")
                                    ? "noopener"
                                    : undefined
                                }
                                className="flex h-8 w-full items-center justify-center rounded-xl border border-white/10 bg-neutral-900/40 hover:bg-white/5 text-neutral-300 hover:text-white transition-colors min-w-0"
                                transition={{
                                  layout: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 28,
                                    bounce: 0.18,
                                  },
                                }}
                              >
                                {/* Make the layout node fill the anchor and center its child so the icon is always smack in the middle */}
                                <Motion.div
                                  layout
                                  layoutId={`contact-icon-${item.label}`}
                                  transition={{
                                    layout: {
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 28,
                                      bounce: 0.18,
                                    },
                                  }}
                                  className="flex items-center justify-center h-full w-full"
                                >
                                  <item.Icon className="h-4 w-4" />
                                </Motion.div>
                              </Motion.a>
                            ))}
                          </Motion.div>
                        ) : (
                          <Motion.div
                            key="contact-vertical"
                            layout
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{
                              duration: 0.35,
                              layout: {
                                type: "spring",
                                stiffness: 300,
                                damping: 28,
                                bounce: 0.18,
                              },
                            }}
                          >
                            <div className="grid grid-cols-1 gap-2.5">
                              {section.items.map((item) => (
                                <ExternalLink
                                  key={item.label}
                                  {...item}
                                  layoutId={`contact-${item.label}`}
                                  iconLayoutId={`contact-icon-${item.label}`}
                                />
                              ))}
                            </div>
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </Motion.div>
                  </LayoutGroup>
                ) : (
                  <div className="mt-2 grid grid-cols-1 gap-2.5">
                    {section.items.map((item) =>
                      item.kind === "internal" ? (
                        <InternalLink key={item.label} {...item} />
                      ) : (
                        <ExternalLink key={item.label} {...item} />
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Table of contents for note pages (desktop only) */}
            {tocItems?.length ? (
              <div className="hidden lg:block">
                <Motion.div
                  initial={false}
                  animate={
                    tocVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }
                  }
                  transition={{ duration: 0.25 }}
                >
                  <SectionLabel>In this story</SectionLabel>
                </Motion.div>
                <div className="mt-2">
                  <TOC items={tocItems} visible={tocVisible} />
                </div>
              </div>
            ) : null}
          </nav>
        </div>
      </aside>

      {/* Mobile top bar with morphing contact area */}
      <div className="md:hidden fixed top-0 inset-x-0 flex items-center justify-between px-5 py-5 min-h-[7.5rem] z-50 bg-[#0C100D] border-b border-white/10">
        <div
          className="flex items-center gap-5"
          style={{ position: "relative" }}
        >
          {renderUnifiedBear(72)}
          <Link to="/" className="text-white text-3xl font-semibold">
            aaryan
          </Link>
        </div>

        {/* Smoothly collapse into icons-only when reading (unified with desktop collapse state) */}
        <Motion.div
          initial={false}
          animate={
            collapsed ? { width: 200, opacity: 1 } : { width: 0, opacity: 0 }
          }
          transition={{ type: "tween", duration: 0.25 }}
          className="overflow-hidden flex items-center justify-end gap-3 mr-1"
        >
          <a
            href="mailto:aaryanj@outlook.com"
            className="text-white/80 hover:text-white transition-transform duration-200 hover:scale-110"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/aaryanj/"
            target="_blank"
            rel="noopener"
            className="text-white/80 hover:text-white transition-transform duration-200 hover:scale-110"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/aCupOfCoff33"
            target="_blank"
            rel="noopener"
            className="text-white/80 hover:text-white transition-transform duration-200 hover:scale-110"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://x.com/aaryanj05"
            target="_blank"
            rel="noopener"
            className="text-white/80 hover:text-white transition-transform duration-200 hover:scale-110"
            aria-label="X"
          >
            <XIcon className="h-5 w-5" />
          </a>
        </Motion.div>

        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="rounded-full p-4 bg-neutral-900 text-white hover:bg-neutral-800 transition"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <CloseIcon className="h-8 w-8" />
          ) : (
            <Menu className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Spacer keeps mobile content from sliding under the fixed navbar */}
      <div className="md:hidden h-[7.5rem]" aria-hidden="true" />

      {/* Mobile dropdown panel - slides from top */}
      <AnimatePresence>
        {menuOpen && (
          <Motion.div
            key="mobile-panel"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.26 }}
            className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0C100D] border-b border-white/20 rounded-b-2xl pt-32 pb-6 px-5"
          >
            <nav className="flex flex-col gap-5">
              {sections.map((section) => (
                <div key={section.title}>
                  <SectionLabel>{section.title}</SectionLabel>
                  <div className="mt-2 grid grid-cols-1 gap-2.5">
                    {section.items.map((item) =>
                      item.kind === "internal" ? (
                        <InternalLink
                          key={item.label}
                          {...item}
                          onClick={() => setMenuOpen(false)}
                        />
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
