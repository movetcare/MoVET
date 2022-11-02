export type EventLogPayload = {
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
};
