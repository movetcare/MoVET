const padTo2Digits = (num: number) => num.toString().padStart(2, "0");

export const formatDateToMMDDYY = (date: Date) =>
  [
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    date.getFullYear(),
  ].join("/");
