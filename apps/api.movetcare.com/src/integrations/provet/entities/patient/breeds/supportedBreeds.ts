// import {environment} from '../../../../../config/config';

import type { Breed } from "../../../../../types/breed";

// SOURCE: https://us.provetcloud.com/4285/organization/administration/lists/
export const supportedBreeds: Array<Breed> = [
  {
    name: "canine",
    listId: "17",
    // environment.type === 'production' ? '17' : '13',
  },
  {
    name: "feline",
    listId: "18",
    // environment.type === 'production' ? '18' : '12',
  },
];
