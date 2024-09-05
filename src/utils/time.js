export function getFormattedTime(time, format = "full") {
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  if (format === "short") {
    return `${hours}:${minutes}`;
  }

  const seconds = time.getSeconds().toString().padStart(2, "0");
  const day = time.getDate().toString().padStart(2, "0");
  const month = (time.getMonth() + 1).toString().padStart(2, "0"); // getMonth() returns 0-11
  const year = time.getFullYear();

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
