import {
  functions,
  defaultRuntimeOptions,
  DEBUG,
  throwError,
} from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";

export const manualClientRequest = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (DEBUG) {
      console.log("manualClientRequest data => ", data);
      console.log("manualClientRequest context.auth => ", context.auth);
    }
    if (!context.auth) return throwError({ message: "MISSING AUTHENTICATION" });
    else {
      if (DEBUG) console.log("CONTEXT UID => ", context.auth.uid);
      if (data?.invoice) {
        sendNotification({
          type: "email",
          payload: {
            to: "info@movetcare.com",
            replyTo: context.auth.token?.email,
            subject:
              `EMAIL INVOICE #${data.invoice} AS PFD REQUEST FROM ` +
              (context.auth.token?.name
                ? context.auth.token?.name?.toUpperCase()
                : context.auth.token?.email?.toUpperCase()) +
              ` (#${context.auth.uid})`,
            message: `<p>${
              (context.auth.token?.name
                ? context.auth.token?.name
                : context.auth.token?.email) + ` (#${context.auth.uid})`
            } is requesting invoice #${data.invoice} be emailed to them as a PDF (via ProVet)</p><p></p><p><a href="https://us.provetcloud.com/4285/billing/invoice_finished/${data.invoice}/">Click here to send them the Invoice...</a></p>`,
          },
        });
        sendNotification({
          type: "push",
          payload: {
            category: "admin",
            title:
              `EMAIL INVOICE #${data.invoice} AS PFD REQUEST FROM ` +
              (context.auth.token?.name
                ? context.auth.token?.name?.toUpperCase()
                : context.auth.token?.email?.toUpperCase()) +
              ` (#${context.auth.uid})`,
            message: `<a href="https://us.provetcloud.com/4285/billing/invoice_finished/${data.invoice}/">Click here to send them the Invoice...</a>`,
            path: `/billing/invoice/?id=${context.auth.uid}`,
          },
        });
      }
      return true;
    }
  });
