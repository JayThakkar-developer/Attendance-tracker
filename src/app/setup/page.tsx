"use client";

import { useState, useSyncExternalStore } from "react";
import { Weekday, Timetable } from "@/types";
import {
  saveTimetable,
  getTimetableSnapshot,
  subscribeTimetable,
} from "@/utils/timetable";

const days: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function createEmptyTimetable(): Timetable {
  return {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };
}

export default function SetupPage() {
  const storedTimetable = useSyncExternalStore(
    subscribeTimetable,
    getTimetableSnapshot,
    () => null
  );

  const [draftTimetable, setDraftTimetable] = useState<Timetable | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const timetable = draftTimetable ?? storedTimetable ?? createEmptyTimetable();

  function handleStartEditing() {
    const source = storedTimetable ?? createEmptyTimetable();

    setDraftTimetable({
      monday: [...source.monday],
      tuesday: [...source.tuesday],
      wednesday: [...source.wednesday],
      thursday: [...source.thursday],
      friday: [...source.friday],
      saturday: [...source.saturday],
      sunday: [...source.sunday],
    });
    setIsEditing(true);
  }

  function handleStopEditing() {
    setDraftTimetable(null);
    setIsEditing(false);
  }

  function handleAddLecture(day: Weekday) {
    if (!draftTimetable) return;

    const subject = prompt("Enter subject name");

    if (!subject) return;

    const time = prompt("Enter lecture time (HH:MM)");

    if (!time) return;

    setDraftTimetable((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [day]: [...prev[day], { subject, time }],
      };
    });
  }

  function handleRemoveLecture(day: Weekday, index: number) {
    if (!draftTimetable) return;

    setDraftTimetable((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [day]: prev[day].filter((_, i) => i !== index),
      };
    });
  }

  function handleSave() {
    if (!draftTimetable) return;

    saveTimetable(draftTimetable);
    setDraftTimetable(null);
    setIsEditing(false);
    alert("Timetable saved!");
  }

  return (
    <main className="min-h-screen p-6 pb-24">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Setup Timetable</h1>

        {!isEditing && (
          <button
            className="px-4 py-2 bg-black text-white rounded-lg"
            onClick={handleStartEditing}
          >
            Edit Timetable
          </button>
        )}

        {isEditing && (
          <button
            className="px-4 py-2 bg-zinc-700 text-white rounded-lg"
            onClick={handleStopEditing}
          >
            Done
          </button>
        )}
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-max">
          {days.map((day) => (
            <div key={day} className="w-64 bg-zinc-900/30 rounded-lg p-4">
              <h2 className="font-semibold capitalize mb-3">{day}</h2>

              <div className="space-y-2">
                {timetable[day].map((lecture, index) => (
                  <div
                    key={index}
                    className="bg-white text-black px-4 py-2 rounded-lg shadow flex items-center justify-between gap-2"
                  >
                    <span className="font-medium">
                      {lecture.subject}
                      {lecture.time ? ` (${lecture.time})` : ""}
                    </span>

                    {isEditing && (
                      <button
                        className="text-red-500 text-sm"
                        onClick={() => handleRemoveLecture(day, index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                {timetable[day].length === 0 && (
                  <p className="text-sm text-zinc-400">No lectures</p>
                )}
              </div>

              {isEditing && (
                <button
                  className="mt-3 px-3 py-2 bg-black text-white rounded-lg"
                  onClick={() => handleAddLecture(day)}
                >
                  + Add
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <button
          className="mt-6 px-5 py-2 bg-green-600 text-white rounded-lg"
          onClick={handleSave}
        >
          Save Timetable
        </button>
      )}
    </main>
  );
}