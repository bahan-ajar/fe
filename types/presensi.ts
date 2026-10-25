export type PresensiStatus = "hadir" | "izin" | "sakit" | "alpa";

export interface PresensiItem {
  id: number;
  nim: string;
  nama: string;
  mataKuliah: string;
  tanggal: string;
  status: PresensiStatus;
}
