/* eslint-disable @typescript-eslint/no-empty-interface */
declare module "starkbank-ecdsa";
declare module "format-json";
declare module "axios";
interface EmailConfiguration {
  to: string;
  from: "info@movetcare.com";
  bcc:
    | "support@movetcare.com"
    | "info@movetcare.com"
    | ["support@movetcare.com", "info@movetcare.com"];
  replyTo: "info@movetcare.com";
  subject: string;
  text: string;
  html: string;
}

interface AnnouncementBanner {
  color:
    | "#DAAA00"
    | "#2C3C72"
    | "#E76159"
    | "#232127"
    | "#00A36C"
    | "#A15643"
    | null;
  icon:
    | "exclamation-circle"
    | "bullhorn"
    | "bell"
    | "star"
    | "info-circle"
    | null;
  title: string | null;
  message: string | null;
  link: string | null;
  isActive: boolean;
  updatedOn: Date;
}
interface BookingError {
  error: true;
  message: string;
}

interface Booking {
  id: string;
  isActive: boolean;
  staffId?: string;
  isNewClient?: boolean;
  reasonGroup?: number;
  reasonType?: number;
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
    | "restart";
  location?: "home" | "clinic" | "virtual";
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
  illPatients?: Array<string>;
  illnessDetails?: {
    id: string;
    symptoms: Array<string>;
    notes: string;
  };
  nextPatient?: string | null;
  vcprRequired: boolean;
}

interface ProVetUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  created: string;
  lastLogin: Date | null;
  userdetails: string;
  isStaff: boolean;
  groups: Array<number>;
  title: string;
  phone: string;
  veterinarianId: string;
  activeDepartment: number;
  initials: string;
  userType: number;
  areasOfExpertise: string;
  qualifications: string;
  picture: string | null;
  prescriberId: string | null;
  employeeId: string | null;
  vdsNumber: string | null;
  allDepartmentsActive: boolean;
  activeDepartments: Array<number>;
  homeDepartment: number | null;
  isCabinetUser: boolean;
  userDetails: number;
  updatedOn: any;
}
interface NewClientPayload {
  email: string;
  zip_code: string;
  password?: string;
  apiKey: string;
}

interface EventLogPayload {
  tag:
    | "refresh"
    | "delete-account"
    | "error"
    | "login"
    | "reset-password"
    | "create-client"
    | "service-request"
    | "verify-account"
    | "create-patient"
    | "schedule-appointment"
    | "push"
    | "email"
    | "sms"
    | "payment"
    | "queue"
    | "provet-webhook"
    | "provet-api"
    | "provet-config"
    | "expo-webhook"
    | "stripe-webhook"
    | "stripe-api"
    | "contact"
    | "welcome"
    | "app-config"
    | "cancel-appointment"
    | "appointment-reminder"
    | "notification"
    | "create-admin";
  origin: "mobile" | "admin" | "provet" | "stripe" | "api" | "expo";
  success: boolean;
  data: any;
  sendToSlack?: boolean;
  apiKey?: string;
  ip?: string;
  headers?: any;
}

interface ClientType {
  location?: any;
  id?: number;
  email?: string;
  firstname?: string;
  lastname?: string;
  street_address?: string;
  city?: string;
  zip_code?: string;
  patients?: Array<string>;
  phone?: string;
  no_email?: boolean;
  no_sms?: boolean;
  sendEmail?: boolean;
  sendSms?: boolean;
  pushToken?: string;
  sendPush?: boolean;
  defaultLocation?: string;
  payment?: any;
  customer?: any;
  archived?: boolean;
}

interface PatientType {
  id?: string;
  client?: string;
  name?: string;
  breed?: string;
  species?: string;
  gender?: string;
  date_of_birth?: string;
  weight?: string;
  archived?: boolean;
}
interface BreedType {
  name: "canine" | "feline";
  listId: string;
}

interface ReasonGroup {
  id: number;
  department: number;
  name: string;
  archived?: boolean;
  updatedOn: any;
}

interface ReasonType {
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
  shiftTypes: Array<number>;
  dataExcludedFromCommunication: {
    hideAppointmentTime: boolean;
    hideVeterinarian: boolean;
  };
  preventReminders: boolean;
  preventConfirmations: boolean;
  updatedOn: any;
}

interface DepartmentType {
  id: number;
  name: string;
  active_item_list: string;
}

interface WebhookType {
  trigger: number;
  name: string;
  active: boolean;
  department: string | null;
}

interface AppointmentType {
  id: number;
  start: string;
  end: string;
  title: string;
  complaint: any;
  reason: string | null;
  instructions: string;
  user: string;
  additional_users: Array<string>;
  resources: Array<string>;
  client: string;
  patients: Array<string>;
  consultation: string | null;
  related_appointments: string | null;
  duration: number;
  notes: string;
  parent_appointment: string | null;
  child_appointments: Array<string>;
  active: number;
  department: string;
  ward: string | null;
  type: number;
  start_date: string;
  end_date: string;
  created: string;
  modified: string;
  created_user: string;
  modified_user: string;
  request_hash: string;
  telemedicine_url: string | null;
  telemedicine_url_master: string | null;
  telemedicine_room: string | null;
  cancellation_reason_text: string | null;
  cancellation_reason: string | null;
  no_show: boolean;
  client_notes: string | null;
  invoice_extras: string | null;
}

interface Item {
  id: number;
  code: string;
  barcode: string;
  accountNumber: null | number;
  name: string;
  printName: string;
  hideOnConsultation: boolean;
  price: number;
  priceWithVat: number;
  minimumPrice: null | number;
  minimumPriceWithVat: null | number;
  wholesalePrice: number;
  wholesalerDiscount: number;
  producerDiscount: number;
  specialDiscount: number;
  marginPercent: number;
  vatGroup: number;
  invoiceGroup: null | number;
  itemList: number;
  typeCode: number;
  polymorphicCtype: number;
  parent: null | string;
  parentAmount: number;
  instructions: null | string;
  archived: boolean;
  archivedDateTime: null | string;
  excludeDiscount: boolean;
  linkedItems: Array<number>;
  hideOnCounterSaleSearch: boolean;
  performedByRule: number;
  royaltyFee: null | string | number;
  created: string;
  modified: string;
  externalReportingCode: null | string;
  hideOnConsultationSearch: boolean;
}

interface Shift {
  id: number;
  start: Date;
  end: Date;
  user: number;
  department: number;
  ward: null | string;
  team: null | string;
  shiftType: number;
  web: boolean;
  note: string;
  isSlot: boolean;
}

interface ReminderType {
  department: string;
  reminder_template: string;
  patient: string;
  client: string;
  email_address: string;
  phone_number: string;
  email_subject: string;
  email_text: string;
  sms_text: string;
  post_text: string;
  text_manually: boolean;
  send_before: number;
  send_method: number;
  expiry_date: string;
  planned_sending_date: string;
  status: number;
  created_by: string;
  created: string;
  modified_by: null | string;
  modified: string;
  recurring_type: number;
  recurring_times: number;
  external_url: null | string;
}

interface Staff {
  areasOfExpertise: null | string;
  firstName: null | string;
  id: string;
  isActive: boolean;
  isStaff: boolean;
  lastName: null | string;
  picture: null | string;
  qualifications: null | string;
  title: null | string;
}
