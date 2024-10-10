import { Store, registerInDevtools } from "pullstate";

export interface Invoice {
  updatedOn: any;
  amountDue: number;
  taxDue: number;
  totalDue: number;
  consultation: number;
  patients: Array<number>;
  remarks: string | null;
  status: 0 | 3 | 4 | 99; // 0 = draft, 3 = finalized, 4 = invoicing, 99 = voided
  paymentStatus:
    | "succeeded"
    | "pending"
    | "fully-refunded"
    | "partially-refunded"
    | "canceled"
    | "unknown"
    | null
    | undefined;
  paymentIntent: string | undefined;
  items: Array<{
    id: number;
    itemId: number;
    name: string;
    quantity: number;
    price: number;
    tax: number;
    total: number;
    patient: number;
  }>;
  id: number;
  payments: Array<{
    id: number;
    paid: number;
    paymentMethod: string;
    invoice: number;
  }>;
}

export const InvoicesStore = new Store({ invoices: null as Invoice[] | null });

registerInDevtools({ InvoicesStore });
