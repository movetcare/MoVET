export const addMinutesToDate = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * 60000);
