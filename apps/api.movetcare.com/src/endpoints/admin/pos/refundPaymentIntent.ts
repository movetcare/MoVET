import {
  throwError,
  defaultRuntimeOptions,
  functions,
  stripe,
  admin,
  DEBUG,
} from "../../../config/config";
import { requestIsAuthorized } from "../../../utils/requestIsAuthorized";

export const refundPaymentIntent = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      data: {
        paymentIntent: string;
        invoice: string;
        mode: "client" | "counter";
      },
      context: any,
    ): Promise<any> => {
      if (DEBUG) console.log("refundPaymentIntent DATA =>", data);
      const isAuthorized = await requestIsAuthorized(context);
      if (isAuthorized) {
        const refund: any = await stripe.refunds
          .create({
            payment_intent: data?.paymentIntent,
          })
          .catch((error: any) => throwError(error));
        if (DEBUG) console.log("refund", refund);
        if (refund) {
          await admin
            .firestore()
            .collection(
              data?.mode === "client" ? "client_invoices" : "counter_sales",
            )
            .doc(`${data?.invoice}`)
            .collection("refunds")
            .doc(refund?.id)
            .set(
              {
                ...refund,
                updatedOn: new Date(),
              },
              { merge: true },
            )
            .catch((error: any) => throwError(error));
          if (refund?.status === "succeeded")
            return await admin
              .firestore()
              .collection(
                data?.mode === "client" ? "client_invoices" : "counter_sales",
              )
              .doc(`${data?.invoice}`)
              .set(
                {
                  paymentStatus: "partially-refunded",
                  updatedOn: new Date(),
                },
                { merge: true },
              )
              .then(async () => true)
              .catch((error: any) => throwError(error));
          else return false;
        }
      } else return false;
    },
  );
