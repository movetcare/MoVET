import { createContext } from 'react';
import { Client } from 'types/Client';

export const ClientDataContext = createContext({
  client: {
    city: null,
    customer: null,
    email: null,
    firstName: null,
    lastName: null,
    phone: null,
    sendEmail: false,
    sendSms: false,
    state: null,
    street: null,
    zipcode: null,
  },
  loading: false,
  error: null,
} as Client | null);
