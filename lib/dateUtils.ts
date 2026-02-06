import moment from "moment";

export function formatDateDDMMYY(timestamp: number): string {
  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function formatDateDDMMYYHHMM(timestamp: number): string {
  const date = new Date(timestamp);
  const dateStr = formatDateDDMMYY(timestamp);
  const now = moment(date);
  const timeString = now.format('HH:mm'); 
  return `${dateStr} ${timeString}`;
}
