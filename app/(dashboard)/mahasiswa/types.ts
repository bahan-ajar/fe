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
