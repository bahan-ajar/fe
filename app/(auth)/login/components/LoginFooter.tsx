import { ShieldCheck } from "lucide-react";

export function LoginFooter() {
  return (
    <footer className="mt-8 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5 text-zinc-500">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Koneksi aman terenkripsi 256-bit SSL</span>
      </div>
      <p>© 2026 Universitas Sistem Akademik. Seluruh hak cipta dilindungi.</p>
    </footer>
  );
}
