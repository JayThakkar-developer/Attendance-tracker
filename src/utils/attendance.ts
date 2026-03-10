import { AttendanceRecord, AttendanceStatus } from "@/types";

const STORAGE_KEY = "attendance_records";

export function loadAttendance(): AttendanceRecord {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return {};
  return JSON.parse(data);
}

export function saveAttendance(record: AttendanceRecord) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
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