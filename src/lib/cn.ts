import { clsx, type ClassValue } from "clsx";

/** Joins class names. Kept to clsx only (no tailwind-merge) to save client bytes. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
