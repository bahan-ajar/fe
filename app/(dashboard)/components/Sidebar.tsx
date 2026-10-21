"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Ringkasan",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mahasiswa",
    href: "/mahasiswa",
    icon: Users,
  },
  {
    title: "Mata Kuliah",
    href: "/mata-kuliah",
    icon: BookOpen,
  },
  {
    title: "Presensi",
    href: "/presensi",
    icon: CalendarCheck,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-zinc-100">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
          <GraduationCap className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-zinc-900 tracking-tight leading-none">
            Portal Kampus
          </span>
          <span className="text-[11px] text-zinc-400 mt-1">Sistem Akademik</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors font-medium ${
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-zinc-400"
                  }`}
                />
                <span>{item.title}</span>
              </div>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-zinc-100">
        <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-zinc-800 text-white text-xs font-medium flex items-center justify-center shrink-0">
              {getInitials(currentUser?.name)}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-zinc-800 truncate" title={currentUser?.name || "Administrator"}>
                {currentUser?.name || "Administrator"}
              </p>
              <p className="text-[11px] text-zinc-400 truncate" title={currentUser?.email || "admin@univ.ac.id"}>
                {currentUser?.email || "admin@univ.ac.id"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-white rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
