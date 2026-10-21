"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

interface PresensiHeaderProps {
  totalRecords: number;
}

export function PresensiHeader({ totalRecords }: PresensiHeaderProps) {
  const [formattedDate, setFormattedDate] = useState("18 Oktober 2026");

  useEffect(() => {
    setFormattedDate(
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Presensi Mahasiswa
          </h1>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
            {totalRecords} Catatan
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          Rekap kehadiran mahasiswa berdasarkan jadwal mata kuliah
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-700 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span>Hari Ini: {formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
