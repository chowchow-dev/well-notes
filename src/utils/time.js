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
