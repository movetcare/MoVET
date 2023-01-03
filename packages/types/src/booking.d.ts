import type { Staff } from "./staff";
export type BookingError = {
  error: true;
  message: string;
};

export type ClientBookingData = {
  displayName?: string;
  email?: string;
  phone?: string;
  requiresInfo: boolean;
  uid: string;
};

export type PatientBookingData = {
  id: string;
  name: string;
  archived?: boolean;
  vcprRequired?: boolean | null;
  aggressionStatus?: boolean | null;
  species: string;
  gender: string;
  breed: string;
  birthday: string;
  photo?: string | null;
  previousVet?: string | null;
  clientNote?: string | null;
  rabiesTag?: string | null;
  customFields?: Array<{
    field_id: number;
    id: number;
    label: string;
    value: string;
  }> | null;
};
export type AddAPet = {
  name: string;
  type: string;
  gender: string;
  spayedOrNeutered: boolean;
  aggressionStatus: string;
  breed: string;
  birthday: string;
  weight: string;
  vet?: string;
  notes?: string;
};

export type Booking = {
  checkoutSession?: string;
  client?: ClientBookingData;
  createdAt?: any;
  device?: string;
  establishCareExamRequired?: boolean;
  patients?: Array<PatientBookingData>;
  id: string;
  selectedPatients?: Array<string>;
  isActive?: boolean;
  staffId?: string;
  selectedStaff?: Staff;
  reasonGroup?: number;
  reasonType?: number;
  requestedDateTime?: { date: any; time: string };
  step?:
    | "started"
    | "contact-info"
    | "patient-selection"
    | "add-pet"
    | "wellness-check"
    | "illness-assignment"
    | "choose-location"
    | "choose-reason"
    | "choose-staff"
    | "choose-datetime"
    | "confirmation"
    | "cancelled-client"
    | "complete"
    | "restart";
  location?: "home" | "clinic" | "virtual";
  locationId?: number;
  address?: {
    full: string;
    info: string;
    parts: Array<string>;
    placeId: string;
    zipcode: string;
  };
  updatedOn?: any;
  newPatient?: {
    id: string;
    name: string;
    species: "canine" | "feline";
    breed: string;
    sex: "male" | "female";
    birthday: string;
    recordsUploaded: boolean | null;
    vcprRequired: boolean;
    hasMinorIllness: boolean;
  };
  reason?: { label: string; value: string };
  illPatientSelection?: Array<string>;
  nextPatient?: string | null;
  cancelComplete?: boolean;
  cancelReason?: string;
  cancelDetails?: string;
};
