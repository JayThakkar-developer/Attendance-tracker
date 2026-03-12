export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type Lecture = {
  subject: string;
  time: string;
};

export type Timetable = Record<Weekday, Lecture[]>;

export type AttendanceStatus =
  | "attended"
  | "bunk"
  | "cancelled";

export type DailyAttendance = Record<string, AttendanceStatus>;

export type AttendanceRecord = Record<string, DailyAttendance>;