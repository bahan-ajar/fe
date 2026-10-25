import { Suspense } from "react";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/dal";
import { API_URL } from "@/lib/api";
import { MataKuliah } from "@/types";
import { MataKuliahContainer } from "./components/MataKuliahContainer";

async function MataKuliahContent() {
  await getCurrentUser();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let initialData: MataKuliah[] = [];
  try {
    const res = await fetch(`${API_URL}/mata-kuliah`, {
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
    console.error("Gagal mengambil data mata kuliah dari backend:", error);
  }

  return <MataKuliahContainer initialData={initialData} />;
}

export default function MataKuliahPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-zinc-400">
          Memuat daftar mata kuliah dari backend...
        </div>
      }
    >
      <MataKuliahContent />
    </Suspense>
  );
}
