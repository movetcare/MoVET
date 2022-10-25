import { validZipcodes } from "./validZipcodes";

export const isValidZipcode = (zipcode: string | null = null) => {
  if (zipcode === null) return false;
  for (let i = 0; i < validZipcodes.length; i++) {
    if (zipcode === validZipcodes[i].toString()) {
      return true;
    }
  }
  return false;
};
