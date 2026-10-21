"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Calendar } from "lucide-react";

export function DashboardHeader() {
  const [currentDate, setCurrentDate] = useState("Minggu, 18 Oktober 2026");

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  return (
    <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Search Bar */}
      <div className="relative w-72">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Cari mahasiswa, kelas, mata kuliah..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Date Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100 text-xs text-zinc-600">
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span>{currentDate}</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-zinc-600 font-medium">Semester Ganjil 2026/2027</span>
        </div>
      </div>
    </header>
  );
}
