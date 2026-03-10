"use client";

import { useState } from "react";
import { Weekday, Timetable } from "@/types";
import { saveTimetable } from "@/utils/timetable";

const days: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function SetupPage() {
  const [timetable, setTimetable] = useState<Timetable>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  function handleAddSubject(day: Weekday, subject: string) {
    setTimetable((prev) => ({
      ...prev,
      [day]: [...prev[day], subject],
    }));
  }

  function handleSave() {
    saveTimetable(timetable);
    alert("Timetable saved!");
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Setup Timetable</h1>

      {days.map((day) => (
        <div key={day} className="mb-4">
          <h2 className="font-semibold capitalize">{day}</h2>

          <button
            className="mt-2 px-3 py-1 bg-black text-white rounded"
            onClick={() => {
              const subject = prompt("Enter subject name");
              if (subject) handleAddSubject(day, subject);
            }}
          >
            Add Subject
          </button>

          <ul className="mt-2">
            {timetable[day].map((subject, index) => (
              <li key={index}>{subject}</li>
            ))}
          </ul>
        </div>
      ))}

      <button
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
        onClick={handleSave}
      >
        Save Timetable
      </button>
    </main>
  );
}