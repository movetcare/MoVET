import { Store, registerInDevtools } from "pullstate";
import { Patient } from "./PatientsStore";

export interface Appointment {
  id: string;
  active: 0 | 1;
  client: number;
  createdOn: string;
  end: any;
  notes: string;
  patients: Array<Patient>;
  reason: string | { name: string; instructions: string };
  requestHash: string;
  resources: Array<number>;
  start: any;
  type: 1 | 2 | 3 | 4;
  instructions?: string;
  telemedicineUrl?: string;
  additionalNotes?: string;
  illnessDetails?: string;
  address?: string;
  locationType: "Home" | "Clinic" | "Virtually";
  user: {
    bio: string;
    name: string;
    picture: string;
    id: number;
  };
  additionalUsers: Array<{
    bio: string;
    name: string;
    picture: string;
    id: number;
  }>;
  confirmed: boolean;
  status:
    | "PENDING"
    | "IN-ROUTE"
    | "IN-PROGRESS"
    | "AWAITING-PAYMENT"
    | "COMPLETE"
    | undefined;
  consultation: number;
  invoice: number;
}



export const AppointmentsStore = new Store({
  upcomingAppointments: null as Appointment[] | null,
  pastAppointments: null as Appointment[] | null,
});

registerInDevtools({ AppointmentsStore });
