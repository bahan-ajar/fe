/**
 * Format string tanggal ke format lokal Indonesia (id-ID)
 */
export function formatDate(
  dateInput: string | number | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);

    return date.toLocaleDateString(
      "id-ID",
      options || {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return String(dateInput);
  }
}

/**
 * Dapatkan inisial nama untuk avatar
 */
export function getInitials(name?: string): string {
  if (!name) return "AD";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Gabungkan kelas CSS secara dinamis
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
