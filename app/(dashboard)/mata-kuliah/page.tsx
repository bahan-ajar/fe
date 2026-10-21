"use client";

import { useState } from "react";
import { MataKuliahHeader } from "./components/MataKuliahHeader";
import { MataKuliahTable, MataKuliah } from "./components/MataKuliahTable";

const initialMataKuliah: MataKuliah[] = [
  {
    id: 1,
    kode: "MK-101",
    nama: "Pemrograman Web Lanjut",
    sks: 3,
    dosen: "Dr. Budi Santoso, M.Kom.",
  },
  {
    id: 2,
    kode: "MK-102",
    nama: "Basis Data Terdistribusi",
    sks: 3,
    dosen: "Dr. Budi Santoso, M.Kom.",
  },
  {
    id: 3,
    kode: "MK-103",
    nama: "Kecerdasan Buatan",
    sks: 4,
    dosen: "Siti Rahma, M.Cs.",
  },
];

export default function MataKuliahPage() {
  const [data, setData] = useState<MataKuliah[]>(initialMataKuliah);

  const handleAddNew = () => {
    const kode = prompt("Masukkan Kode MK (contoh: MK-104):");
    if (!kode) return;
    const nama = prompt("Masukkan Nama Mata Kuliah:");
    if (!nama) return;

    const newMK: MataKuliah = {
      id: Date.now(),
      kode,
      nama,
      sks: 3,
      dosen: "Dr. Budi Santoso, M.Kom.",
    };
    setData((prev) => [...prev, newMK]);
  };

  const handleEdit = (mk: MataKuliah) => {
    const newNama = prompt("Edit Nama Mata Kuliah:", mk.nama);
    if (newNama && newNama.trim()) {
      setData((prev) =>
        prev.map((item) => (item.id === mk.id ? { ...item, nama: newNama } : item))
      );
    }
  };

  const handleDelete = (mk: MataKuliah) => {
    if (confirm(`Yakin ingin menghapus mata kuliah ${mk.nama}?`)) {
      setData((prev) => prev.filter((item) => item.id !== mk.id));
    }
  };

  return (
    <div className="space-y-6">
      <MataKuliahHeader totalCount={data.length} onAddNew={handleAddNew} />
      <MataKuliahTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
