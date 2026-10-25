"use client";

import { useState, useEffect, useActionState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { MataKuliah, MataKuliahFormState } from "@/types";
import { saveMataKuliahAction } from "../actions";

interface MataKuliahModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (savedMK: MataKuliah) => void;
  editingMataKuliah: MataKuliah | null;
}

const initialFormState: MataKuliahFormState = {
  success: false,
  message: "",
};

function MataKuliahModalContent({
  onClose,
  onSave,
  editingMataKuliah,
}: Omit<MataKuliahModalProps, "isOpen">) {
  const [state, formAction, isPending] = useActionState(
    saveMataKuliahAction,
    initialFormState
  );

  const [kode, setKode] = useState(editingMataKuliah?.kode || "");
  const [nama, setNama] = useState(editingMataKuliah?.nama || "");
  const [sks, setSks] = useState(editingMataKuliah?.sks?.toString() || "3");
  const [dosen, setDosen] = useState(
    editingMataKuliah?.dosen || "Dr. Budi Santoso, M.Kom."
  );

  useEffect(() => {
    if (state.success && state.data) {
      onSave(state.data);
      onClose();
    }
  }, [state, onSave, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-zinc-200 rounded-xl max-w-md w-full shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900">
            {editingMataKuliah
              ? "Ubah Data Mata Kuliah"
              : "Tambah Mata Kuliah Baru"}
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
          {editingMataKuliah && (
            <input type="hidden" name="id" value={editingMataKuliah.id} />
          )}

          {state.message && !state.success && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{state.message}</span>
            </div>
          )}

          {/* Field: Kode MK */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Kode Mata Kuliah
            </label>
            <input
              type="text"
              name="kode"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              placeholder="Contoh: MK-104"
              disabled={isPending}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none font-mono transition-colors ${
                state.errors?.kode
                  ? "border-red-300 focus:border-red-500 bg-red-50/30"
                  : "border-zinc-200 focus:border-zinc-900"
              }`}
            />
            {state.errors?.kode && (
              <p className="text-red-600 text-[11px] mt-1 font-medium">
                {state.errors.kode[0]}
              </p>
            )}
          </div>

          {/* Field: Nama MK */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Nama Mata Kuliah
            </label>
            <input
              type="text"
              name="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Rekayasa Perangkat Lunak"
              disabled={isPending}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors ${
                state.errors?.nama
                  ? "border-red-300 focus:border-red-500 bg-red-50/30"
                  : "border-zinc-200 focus:border-zinc-900"
              }`}
            />
            {state.errors?.nama && (
              <p className="text-red-600 text-[11px] mt-1 font-medium">
                {state.errors.nama[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Field: SKS */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Bobot SKS
              </label>
              <input
                type="number"
                name="sks"
                min={1}
                max={6}
                value={sks}
                onChange={(e) => setSks(e.target.value)}
                disabled={isPending}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
              {state.errors?.sks && (
                <p className="text-red-600 text-[11px] mt-1 font-medium">
                  {state.errors.sks[0]}
                </p>
              )}
            </div>

            {/* Field: Dosen */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Dosen Pengampu
              </label>
              <select
                name="dosen"
                value={dosen}
                onChange={(e) => setDosen(e.target.value)}
                disabled={isPending}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:border-zinc-900"
              >
                <option value="Dr. Budi Santoso, M.Kom.">Dr. Budi Santoso, M.Kom.</option>
                <option value="Siti Rahma, M.Cs.">Siti Rahma, M.Cs.</option>
                <option value="Ir. Bambang Hidayat, M.T.">Ir. Bambang Hidayat, M.T.</option>
              </select>
              {state.errors?.dosen && (
                <p className="text-red-600 text-[11px] mt-1 font-medium">
                  {state.errors.dosen[0]}
                </p>
              )}
            </div>
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
                <span>{editingMataKuliah ? "Perbarui Data" : "Simpan Data"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MataKuliahModal(props: MataKuliahModalProps) {
  if (!props.isOpen) return null;

  return (
    <MataKuliahModalContent
      key={props.editingMataKuliah?.id ?? "new"}
      {...props}
    />
  );
}
