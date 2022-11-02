export declare type ContactForm = {
  reason: { id: string; name: string };
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  createdOn?: Date;
  updatedOn?: Date;
  source: ContactFormSources;
  status?: string;
};

export declare type ContactFormSources =
  | "movetcare.com"
  | "app.movetcare.com"
  | "belleviewstation.movetcare.com"
  | "ios"
  | "android";
