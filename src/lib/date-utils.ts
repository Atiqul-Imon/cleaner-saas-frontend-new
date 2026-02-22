/** Get today's date in YYYY-MM-DD for date inputs */
export function getTodayDateInput(): string {
  const today = new Date();
  return formatDateInput(today);
}

/** Get tomorrow's date in YYYY-MM-DD */
export function getTomorrowDateInput(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatDateInput(d);
}

/** Get next week's date in YYYY-MM-DD */
export function getNextWeekDateInput(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return formatDateInput(d);
}

function formatDateInput(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
