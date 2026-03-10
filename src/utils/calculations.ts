export function calculateAttendance(attended: number, total: number) {
  if (total === 0) return 0;

  return Math.round((attended / total) * 100);
}

export function calculateSafeBunks(
  attended: number,
  total: number,
  minimum = 0.75
) {
  const safe = Math.floor(attended / minimum - total);

  return Math.max(0, safe);
}