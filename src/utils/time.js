export const transformFromStringToDate = (dateString) => {
  const [date, time] = dateString.split(" ");
  const [day, month, year] = date.split("-").map(Number);
  const [hours, minutes, seconds] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, seconds);
};

// formats for moment.js formatting
export const noZone = "DD-MM-YYYY HH:mm:ss";
export const onCreate_created_at = "DD.MM.YYYY, HH:mm:ss";
export const onCreate_deadline_at = "YYYY-MM-DDTHH:mm:ssZ";
export const onCreate_deadline_at_noZone = "YYYY-MM-DDTHH:mm:ss";
export const onTimeRange = "YYYY-MM-DDTHH:MM:00"

