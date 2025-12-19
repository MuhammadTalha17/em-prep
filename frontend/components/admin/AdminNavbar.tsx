"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Add your icons here later (e.g. from Lucide React)
// For now we use text or placeholders

const adminLinks = [
  { label: "Questions", href: "/admin", icon: "Q" },
  { label: "Users", href: "/admin/users", icon: "U" },
  { label: "Calculators", href: "/admin/calculators", icon: "C" },
  { label: "Settings", href: "/admin/settings", icon: "S" },
];

export function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 flex flex-col pt-6 pb-4 px-4 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col gap-2">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-black text-white shadow-md transform scale-[1.02]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {link.icon}
              </div>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
