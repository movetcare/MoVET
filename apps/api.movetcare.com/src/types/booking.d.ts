import type { Staff } from "./staff";
export type BookingError = {
  error: true;
  message: string;
};

export type ClientInfo = {
  uid: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  requiresInfo: boolean;
};

export type PatientData = {
  id: string;
  name: string;
  archived?: boolean;
  vcprRequired: boolean;
  species: string;
  gender: string;
};

export type BookingResponse = {
  patients: Array<PatientData>;
  id: string;
  client: ClientInfo;
  selectedPatients?: Array<string>;
  establishCareExamRequired?: boolean;
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
  id: string;
  isActive: boolean;
  staffId?: string;
  selectedStaff?: Staff;
  isNewClient?: boolean;
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
  address?: {
    full: string;
    info: string;
    parts: Array<string>;
    placeId: string;
    zipcode: string;
  };
  datetime?: any;
  paymentMethodRequired?: boolean;
  checkoutUrl?: string;
  source?: "web" | "mobile";
  createdAt: any;
  updatedOn?: any;
  client: {
    uid: string;
    firstName: string;
    lastName: string;
    displayName: string;
    phone: string;
    email: string;
  };
  patients?:
    | [
        {
          id: string;
          name: string;
          species: "canine" | "feline";
          breed: string;
          sex: "male" | "female";
          birthday: string;
          recordsUploaded: boolean | null;
          vcprRequired: boolean;
        }
      ]
    | any;
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
  illPatients?: Array<string>;
  illnessDetails?: {
    id: string;
    symptoms: Array<string>;
    notes: string;
  };
  nextPatient?: string | null;
  vcprRequired?: boolean;
  cancelComplete?: boolean;
  cancelReason?: string;
  cancelDetails?: string;
};
