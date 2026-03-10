import { Timetable } from "@/types";

const STORAGE_KEY = "attendance_timetable";

export function saveTimetable(timetable: Timetable) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(timetable));
}

export function loadTimetable(): Timetable | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;

  return JSON.parse(data);
}

export function clearTimetable() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}