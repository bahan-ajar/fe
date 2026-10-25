"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  StickyNote,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { logoutAction } from "@/app/(auth)/login/actions";
import { useCurrentUser } from "@/hooks";
import { getInitials } from "@/lib";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: "Ringkasan",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Catatan (Notes)",
    href: "/notes",
    icon: StickyNote,
    badge: "P10",
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
  const { user: currentUser, isAdmin } = useCurrentUser();

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    await logoutAction();
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
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
          <span>Menu Utama</span>
          {currentUser && (
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                isAdmin ? "bg-purple-100 text-purple-700" : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {currentUser.role || "MEMBER"}
            </span>
          )}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

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
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-zinc-100">
        <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 ${
                isAdmin ? "bg-purple-700" : "bg-zinc-800"
              }`}
            >
              {getInitials(currentUser?.name)}
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1">
                <p
                  className="text-xs font-semibold text-zinc-900 truncate"
                  title={currentUser?.name || "Pengguna"}
                >
                  {currentUser?.name || "Pengguna"}
                </p>
                {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
              </div>
              <p
                className="text-[11px] text-zinc-400 truncate"
                title={currentUser?.email || "user@univ.ac.id"}
              >
                {currentUser?.email || "user@univ.ac.id"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar (Logout Sesi)"
            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
