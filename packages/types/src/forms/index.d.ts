export declare type ContactForm = {
  reason: { id: string; name: string };
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  createdOn?: Date;
  updatedOn?: Date;
  status?: string;
};
