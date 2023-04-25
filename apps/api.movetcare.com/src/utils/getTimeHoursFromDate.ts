export const getTimeHoursFromDate = (date: Date) =>
  `${date.getHours()}:${
    date.getMinutes() === 0
      ? "00"
      : date.getMinutes()?.toString().length === 1
      ? "0" + date.getMinutes()
      : date.getMinutes()
  }`;
