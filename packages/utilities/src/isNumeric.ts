export const isNumeric = (string: string) => {
  if (typeof string != "string") return false;
  return !isNaN(string as any) && !isNaN(parseFloat(string));
};
