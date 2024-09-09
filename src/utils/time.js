import { NOTE_BY_DAY_KEY } from "@/constants";

export function getFormattedTime(time, format = "full") {
  const date = new Date(time);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  if (format === "short") {
    return `${hours}:${minutes}`;
  }

  const seconds = date.getSeconds().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() returns 0-11
  const year = date.getFullYear();

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function getNoteByDayKey(dateString) {
  const now = new Date();
  const inputDate = new Date(dateString);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  if (inputDate >= today) {
    return NOTE_BY_DAY_KEY.TODAY;
  } else if (inputDate >= yesterday) {
    return NOTE_BY_DAY_KEY.YESTERDAY;
  } else if (inputDate >= sevenDaysAgo) {
    return NOTE_BY_DAY_KEY.LAST_7_DAYS;
  } else {
    return NOTE_BY_DAY_KEY.LAST_30_DAYS;
  }
}
