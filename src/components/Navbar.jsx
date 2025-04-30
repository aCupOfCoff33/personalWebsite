import { Link } from "react-router-dom";
import BearIconSVG from "./BearIcon";

const links = [
  { to: "/work",    label: "work" },
  { to: "/projects", label: "projects" },
  { to: "/about",    label: "about" },
];

function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 overflow-hidden font-dmsans text-white">
      <div className="absolute inset-0 bg-navbar-bg/70 backdrop-blur-lg" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-6 h-6 bg-gradient-to-b from-navbar-bg/70 to-transparent" />

      <div className="relative container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center">
          <Link to="/" className="text-4xl font-bold lg:text-5xl">
            aaryan
          </Link>
          <BearIconSVG className="ml-3 h-24 w-24" />
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          {links.map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              className="rounded-xl bg-brand-blue px-5 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-brand-blue-hover md:px-6 md:text-base"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
