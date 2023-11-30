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
  reason: string;
  requestHash: string;
  resources: Array<number>;
  start: any;
  type: 1 | 2 | 3 | 4;
  user: number;
}

export const AppointmentsStore = new Store({
  upcomingAppointments: null as Appointment[] | null,
  pastAppointments: null as Appointment[] | null,
});

registerInDevtools({ AppointmentsStore });
