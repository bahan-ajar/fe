export type NoteCategory = "Kuliah" | "Tugas" | "Pribadi" | "Ujian";

export interface Note {
  id: number;
  title: string;
  content: string;
  category: NoteCategory;
  priority: number;
  userId: number;
  authorName?: string;
  created_at: string;
  updated_at: string;
}

export type ActionFormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: Note;
};

export type NoteFormState = ActionFormState;
