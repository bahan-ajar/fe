"use client";

import { useState } from "react";
import { PresensiItem } from "@/types";
import { PresensiHeader } from "./PresensiHeader";
import { PresensiTable } from "./PresensiTable";
import { updatePresensiStatusAction } from "../actions";

interface PresensiContainerProps {
  initialData: PresensiItem[];
}

export function PresensiContainer({ initialData }: PresensiContainerProps) {
  const [data, setData] = useState<PresensiItem[]>(initialData);

  const handleStatusChange = async (id: number, newStatus: PresensiItem["status"]) => {
    // Optimistic UI update
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    // Call server action to update backend
    const res = await updatePresensiStatusAction(id, newStatus);
    if (!res.success) {
      console.error(res.message);
    }
  };

  return (
    <div className="space-y-6">
      <PresensiHeader totalRecords={data.length} />
      <PresensiTable data={data} onStatusChange={handleStatusChange} />
    </div>
  );
}
