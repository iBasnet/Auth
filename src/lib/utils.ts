import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function TitleCase(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function GetInitials(str: string): string {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .join("");
}