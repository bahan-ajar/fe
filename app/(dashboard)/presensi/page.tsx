import { Suspense } from "react";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/dal";
import { API_URL } from "@/lib/api";
import { PresensiItem } from "@/types";
import { PresensiContainer } from "./components/PresensiContainer";

async function PresensiContent() {
  await getCurrentUser();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let initialData: PresensiItem[] = [];
  try {
    const res = await fetch(`${API_URL}/presensi`, {
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
    console.error("Gagal mengambil data presensi dari backend:", error);
  }

  return <PresensiContainer initialData={initialData} />;
}

export default function PresensiPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-zinc-400">
          Memuat data presensi dari backend...
        </div>
      }
    >
      <PresensiContent />
    </Suspense>
  );
}
