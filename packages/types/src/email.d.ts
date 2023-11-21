export type EmailConfiguration = {
  to: string;
  from?: "info@movetcare.com";
  bcc?:
    | "alex.rodriguez@movetcare.com"
    | "support@movetcare.com"
    | "info@movetcare.com"
    | ["support@movetcare.com", "info@movetcare.com"]
    | ["alex.rodriguez@movetcare.com", "info@movetcare.com"]
    | ["info@movetcare.com", "alex.rodriguez@movetcare.com"];
  replyTo?: "info@movetcare.com" | "lexi.abramson@movetcare.com";
  subject: string;
  message: string;
};
