"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">
      <Link href="/">Home</Link>
      <Link href="/attendance">Attendance</Link>
      <Link href="/stats">Stats</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  );
}