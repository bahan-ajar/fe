"use client";

import { useState, useOptimistic } from "react";
import { MataKuliah } from "@/types";
import { MataKuliahHeader } from "./MataKuliahHeader";
import { MataKuliahTable } from "./MataKuliahTable";
import { MataKuliahModal } from "./MataKuliahModal";
import { MataKuliahDeleteModal } from "./MataKuliahDeleteModal";
import { deleteMataKuliahAction } from "../actions";

interface MataKuliahContainerProps {
  initialData: MataKuliah[];
}

export function MataKuliahContainer({ initialData }: MataKuliahContainerProps) {
  const [data, setData] = useState<MataKuliah[]>(initialData);

  const [optimisticData, setOptimisticData] = useOptimistic(
    data,
    (current, action: { type: "delete"; id: number } | { type: "save"; item: MataKuliah }) => {
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
        return [...current, action.item];
      }
      return current;
    }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMK, setEditingMK] = useState<MataKuliah | null>(null);
  const [deletingMK, setDeletingMK] = useState<MataKuliah | null>(null);

  const handleAddNew = () => {
    setEditingMK(null);
    setIsModalOpen(true);
  };

  const handleEdit = (mk: MataKuliah) => {
    setEditingMK(mk);
    setIsModalOpen(true);
  };

  const handleDelete = (mk: MataKuliah) => {
    setDeletingMK(mk);
  };

  const handleSave = (savedMK: MataKuliah) => {
    setOptimisticData({ type: "save", item: savedMK });
    setData((prev) => {
      const index = prev.findIndex((m) => m.id === savedMK.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = savedMK;
        return updated;
      }
      return [...prev, savedMK];
    });
  };

  const handleConfirmDelete = async () => {
    if (deletingMK) {
      const targetId = deletingMK.id;
      setDeletingMK(null);
      setOptimisticData({ type: "delete", id: targetId });

      await deleteMataKuliahAction(targetId);
      setData((prev) => prev.filter((m) => m.id !== targetId));
    }
  };

  return (
    <div className="space-y-6">
      <MataKuliahHeader totalCount={optimisticData.length} onAddNew={handleAddNew} />
      <MataKuliahTable data={optimisticData} onEdit={handleEdit} onDelete={handleDelete} />

      <MataKuliahModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingMataKuliah={editingMK}
      />

      <MataKuliahDeleteModal
        isOpen={Boolean(deletingMK)}
        onClose={() => setDeletingMK(null)}
        onConfirm={handleConfirmDelete}
        mataKuliah={deletingMK}
      />
    </div>
  );
}
