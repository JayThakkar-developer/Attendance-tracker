import { AttendanceRecord, AttendanceStatus } from "@/types";

const STORAGE_KEY = "attendance_records";
const STORAGE_EVENT = "attendance_records_change";
const EMPTY_ATTENDANCE: AttendanceRecord = {};

let cachedRaw: string | null | undefined;
let cachedSnapshot: AttendanceRecord = EMPTY_ATTENDANCE;

function notifyAttendanceSubscribers() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function loadAttendance(): AttendanceRecord {
  if (typeof window === "undefined") return {};

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return {};
  return JSON.parse(data);
}

export function getAttendanceSnapshot(): AttendanceRecord {
  if (typeof window === "undefined") return EMPTY_ATTENDANCE;

  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw === cachedRaw) {
    return cachedSnapshot;
  }

  cachedRaw = raw;
  cachedSnapshot = raw ? (JSON.parse(raw) as AttendanceRecord) : EMPTY_ATTENDANCE;

  return cachedSnapshot;
}

export function subscribeAttendance(onStoreChange: () => void): () => void {
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

export function saveAttendance(record: AttendanceRecord) {
  if (typeof window === "undefined") return;

  const raw = JSON.stringify(record);
  localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedSnapshot = record;
  notifyAttendanceSubscribers();
}

export function markAttendance(
  date: string,
  lectureId: string,
  status: AttendanceStatus
) {
  const record = loadAttendance();

  if (!record[date]) {
    record[date] = {};
  }

  record[date][lectureId] = status;

  saveAttendance(record);
}