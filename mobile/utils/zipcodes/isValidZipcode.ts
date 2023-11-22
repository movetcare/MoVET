import {validZipcodes} from 'utils/zipcodes/validZipcodes';

export const isValidZipcode = (zipcode: string) => {
  for (let i = 0; i < validZipcodes.length; i++) {
    if (zipcode === validZipcodes[i].toString()) {
      return true;
    }
  }
  return false;
};
