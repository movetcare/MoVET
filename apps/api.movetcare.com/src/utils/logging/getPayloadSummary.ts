import {proVetAppUrl, admin} from "../../config/config";
import {getProVetIdFromUrl} from "../getProVetIdFromUrl";

export const getPayloadSummary = async (payload: {
  tag: string;
  status: string | number;
  success: boolean;
  data:
    | {
        message: string;
        code: string | number;
        subject: string;
        to: string;
        email_address: string;
        email_subject: string;
        email_text: string;
        email: string;
        url: string;
        client: string;
        send_method: 1;
        status: number;
        device: {brand: string; modelName: string};
        id: string;
        type: string;
        data: {
          object: {
            object: string;
            client_reference_id: string;
            amount: number;
            amount_received: number;
            capture_method: string;
            metadata: {
              invoice: string;
            };
            payment_method_types: Array<string>;
            status: string;
            label: string;
            card: {
              brand: string;
              last4: number;
              exp_month: number;
              exp_year: number;
            };
            action: {
              failure_code: number | null;
              failure_message: string | null;
              process_payment_intent: {
                payment_intent: string;
              };
              status: string;
              type: string;
            };
          };
        };
      }
    | any;
}): Promise<string | null> => {
  let summary = ":question: . . . :question:";
  const {tag, data, success} = payload || {};
  if (tag === "create-admin")
    summary = `:health_worker: New user created: ${`\`\`\`${JSON.stringify(
      payload?.data
    )}\`\`\``}`;
  else if (tag === "new-internal-request")
    summary = `:interrobang: ${payload?.data.message}`;
  else if (tag === "login")
    summary = `:unlock: New Client Login: ${payload?.data.email}`;
  else if (tag === "reset-password")
    summary = `:key: Client Requested New Password Link: ${payload?.data.email}`;
  else if (tag === "create-admin-error")
    summary = `:health_worker: ADMIN AUTH USER ERROR :interrobang: ${`\`\`\`${JSON.stringify(
      payload?.data
    )}\`\`\``}`;
  else if (tag === "checkin") {
    summary = `:ballot_box_with_check: Appointment Check In Update ${
      data?.status ? ` - Status ${data?.status}` : ""
    } - ${data?.email ? data?.email : ""} ${
      data?.firstName ? data?.firstName : ""
    } ${data?.lastName ? data?.lastName : ""} `;
  } else if (tag === "provet-reminder") {
    if (data?.send_method === 1) {
      if (data?.status === 4)
        summary = `:interrobang: Reminder email w/ subject "${data?.email_subject}" FAILED to send to ${data?.email_address}`;
      else if (data?.status === 3)
        summary = `:alarm_clock: Reminder email w/ subject "${data?.email_subject}" sent to ${data?.email_address}`;
      else if (data?.status === 2)
        summary = `:alarm_clock: Reminder email w/ subject "${data?.email_subject}" is being sent to ${data?.email_address}`;
      else if (data?.status === 1)
        summary = `:alarm_clock: Reminder email w/ subject "${data?.email_subject}" for ${data?.email_address} has been added to the queue`;
      else if (data?.status === 0)
        summary = `:alarm_clock: Reminder email w/ subject "${data?.email_subject}" for ${data?.email_address} has been created`;
      summary += ` - ${
        proVetAppUrl + "/client/" + getProVetIdFromUrl(data?.client)
      }/tabs/?tab=reminders`;
    } else `:interrobang: UNSUPPORTED REMINDER UPDATED ${data?.url}`;
  } else if (tag === "provet-shifts") summary = `:calendar: ${data?.message}`;
  else if (
    tag === "notification" ||
    tag === "welcome" ||
    tag === "24-hour-appointment-notification-email" ||
    tag === "cancel-appointment" ||
    tag === "30-min-appointment-notification-email" ||
    tag === "24-hour-appointment-notification-email" ||
    tag === "1-hour-booking-abandonment-email" ||
    tag === "24-hour-booking-abandonment-email" ||
    tag === "72-hour-booking-abandonment-email" ||
    tag === "chat-log-email"
  )
    summary = `:envelope_with_arrow: SendGrid email w/ subject "${data?.subject}" sent to ${data?.to}`;
  else if (tag === "provet-email-sent")
    summary = `:e-mail: email w/ subject "${data?.subject}" sent to ${
      data?.email_address
    } - ${
      proVetAppUrl + "/client/" + getProVetIdFromUrl(data?.client)
    }/tabs/?tab=communication`;
  else if (tag === "create-client")
    summary = `:raised_hands: New client "${data?.email}" created${
      data?.device ? ` via ${data?.device?.brand} device` : ""
    } - ${await getClientUrl(data?.email)}`;
  else if (tag === "force-telehealth-chat-offline")
    summary = ":robot_face: Telehealth status changed to OFFLINE";
  else if (tag === "stripe-webhook") {
    if (data?.data?.object?.object === "terminal.reader") {
      summary = `:desktop_computer:  ${
        data?.data?.object?.label
      }: ${data?.type.toUpperCase()} - ${data?.data?.object?.action?.type}: ${
        data?.data?.object?.action?.status
      }`;
    } else if (data?.data?.object?.object === "payment_intent") {
      summary = `:moneybag: ${data?.type.toUpperCase()} $${
        data?.data?.object?.amount_received / 100
      } of $${data?.data?.object?.amount / 100} received via ${
        data?.data?.object?.payment_method_types[0]
      }`;
    } else if (data?.data?.object?.object === "payment_method") {
      summary = `:credit_card: ${data?.type.toUpperCase()} - ${data?.data?.object?.card?.brand.toUpperCase()} : ${
        data?.data?.object?.card?.exp_month
      }/${data?.data?.object?.card?.exp_year}`;
    } else if (data?.data?.object?.object === "checkout.session") {
      summary = `:shopping_trolley: ${data?.type.toUpperCase()} - ${data?.data?.object?.payment_method_types[0].toUpperCase()} - ${
        data?.data?.object?.client_reference_id
      }`;
    } else summary = `${payload?.tag}`;
    summary += ` - https://dashboard.stripe.com/events/${data?.id}`;
  } else if (tag === "provet-webhook") {
    summary = `${
      payload?.data?.client_id
        ? `:bust_in_silhouette: Client Update - ${
            proVetAppUrl + "/client/" + payload.data?.client_id
          }`
        : payload.data?.consultation_id
        ? `:speech_balloon: Consultation Update - ${
            proVetAppUrl + "/consultation/" + payload.data?.consultation_id
          }`
        : payload.data?.invoice_id
        ? `:credit_card: Invoice Update - ${
            proVetAppUrl + "/billing/invoice/" + payload.data?.invoice_id
          }`
        : payload.data?.appointment_id
        ? `:hospital: Appointment Update - ${
            proVetAppUrl + "/appointment/" + payload.data?.appointment_id
          }`
        : payload.data?.patient_id
        ? `:paw_prints: Patient Update - ${
            proVetAppUrl + "/patient/" + payload.data?.patient_id
          }`
        : payload.data?.laboratory_referral_id
        ? `:test_tube: Laboratory Referral Update - ${payload.data?.laboratory_referral_id}`
        : payload.data?.consultationitem_id
        ? `:pill: Consultation Item Update - ${payload.data?.consultationitem_id}`
        : payload.data?.reminder_id
        ? `:alarm_clock: Reminder Update - ${payload.data?.reminder_id} - ${proVetAppUrl}/reminder/list/`
        : payload.data?.email_log_id
        ? `:email: Email Update - ${payload.data?.email_log_id} ${proVetAppUrl}/organization/administration/log/email_log/`
        : payload.data?.user_id
        ? `:health_worker: User Update - ${payload.data?.user_id} - ${proVetAppUrl}/organization/administration/users/`
        : payload.data?.invoicerow_id
        ? `:money_with_wings: Invoice Row Update - ${payload.data?.invoicerow_id}`
        : payload.data?.invoicepayment_id
        ? `:moneybag: Invoice Payment Update - ${payload.data?.invoicepayment_id}`
        : payload.data?.organizationitem_id
        ? `:medical_symbol: Organization Item Update - ${payload.data?.organizationitem_id} - ${proVetAppUrl}/organization/administration/items/`
        : `:pencil: Update - ${
            payload?.data?.message || "```${JSON.stringify(payload?.data)}```"
          }`
    }`;
  } else if (
    tag === "24-hour-appointment-notification-sms" ||
    tag === "30-min-appointment-notification-sms" ||
    tag === "1-hour-booking-abandonment-sms" ||
    tag === "24-hour-booking-abandonment-sms" ||
    tag === "72-hour-booking-abandonment-sms"
  ) {
    summary = `:iphone: Twilio SMS sent to ${data.to}:\n\n${data.body}`;
  } else if (tag === "contact") {
    summary = `:information_source: New Contact Form Submission: ${data?.message.replace(
      /(<([^>]+)>)/gi,
      ""
    )}`;
  } else if (tag === "appointment-booking") {
    summary = `:book: ${data.message}`;
  } else if (
    tag === "delete-account" ||
    tag === "telehealth-chat" ||
    tag === "appointment_reminder" ||
    tag === "24-hour-appointment-notification-update" ||
    tag === "30-min-appointment-notification-update" ||
    tag === "create-new-account" ||
    tag === "customer-already-exists" ||
    tag === "create-new-customer" ||
    tag === "patient-photo-received" ||
    tag === "previous-clinical-history-received"
  ) {
    summary = data.message;
  } else
    summary = `${payload?.tag} ${`\`\`\`${JSON.stringify(
      payload?.data
    )}\`\`\``}`;

  if (
    !JSON.stringify(payload?.data).includes(
      // eslint-disable-next-line quotes
      "No such customer: 'cus_LYg1C7Et5ySQKC'"
    )
  )
    return `${success ? "" : ":interrobang: "} ${
      success ? ` ${summary} ` : summary
    }`;
  else return null;
};

const getClientUrl = async (email: string) =>
  await admin
    .firestore()
    .collection("clients")
    .where("email", "==", email)
    .limit(1)
    .get()
    .then((querySnapshot: any) =>
      querySnapshot.forEach(
        async (doc: any) =>
          `${proVetAppUrl}/${doc.data()?.id}/tabs/?tab=general`
      )
    );
