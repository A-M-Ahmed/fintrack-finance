import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

// Utility to ensure minimum loading time (for smooth skeleton UX)
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
