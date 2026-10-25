export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Standard fetch helper with credentials and base URL
 */
export async function fetchApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; status: number }> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const json = await res.json().catch(() => null);

    return {
      success: res.ok && (json?.success ?? true),
      data: json?.data ?? json,
      message: json?.message,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal terhubung ke API server",
      status: 500,
    };
  }
}
