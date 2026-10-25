import { Suspense } from "react";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/dal";
import { API_URL } from "@/lib/api";
import { Mahasiswa } from "@/types";
import { MahasiswaContainer } from "./components/MahasiswaContainer";

async function MahasiswaContent() {
  await getCurrentUser();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let initialData: Mahasiswa[] = [];
  try {
    const res = await fetch(`${API_URL}/mahasiswa`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      initialData = json.data || [];
    }
  } catch (error) {
    console.error("Gagal mengambil data mahasiswa dari backend:", error);
  }

  return <MahasiswaContainer initialData={initialData} />;
}

export default function MahasiswaPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-zinc-400">
          Memuat data mahasiswa dari backend...
        </div>
      }
    >
      <MahasiswaContent />
    </Suspense>
  );
}
