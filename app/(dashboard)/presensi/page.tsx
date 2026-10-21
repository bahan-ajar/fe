"use client";

import { useState } from "react";
import { PresensiHeader } from "./components/PresensiHeader";
import { PresensiTable, PresensiItem } from "./components/PresensiTable";

const initialPresensi: PresensiItem[] = [
  {
    id: 1,
    nim: "2101001",
    nama: "Ahmad Fauzi",
    mataKuliah: "Pemrograman Web Lanjut",
    tanggal: "2026-10-18",
    status: "hadir",
  },
  {
    id: 2,
    nim: "2101002",
    nama: "Dewi Lestari",
    mataKuliah: "Pemrograman Web Lanjut",
    tanggal: "2026-10-18",
    status: "hadir",
  },
  {
    id: 3,
    nim: "2101003",
    nama: "Rian Pratama",
    mataKuliah: "Basis Data Terdistribusi",
    tanggal: "2026-10-17",
    status: "izin",
  },
  {
    id: 4,
    nim: "2101004",
    nama: "Nadia Putri",
    mataKuliah: "Kecerdasan Buatan",
    tanggal: "2026-10-17",
    status: "sakit",
  },
];

export default function PresensiPage() {
  const [data, setData] = useState<PresensiItem[]>(initialPresensi);

  const handleStatusChange = (id: number, newStatus: PresensiItem["status"]) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div className="space-y-6">
      <PresensiHeader totalRecords={data.length} />
      <PresensiTable data={data} onStatusChange={handleStatusChange} />
    </div>
  );
}
