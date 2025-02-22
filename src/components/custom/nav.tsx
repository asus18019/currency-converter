"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
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
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 py-4">
      {navLinks.map(link => (
        <Link 
          key={link.href}
          href={link.href}
          className={cn(
            "text-primary-foreground text-base font-semibold rounded-full px-4 py-1 duration-200 hover:bg-gray-200/75",
            pathname === link.href && "bg-navlink hover:bg-background-hover"
          )}
        >
          {link.name}
        </Link>
      ))}
  </nav>
  )
}