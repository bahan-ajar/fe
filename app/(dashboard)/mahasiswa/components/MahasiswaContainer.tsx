"use client";

import { useState, useOptimistic } from "react";
import { Mahasiswa } from "@/types";
import { useMahasiswaFilter } from "@/hooks";
import { deleteMahasiswaAction } from "../actions";
import { MahasiswaHeader } from "./MahasiswaHeader";
import { MahasiswaFilters } from "./MahasiswaFilters";
import { MahasiswaTable } from "./MahasiswaTable";
import { MahasiswaModal } from "./MahasiswaModal";
import { MahasiswaDeleteModal } from "./MahasiswaDeleteModal";

interface MahasiswaContainerProps {
  initialData: Mahasiswa[];
}

export function MahasiswaContainer({ initialData }: MahasiswaContainerProps) {
  const [data, setData] = useState<Mahasiswa[]>(initialData);

  // Optimistic UI untuk respon instan saat mutasi data
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

  // Custom hook untuk pengelolaan filter & pencarian
  const {
    searchQuery,
    setSearchQuery,
    selectedKelas,
    setSelectedKelas,
    selectedStatus,
    setSelectedStatus,
    kelasList,
    filteredData,
    hasActiveFilters,
    handleResetFilters,
  } = useMahasiswaFilter({ data: optimisticData });

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMahasiswa, setEditingMahasiswa] = useState<Mahasiswa | null>(null);
  const [deletingMahasiswa, setDeletingMahasiswa] = useState<Mahasiswa | null>(null);

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
