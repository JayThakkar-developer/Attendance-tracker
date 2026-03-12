import { Timetable, Weekday } from "@/types";

const STORAGE_KEY = "attendance_timetable";
const STORAGE_EVENT = "attendance_timetable_change";

const DAYS: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

let cachedRaw: string | null | undefined;
let cachedSnapshot: Timetable | null = null;

function normalizeTimetable(data: string): Timetable {
  const parsed = JSON.parse(data) as Record<string, unknown>;

  const normalized = {} as Timetable;

  for (const day of DAYS) {
    const lectures = parsed[day];

    if (!Array.isArray(lectures)) {
      normalized[day] = [];
      continue;
    }

    normalized[day] = lectures
      .map((entry) => {
        if (typeof entry === "string") {
          return { subject: entry, time: "" };
        }

        if (
          typeof entry === "object" &&
          entry !== null &&
          "subject" in entry &&
          "time" in entry
        ) {
          const subject = (entry as { subject: unknown }).subject;
          const time = (entry as { time: unknown }).time;

          if (typeof subject === "string" && typeof time === "string") {
            return { subject, time };
          }
        }

        return null;
      })
      .filter((lecture): lecture is { subject: string; time: string } => lecture !== null);
  }

  return normalized;
}

function notifyTimetableSubscribers() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function saveTimetable(timetable: Timetable) {
  if (typeof window === "undefined") return;

  const raw = JSON.stringify(timetable);
  localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedSnapshot = timetable;
  notifyTimetableSubscribers();
}

export function loadTimetable(): Timetable | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;

  return normalizeTimetable(data);
}

export function getTimetableSnapshot(): Timetable | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw === cachedRaw) {
    return cachedSnapshot;
  }

  cachedRaw = raw;
  cachedSnapshot = raw ? normalizeTimetable(raw) : null;

  return cachedSnapshot;
}

export function subscribeTimetable(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cachedRaw = undefined;
      onStoreChange();
    }
  };

  const handleSameTabUpdate = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_EVENT, handleSameTabUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_EVENT, handleSameTabUpdate);
  };
}

export function clearTimetable() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
  cachedRaw = null;
  cachedSnapshot = null;
  notifyTimetableSubscribers();
}