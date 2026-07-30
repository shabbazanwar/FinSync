"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "motion/react";
import {
  HiOutlineHome,
  HiOutlineSwitchHorizontal,
  HiOutlineChartPie,
  HiOutlineFlag,
  HiOutlineChartBar,
  HiOutlineCreditCard,
  HiOutlineTrendingUp,
  HiOutlinePresentationChartLine,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: HiOutlineHome },
  { href: "/transactions", label: "Transactions", icon: HiOutlineSwitchHorizontal },
  { href: "/budgets", label: "Budgets", icon: HiOutlineChartPie },
  { href: "/goals", label: "Goals", icon: HiOutlineFlag },
  { href: "/analytics", label: "Analytics", icon: HiOutlineChartBar },
  { href: "/subscriptions", label: "Subscriptions", icon: HiOutlineCreditCard },
  { href: "/investments", label: "Investments", icon: HiOutlineTrendingUp },
  { href: "/forecast", label: "Forecast", icon: HiOutlinePresentationChartLine },
  { href: "/settings", label: "Settings", icon: HiOutlineCog },
];

export function Sidebar({
  userName,
  username,
}: {
  userName?: string | null;
  username?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close the mobile drawer whenever the route changes. Adjusting state
  // during render (rather than in an effect) avoids an extra render pass.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <Logo iconClassName="h-7 w-7" textClassName="text-lg font-bold text-emerald-700" />
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-50"
        >
          <HiOutlineMenu className="h-6 w-6" />
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-60 shrink-0 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 lg:hidden"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? "" : "hover:bg-gray-50"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-lg bg-emerald-50"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <Icon
                  className={`relative h-5 w-5 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                    active ? "text-emerald-700" : "text-gray-500"
                  }`}
                />
                <span
                  className={`relative transition-colors ${
                    active ? "text-emerald-700" : "text-gray-600 group-hover:text-gray-900"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <p className="truncate px-3 py-1 text-sm text-gray-700">
            {userName ?? "Account"}
          </p>
          {username && (
            <p className="truncate px-3 pb-1 text-xs text-gray-400">
              @{username}
            </p>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <HiOutlineLogout className="h-5 w-5 shrink-0 transition-transform duration-150 group-hover:scale-110" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
