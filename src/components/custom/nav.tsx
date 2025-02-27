import NavLink from "./nav-link";
import { NavLink as NavLinkType } from "@/types";

const navLinks: NavLinkType[] = [
  {
    name: "Converter",
    href: "/",
  },
  {
    name: "Rates",
    href: "/rates",
  },
];

export default function Nav() {
  return (
    <nav className="flex gap-2 py-4">
      {navLinks.map(link => <NavLink key={link.href} link={link} />)}
  </nav>
  )
}