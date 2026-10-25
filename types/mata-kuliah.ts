export interface MataKuliah {
  id: number;
  kode: string;
  nama: string;
  sks: number;
  dosen: string;
}

export type MataKuliahFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: MataKuliah;
};
