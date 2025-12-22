"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconBook,
  IconChartBar,
  IconSettings,
} from "@tabler/icons-react";

const navItems = [
  { label: "Dashboard", href: "/user", icon: IconHome },
  { label: "Questions Bank", href: "/user/questions-bank", icon: IconBook },
  { label: "Performance", href: "/user/performance", icon: IconChartBar },
  { label: "Settings", href: "/user/settings", icon: IconSettings },
];

export function UserNavbar() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] flex-col p-4">
      <div className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? "bg-linear-to-r from-red-50 to-red-100 text-red-700 shadow-sm border border-red-200"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-900"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="pt-4 border-t border-gray-200">
        <div className="px-4 py-2 text-gray-600 text-xs">
          <div className="font-semibold text-gray-900">Intermediate Plan</div>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-500">Active</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
