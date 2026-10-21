"use client";

import { useState, useEffect, useActionState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { Mahasiswa, MahasiswaStatus } from "../types";
import { saveMahasiswaAction, FormState } from "../actions";

interface MahasiswaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (savedMahasiswa: Mahasiswa) => void;
  editingMahasiswa: Mahasiswa | null;
  kelasList: string[];
}

const initialFormState: FormState = {
  success: false,
  message: "",
};

export function MahasiswaModal({
  isOpen,
  onClose,
  onSave,
  editingMahasiswa,
  kelasList,
}: MahasiswaModalProps) {
  // Hook useActionState untuk menghubungkan Form dengan Server Action
  const [state, formAction, isPending] = useActionState(
    saveMahasiswaAction,
    initialFormState
  );

  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("TI-3A");
  const [status, setStatus] = useState<MahasiswaStatus>("aktif");

  useEffect(() => {
    if (editingMahasiswa) {
      setNim(editingMahasiswa.nim);
      setNama(editingMahasiswa.nama);
      setKelas(editingMahasiswa.kelas);
      setStatus(editingMahasiswa.status);
    } else {
      setNim("");
      setNama("");
      setKelas(kelasList[0] || "TI-3A");
      setStatus("aktif");
    }
  }, [editingMahasiswa, isOpen, kelasList]);

  // Efek ketika mutasi Server Action berhasil
  useEffect(() => {
    if (state.success && state.data) {
      onSave(state.data);
      onClose();
    }
  }, [state, onSave, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-zinc-200 rounded-xl max-w-md w-full shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900">
            {editingMahasiswa ? "Ubah Data Mahasiswa (Server Action)" : "Tambah Mahasiswa Baru (Zod Validated)"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body & Server Action Form */}
        <form action={formAction} className="p-6 space-y-4">
          {/* Hidden ID jika sedang mengedit */}
          {editingMahasiswa && (
            <input type="hidden" name="id" value={editingMahasiswa.id} />
          )}

          {/* Feedback error umum jika validasi gagal */}
          {state.message && !state.success && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{state.message}</span>
            </div>
          )}

          {/* Field: NIM */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Nomor Induk Mahasiswa (NIM)
            </label>
            <input
              type="text"
              name="nim"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              placeholder="Contoh: 2101005 (min 5 digit)"
              disabled={isPending}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none font-mono transition-colors ${
                state.errors?.nim
                  ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30"
                  : "border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              }`}
            />
            {state.errors?.nim && (
              <p className="text-red-600 text-[11px] mt-1 font-medium">
                {state.errors.nim[0]}
              </p>
            )}
          </div>

          {/* Field: Nama */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Farhan Rizki Maulana"
              disabled={isPending}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors ${
                state.errors?.nama
                  ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30"
                  : "border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              }`}
            />
            {state.errors?.nama && (
              <p className="text-red-600 text-[11px] mt-1 font-medium">
                {state.errors.nama[0]}
              </p>
            )}
          </div>

          {/* Field: Kelas */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Kelas
            </label>
            <select
              name="kelas"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            >
              {kelasList.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
              <option value="TI-3C">TI-3C</option>
            </select>
            {state.errors?.kelas && (
              <p className="text-red-600 text-[11px] mt-1 font-medium">
                {state.errors.kelas[0]}
              </p>
            )}
          </div>

          {/* Field: Status */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-2">
              Status Akademik
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  status === "aktif"
                    ? "bg-zinc-50 border-zinc-900 text-zinc-900 font-medium"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="aktif"
                  checked={status === "aktif"}
                  onChange={() => setStatus("aktif")}
                  disabled={isPending}
                  className="w-3.5 h-3.5 text-zinc-900 focus:ring-zinc-900"
                />
                <span>Mahasiswa Aktif</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  status === "cuti"
                    ? "bg-zinc-50 border-zinc-900 text-zinc-900 font-medium"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="cuti"
                  checked={status === "cuti"}
                  onChange={() => setStatus("cuti")}
                  disabled={isPending}
                  className="w-3.5 h-3.5 text-zinc-900 focus:ring-zinc-900"
                />
                <span>Cuti Akademik</span>
              </label>
            </div>
            {state.errors?.status && (
              <p className="text-red-600 text-[11px] mt-1 font-medium">
                {state.errors.status[0]}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan ke Server...</span>
                </>
              ) : (
                <span>{editingMahasiswa ? "Perbarui Data" : "Simpan Data"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
