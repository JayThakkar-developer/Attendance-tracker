export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type Timetable = Record<Weekday, string[]>;

export type AttendanceStatus =
  | "attended"
  | "bunk"
  | "cancelled";

export type DailyAttendance = Record<string, AttendanceStatus>;

export type AttendanceRecord = Record<string, DailyAttendance>;