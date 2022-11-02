export type Reason = {
  id: number;
  group: number;
  name: string;
  duration: number;
  proficientStaff: Array<number>;
  availableOnline: boolean;
  instructions: string;
  availableFrom: string | null;
  availableTo: string | null;
  noMessages: boolean;
  noConfirmations: boolean;
  emailMessage: number;
  emailConfirmationText: string;
  emailReminderText: string;
  smsMessage: number;
  smsReminderText: string;
  smsConfirmationText: string;
  defaultItems: Array<number>;
  defaultClinicalNote: number | null;
  color: string;
  archived: boolean;
  telemedicine: boolean;
  species: Array<number>;
  shiftTypes: Array<number>;
  dataExcludedFromCommunication: {
    hideAppointmentTime: boolean;
    hideVeterinarian: boolean;
  };
  preventReminders: boolean;
  preventConfirmations: boolean;
  updatedOn: any;
};

export type ReasonGroup = {
  id: number;
  department: number;
  name: string;
  archived?: boolean;
  updatedOn: any;
};
