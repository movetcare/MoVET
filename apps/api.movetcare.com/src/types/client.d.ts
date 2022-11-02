export type NewClientPayload = {
  email: string;
  zip_code: string;
  password?: string;
  apiKey: string;
};

export type ClientType = {
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
};
