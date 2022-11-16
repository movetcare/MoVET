export type EmailConfiguration = {
  to: string;
  from?: "info@movetcare.com";
  bcc?:
    | "support@movetcare.com"
    | "info@movetcare.com"
    | ["support@movetcare.com", "info@movetcare.com"];
  replyTo?: "info@movetcare.com" | "lexi.abramson@movetcare.com";
  subject: string;
  message: string;
};
