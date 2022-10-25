export const addMinutesToDateObject = (date: Date = new Date(), minutes = 0) =>
  new Date(date.getTime() + minutes * 60000);
