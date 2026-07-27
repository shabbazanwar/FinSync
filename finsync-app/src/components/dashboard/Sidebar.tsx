"use client";

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

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="px-6 py-5">
        <Logo />
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
  );
}
