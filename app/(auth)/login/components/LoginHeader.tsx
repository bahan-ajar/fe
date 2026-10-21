import { GraduationCap } from "lucide-react";

export function LoginHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-4 shadow-sm">
        <GraduationCap className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Portal Akademik
      </h1>
      <p className="text-sm text-zinc-500 mt-1">
        Masuk untuk mengelola data mahasiswa dan perkuliahan
      </p>
    </div>
  );
}
