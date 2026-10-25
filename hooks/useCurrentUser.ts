"use client";

import { useSyncExternalStore } from "react";
import { CurrentUser } from "@/types";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): CurrentUser | null {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getServerSnapshot(): CurrentUser | null {
  return null;
}

/**
 * Custom hook untuk membaca sesi pengguna aktif di client secara reaktif dan aman dari cascading renders
 */
export function useCurrentUser() {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    user,
    isAdmin: user?.role === "admin",
    isMember: user?.role === "member",
  };
}
