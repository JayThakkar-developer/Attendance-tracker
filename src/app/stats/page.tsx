"use client";

import { useSyncExternalStore } from "react";
import { AttendanceRecord } from "@/types";
import { getAttendanceSnapshot, subscribeAttendance } from "@/utils/attendance";
import { getTimetableSnapshot, subscribeTimetable } from "@/utils/timetable";
import Navbar from "@/components/navbar";

const EMPTY_ATTENDANCE: AttendanceRecord = {};

export default function StatsPage() {
  const attendanceRecords = useSyncExternalStore<AttendanceRecord>(
    subscribeAttendance,
    getAttendanceSnapshot,
    () => EMPTY_ATTENDANCE
  );

  const timetable = useSyncExternalStore(
    subscribeTimetable,
    getTimetableSnapshot,
    () => null
  );

  const attendanceDays = Object.keys(attendanceRecords).length;
  const configuredDays = timetable ? Object.keys(timetable).length : 0;

  const subjectStats: Record<
    string,
    { attended: number; bunk: number; cancelled: number; total: number }
  > = {};

  for (const date in attendanceRecords) {
    const dailyRecords = attendanceRecords[date];

    for (const lectureId in dailyRecords) {
      const status = dailyRecords[lectureId];
      const subject = lectureId.split("__")[0];

      if (!subjectStats[subject]) {
        subjectStats[subject] = {
          attended: 0,
          bunk: 0,
          cancelled: 0,
          total: 0,
        };
      }

      if (status === "attended") {
        subjectStats[subject].attended += 1;
        subjectStats[subject].total += 1;
      } else if (status === "bunk") {
        subjectStats[subject].bunk += 1;
        subjectStats[subject].total += 1;
      } else if (status === "cancelled") {
        subjectStats[subject].cancelled += 1;
      }
    }
  }

  const subjects = Object.keys(subjectStats);

  return (
    <main className="min-h-screen p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Attendance Stats</h1>

      {subjects.length === 0 ? (
        <p className="text-zinc-500">No attendance recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {subjects.map((subject) => {
            const stats = subjectStats[subject];

            return (
              <section key={subject} className="rounded bg-white p-4 shadow text-zinc-900">
                <p className="font-semibold mb-2">{subject}</p>
                <p>Attended: {stats.attended}</p>
                <p>Bunk: {stats.bunk}</p>
                <p>Cancelled: {stats.cancelled}</p>
                <p>Total: {stats.total}</p>
              </section>
            );
          })}
        </div>
      )}

      <p className="text-xs text-zinc-400 mt-4">
        Loaded {attendanceDays} attendance day(s), timetable configured for {configuredDays} day(s).
      </p>

      <Navbar />
    </main>
  );
}