"use client";

import { useSyncExternalStore } from "react";
import { Weekday, AttendanceRecord, AttendanceStatus, Lecture, Timetable } from "@/types";
import { getTimetableSnapshot, subscribeTimetable } from "@/utils/timetable";
import {
  getAttendanceSnapshot,
  markAttendance,
  subscribeAttendance,
} from "@/utils/attendance";
import Navbar from "@/components/navbar";

function getToday(): Weekday {
  const days: Weekday[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[new Date().getDay()];
}

export default function AttendancePage() {
  const today = new Date().toISOString().split("T")[0];
  const day = getToday();

  const timetable = useSyncExternalStore<Timetable | null>(
    subscribeTimetable,
    getTimetableSnapshot,
    () => null
  );

  const attendance = useSyncExternalStore<AttendanceRecord>(
    subscribeAttendance,
    getAttendanceSnapshot,
    () => ({})
  );

  const lectures: Lecture[] = timetable?.[day] ?? [];
  const todayRecords: Record<string, AttendanceStatus> = attendance[today] ?? {};

  function getLectureId(lecture: Lecture) {
    return `${lecture.subject}__${lecture.time}`;
  }

  function handleMark(lecture: Lecture, status: AttendanceStatus) {
    const lectureId = getLectureId(lecture);

    markAttendance(today, lectureId, status);

    alert(`${lecture.subject} marked as ${status}`);
  }

  function lectureAlreadyMarked(lecture: Lecture) {
    return getLectureId(lecture) in todayRecords;
  }

  function getStatus(lecture: Lecture): AttendanceStatus | null {
    return todayRecords[getLectureId(lecture)] ?? null;
  }

  return (
    <main className="min-h-screen p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Today&apos;s Lectures</h1>

      {lectures.length === 0 && (
        <p className="text-zinc-500">No lectures scheduled today.</p>
      )}

      {lectures.map((lecture, index) => {
        const marked = lectureAlreadyMarked(lecture);
        const status = getStatus(lecture);

        return (
          <div
            key={index}
            className="mb-4 p-4 bg-white rounded shadow flex justify-between"
          >
            <span>
              {lecture.subject}
              {lecture.time ? ` (${lecture.time})` : ""}
            </span>

            {!marked && (
              <div className="flex gap-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleMark(lecture, "attended")}
                >
                  Attended
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleMark(lecture, "bunk")}
                >
                  Bunk
                </button>

                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                  onClick={() => handleMark(lecture, "cancelled")}
                >
                  Cancel
                </button>
              </div>
            )}

            {marked && (
              <span className="font-semibold">
                {status === "attended" && "✓ Attended"}
                {status === "bunk" && "✗ Bunk"}
                {status === "cancelled" && "Cancelled"}
              </span>
            )}
          </div>
        );
      })}

      <Navbar />
    </main>
  );
}