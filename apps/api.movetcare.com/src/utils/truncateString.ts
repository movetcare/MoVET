export const truncateString = (
  string: string,
  length: number = 170,
  ending: string = "...",
) =>
  string.length > length
    ? string.substring(0, length - ending.length) + ending
    : string;
