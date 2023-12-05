import { Store, registerInDevtools } from "pullstate";

export interface Patient {
  archived: boolean;
  birthday: string;
  breed: string;
  breedId: number;
  client: number;
  createdOn: any;
  customFields: Array<{
    field_id: number;
    id: number;
    label: string;
    value: string;
  }>;
  gender: string;
  id: number;
  name: string;
  picture?: string | null;
  species: string;
  vcprRequired: boolean;
  weight: number;
  photoUrl?: string;
}

export const PatientsStore = new Store({patients: null as Patient[] | null});

registerInDevtools({ PatientsStore });
