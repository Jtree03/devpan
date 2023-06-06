const SECONDS_IN_MS = 1000;
const MINUTES_IN_MS = SECONDS_IN_MS * 60;
const HOURS_IN_MS = MINUTES_IN_MS * 60;

export function timeSince(date: Date, now: Date = new Date()): string {
  const difference = now.getTime() - date.getTime();
  const elapsedHours = Math.floor(difference / HOURS_IN_MS);
  if (elapsedHours > 0) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  const elapsedMinutes = Math.floor(difference / MINUTES_IN_MS);
  if (elapsedMinutes > 0) {
    return elapsedMinutes + "분 전";
  }
  const elapsedSeconds = Math.floor(difference / SECONDS_IN_MS);
  return elapsedSeconds + "초 전";
}
