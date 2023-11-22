import {coloradoZipcodes} from 'utils/zipcodes/coloradoZipcodes';

export const isColoradoZipcode = (zipcode: string) => {
  for (let i = 0; i < coloradoZipcodes.length; i++) {
    if (zipcode === coloradoZipcodes[i].toString()) {
      return true;
    }
  }
  return false;
};
