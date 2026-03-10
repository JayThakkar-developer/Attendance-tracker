"use client";

import { useState } from "react";
import { Weekday, AttendanceStatus } from "@/types";
import { loadTimetable } from "@/utils/timetable";
import { markAttendance } from "@/utils/attendance";
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
  const [subjects] = useState<string[]>(() => {
    const timetable = loadTimetable();
    const today = getToday();

    if (timetable && timetable[today]) {
      return timetable[today];
    }

    return [];
  });

  function handleMark(subject: string, status: AttendanceStatus) {
    const today = new Date().toISOString().split("T")[0];
    const lectureId = `${subject}_${Date.now()}`;

    markAttendance(today, lectureId, status);

    alert(`${subject} marked as ${status}`);
  }

  return (
    <main className="min-h-screen p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Today&apos;s Lectures</h1>

      {subjects.length === 0 && (
        <p className="text-zinc-500">No lectures scheduled today.</p>
      )}

      {subjects.map((subject, index) => (
        <div
          key={index}
          className="mb-4 p-4 bg-white rounded shadow flex justify-between"
        >
          <span>{subject}</span>

          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={() => handleMark(subject, "attended")}
            >
              Attended
            </button>

            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => handleMark(subject, "bunk")}
            >
              Bunk
            </button>

            <button
              className="bg-gray-400 text-white px-3 py-1 rounded"
              onClick={() => handleMark(subject, "cancelled")}
            >
              Cancel
            </button>
          </div>
        </div>
      ))}

      <Navbar />
    </main>
  );
}