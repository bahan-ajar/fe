import { Suspense } from "react";
import { getCurrentUser } from "@/lib/dal";
import { DashboardSidebar } from "./components/Sidebar";
import { DashboardHeader } from "./components/Header";

async function AuthGuard({ children }: { children: React.ReactNode }) {
  await getCurrentUser();
  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-zinc-50/60">
      <Suspense fallback={<aside className="w-64 border-r border-zinc-200 bg-white" />}>
        <DashboardSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={<header className="h-16 border-b border-zinc-200 bg-white" />}>
          <DashboardHeader />
        </Suspense>
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={<div className="p-4 text-xs text-zinc-400">Memuat sesi & konten...</div>}>
            <AuthGuard>{children}</AuthGuard>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
