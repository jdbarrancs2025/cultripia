import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parse a booking date string (YYYY-MM-DD) as local midnight
 * to avoid timezone conversion issues.
 *
 * Without the "T00:00:00" suffix, JavaScript interprets the date as UTC midnight,
 * which can result in the previous day being displayed in timezones west of UTC.
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object representing local midnight on the specified date
 */
export function parseBookingDate(dateString: string): Date {
  return new Date(dateString + "T00:00:00");
}
