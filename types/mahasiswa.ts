export type MahasiswaStatus = "aktif" | "cuti";

export interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  kelas: string;
  status: MahasiswaStatus;
  created_at: string;
}

export type MahasiswaFormData = Omit<Mahasiswa, "id" | "created_at">;

export type MahasiswaFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: Mahasiswa;
};

// Alias for backward compatibility
export type FormState = MahasiswaFormState;
