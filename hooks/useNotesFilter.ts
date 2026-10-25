"use client";

import { useState, useMemo } from "react";
import { Note } from "@/types";

interface UseNotesFilterProps {
  notes: Note[];
}

/**
 * Custom hook untuk mengelola logika filter pencarian dan kategori catatan
 */
export function useNotesFilter({ notes }: UseNotesFilterProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase()) ||
        (note.authorName && note.authorName.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" ? true : note.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [notes, search, selectedCategory]);

  return {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    filteredNotes,
  };
}
