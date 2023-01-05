import { Staff } from "./Staff";

export interface Booking {
  id: string;
  isActive: boolean;
  staffId?: string;
  isNewClient?: boolean;
  reasonGroup?: number;
  reasonType?: number;
  step?:
    | "started"
    | "contact-info"
    | "pet-selection"
    | "add-a-pet"
    | "wellness-check"
    | "illness-selection"
    | "location-selection"
    | "reason-selection"
    | "staff-selection"
    | "datetime-selection"
    | "payment-confirmation"
    | "checkout"
    | "confirmation"
    | "needs-scheduling"
    | "complete"
    | "restart";
  staff: Array<Staff>;
  location?: "Home" | "Clinic" | "Virtual";
  locationId: number;
  datetime?: Date;
  paymentMethodRequired?: boolean;
  checkoutUrl?: string;
  source?: "web" | "mobile";
  createdAt: Date;
  updatedOn?: Date;
  client: {
    uid: string;
    displayName: string;
    phoneNumber: string;
    email: string;
  };
  patients?: [
    {
      id: string;
      name: string;
      species: "canine" | "feline";
      breed: string;
      sex: "male" | "female";
      birthday: string;
      recordsUploaded: boolean | null;
      vcprRequired: boolean;
      hasMinorIllness: boolean;
    }
  ];
  checkout?: any;
  illPatients?: Array<string>;
  illnessDetails?: {
    id: string;
    symptoms: Array<string>;
    notes: string;
  };
  nextPatient?: string | null;
  vcprRequired: boolean;
}
