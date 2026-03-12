import Link from "next/link";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900 p-6 pb-24">
      <h1 className="text-3xl font-bold mb-4 text-zinc-900">
        Attendance Tracker
      </h1>

      <p className="text-zinc-600 mb-6">
        Track your lectures and calculate safe bunks.
      </p>

      <Link
        href="/setup"
        className="inline-block bg-black text-white px-4 py-2 rounded"
      >
        Setup Timetable
      </Link>

      <Navbar />
    </main>
  );
}