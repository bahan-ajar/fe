"use client";

import { useState, useMemo, useOptimistic } from "react";
import { Mahasiswa } from "./types";
import { deleteMahasiswaAction } from "./actions";
import { MahasiswaHeader } from "./components/MahasiswaHeader";
import { MahasiswaFilters } from "./components/MahasiswaFilters";
import { MahasiswaTable } from "./components/MahasiswaTable";
import { MahasiswaModal } from "./components/MahasiswaModal";
import { MahasiswaDeleteModal } from "./components/MahasiswaDeleteModal";

// Initial seed data aligned with backend seeder
const initialData: Mahasiswa[] = [
  {
    id: 1,
    nim: "2101001",
    nama: "Ahmad Fauzi",
    kelas: "TI-3A",
    status: "aktif",
    created_at: "12 Jan 2026",
  },
  {
    id: 2,
    nim: "2101002",
    nama: "Dewi Lestari",
    kelas: "TI-3A",
    status: "aktif",
    created_at: "14 Jan 2026",
  },
  {
    id: 3,
    nim: "2101003",
    nama: "Rian Pratama",
    kelas: "TI-3B",
    status: "aktif",
    created_at: "15 Jan 2026",
  },
  {
    id: 4,
    nim: "2101004",
    nama: "Nadia Putri",
    kelas: "TI-3B",
    status: "cuti",
    created_at: "16 Jan 2026",
  },
];

export default function MahasiswaPage() {
  const [data, setData] = useState<Mahasiswa[]>(initialData);

  // Optimistic UI untuk respon instan saat mutasi data (Langkah 9 Opsi B)
  const [optimisticData, setOptimisticData] = useOptimistic(
    data,
    (current, action: { type: "delete"; id: number } | { type: "save"; item: Mahasiswa }) => {
      if (action.type === "delete") {
        return current.filter((item) => item.id !== action.id);
      }
      if (action.type === "save") {
        const index = current.findIndex((m) => m.id === action.item.id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = action.item;
          return updated;
        }
        return [action.item, ...current];
      }
      return current;
    }
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMahasiswa, setEditingMahasiswa] = useState<Mahasiswa | null>(null);
  const [deletingMahasiswa, setDeletingMahasiswa] = useState<Mahasiswa | null>(null);

  // Available classes
  const kelasList = useMemo(() => {
    return Array.from(new Set(optimisticData.map((d) => d.kelas))).sort();
  }, [optimisticData]);

  // Filtered data menggunakan optimisticData
  const filteredData = useMemo(() => {
    return optimisticData.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nim.toLowerCase().includes(searchQuery.toLowerCase());

      const matchKelas = selectedKelas ? item.kelas === selectedKelas : true;
      const matchStatus = selectedStatus ? item.status === selectedStatus : true;

      return matchSearch && matchKelas && matchStatus;
    });
  }, [optimisticData, searchQuery, selectedKelas, selectedStatus]);

  const hasActiveFilters = Boolean(searchQuery || selectedKelas || selectedStatus);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedKelas("");
    setSelectedStatus("");
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingMahasiswa(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (mhs: Mahasiswa) => {
    setEditingMahasiswa(mhs);
    setIsFormModalOpen(true);
  };

  // Save (Hasil dari Server Action)
  const handleSave = (savedMahasiswa: Mahasiswa) => {
    setOptimisticData({ type: "save", item: savedMahasiswa });
    setData((prev) => {
      const index = prev.findIndex((item) => item.id === savedMahasiswa.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = savedMahasiswa;
        return updated;
      }
      return [savedMahasiswa, ...prev];
    });
  };

  // Open Delete Modal
  const handleOpenDelete = (mhs: Mahasiswa) => {
    setDeletingMahasiswa(mhs);
  };

  // Confirm Delete dengan Server Action & Optimistic Update
  const handleConfirmDelete = async () => {
    if (deletingMahasiswa) {
      const targetId = deletingMahasiswa.id;
      setDeletingMahasiswa(null);

      // Respon instan di layar dengan useOptimistic
      setOptimisticData({ type: "delete", id: targetId });

      // Panggil Server Action untuk mutasi delete
      await deleteMahasiswaAction(targetId);

      setData((prev) => prev.filter((item) => item.id !== targetId));
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <MahasiswaHeader
        totalCount={data.length}
        onAddNew={handleOpenAdd}
      />

      {/* Filter & Search Bar */}
      <MahasiswaFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedKelas={selectedKelas}
        onKelasChange={setSelectedKelas}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        kelasList={kelasList}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Table Component */}
      <MahasiswaTable
        data={filteredData}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onResetFilters={handleResetFilters}
      />

      {/* Add / Edit Form Modal */}
      <MahasiswaModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        editingMahasiswa={editingMahasiswa}
        kelasList={kelasList}
      />

      {/* Delete Confirmation Modal */}
      <MahasiswaDeleteModal
        isOpen={Boolean(deletingMahasiswa)}
        onClose={() => setDeletingMahasiswa(null)}
        onConfirm={handleConfirmDelete}
        mahasiswa={deletingMahasiswa}
      />
    </div>
  );
}
