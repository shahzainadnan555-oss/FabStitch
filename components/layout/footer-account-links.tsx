"use client";

import Link from "next/link";
import { useSession } from "@/features/auth/session";

export function FooterAccountLinks() {
  const { hydrated, authenticated } = useSession();
  const links = !hydrated
    ? [{ href: "/account/", label: "Account" }]
    : authenticated
      ? [
          { href: "/account/", label: "Account" },
          { href: "/inquiries/", label: "My Inquiries" },
        ]
      : [
          { href: "/login/", label: "Sign In" },
          { href: "/signup/", label: "Join Free" },
        ];

  return (
    <ul aria-labelledby="footer-account" className="mt-5 grid gap-3">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            prefetch={false}
            className="relative inline-block text-sm font-normal text-on-navy-2 transition-colors duration-200 after:absolute after:right-0 after:-bottom-0.5 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-on-ink after:transition-transform after:duration-200 hover:text-on-ink hover:after:scale-x-100 focus-visible:text-on-ink focus-visible:outline-gold-on-navy"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
