"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink as NavLinkType } from "@/types";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  link: NavLinkType,
}

export default function NavLink({ link }: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Link 
      href={link.href}
      className={cn(
        "text-primary-foreground text-base font-semibold rounded-full px-4 py-1 duration-200 hover:bg-gray-200/75",
        pathname === link.href && "bg-navlink hover:bg-background-hover"
      )}
    >
      {link.name}
    </Link>
  )
};