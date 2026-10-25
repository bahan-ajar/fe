"use client";

import { useState, useMemo } from "react";
import { Mahasiswa, MahasiswaStatus } from "@/types";

interface UseMahasiswaFilterProps {
  data: Mahasiswa[];
}

/**
 * Custom hook untuk mengelola logika pencarian, penyaringan kelas, dan status mahasiswa
 */
export function useMahasiswaFilter({ data }: UseMahasiswaFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<MahasiswaStatus | "">("");

  const kelasList = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.kelas))).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nim.toLowerCase().includes(searchQuery.toLowerCase());

      const matchKelas = selectedKelas ? item.kelas === selectedKelas : true;
      const matchStatus = selectedStatus ? item.status === selectedStatus : true;

      return matchSearch && matchKelas && matchStatus;
    });
  }, [data, searchQuery, selectedKelas, selectedStatus]);

  const hasActiveFilters = Boolean(searchQuery || selectedKelas || selectedStatus);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedKelas("");
    setSelectedStatus("");
  };

  return {
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
  };
}
