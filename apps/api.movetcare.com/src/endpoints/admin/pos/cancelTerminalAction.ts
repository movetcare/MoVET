import {
  admin,
  stripe,
  DEBUG,
  defaultRuntimeOptions,
  functions,
  request,
  throwError,
} from "../../../config/config";
import {requestIsAuthorized} from "./requestIsAuthorized";

export const cancelTerminalAction = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      data: {reader: string; paymentIntent: string},
      context: any
    ): Promise<any> => {
      if (DEBUG) {
        console.log("cancelTerminalAction context.app => ", context.app);
        console.log("cancelTerminalAction context.auth => ", context.auth);
        console.log("cancelTerminalAction DATA => ", data);
      }
      const isAuthorized = await requestIsAuthorized(context);
      if (isAuthorized) {
        return await request
          .post(
            `https://api.stripe.com/v1/terminal/readers/${data?.reader}/cancel_action`,
            {},
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Stripe-Version": functions.config()?.stripe?.api_version,
                Authorization: `Bearer ${
                  functions.config()?.stripe?.secret_key
                }`,
              },
            }
          )
          .then(async (result: any) => {
            if (DEBUG) {
              console.log("result", result.data);
              console.log("data.paymentIntent", data.paymentIntent);
            }
            if (data.paymentIntent) {
              const canceledPaymentIntent = await stripe.paymentIntents.cancel(
                data?.paymentIntent
              );
              if (DEBUG)
                console.log("canceledPaymentIntent", canceledPaymentIntent);
              await admin
                .firestore()
                .collection("counter_sales")
                .where("paymentIntent", "==", data?.paymentIntent)
                .limit(1)
                .get()
                .then(async (querySnapshot: any) => {
                  if (DEBUG)
                    console.log(
                      "counter_sales querySnapshot?.docs?.length",
                      querySnapshot?.docs?.length
                    );
                  if (querySnapshot?.docs?.length > 0)
                    querySnapshot.forEach(async (doc: any) => {
                      await admin
                        .firestore()
                        .collection("counter_sales")
                        .doc(doc.id)
                        .collection("canceled_payments")
                        .doc(canceledPaymentIntent?.id)
                        .set(
                          {
                            ...canceledPaymentIntent,
                            updatedOn: new Date(),
                          },
                          { merge: true }
                        )
                        .catch(async (error: any) => await throwError(error));
                      await admin
                        .firestore()
                        .collection("counter_sales")
                        .doc(doc.id)
                        .set(
                          {
                            paymentStatus: "canceled",
                            paymentIntentObject: canceledPaymentIntent,
                            updatedOn: new Date(),
                          },
                          { merge: true }
                        )
                        .catch(async (error: any) => await throwError(error));
                    });
                  else
                    await admin
                      .firestore()
                      .collection("client_invoices")
                      .where("paymentIntent", "==", data?.paymentIntent)
                      .limit(1)
                      .get()
                      .then(async (querySnapshot: any) => {
                        if (DEBUG)
                          console.log(
                            "client_invoices querySnapshot?.docs?.length",
                            querySnapshot?.docs?.length
                          );
                        if (querySnapshot?.docs?.length > 0)
                          querySnapshot.forEach(async (doc: any) => {
                            await admin
                              .firestore()
                              .collection("client_invoices")
                              .doc(doc.id)
                              .collection("canceled_payments")
                              .doc(canceledPaymentIntent?.id)
                              .set(
                                {
                                  ...canceledPaymentIntent,
                                  updatedOn: new Date(),
                                },
                                { merge: true }
                              )
                              .catch(
                                async (error: any) => await throwError(error)
                              );
                            await admin
                              .firestore()
                              .collection("client_invoices")
                              .doc(doc.id)
                              .set(
                                {
                                  paymentStatus: "canceled",
                                  paymentIntentObject: canceledPaymentIntent,
                                  updatedOn: new Date(),
                                },
                                { merge: true }
                              )
                              .catch(
                                async (error: any) => await throwError(error)
                              );
                          });
                        else
                          await throwError({
                            message: "FAILED TO UPDATE FAILED INVOICE PAYMENT",
                            paymentIntent: data?.paymentIntent,
                          });
                      })
                      .catch(async (error: any) => await throwError(error));
                })
                .catch(async (error: any) => await throwError(error));
            }
            return await admin
              .firestore()
              .collection("configuration")
              .doc("pos")
              .collection("terminals")
              .doc(`${data?.reader}`)
              .set(
                {
                  ...result?.data,
                  display: null,
                  updatedOn: new Date(),
                },
                { merge: true }
              )
              .then(() => true)
              .catch(async (error: any) => await throwError(error));
          })
          .catch(async (error: any) => await throwError(error));
      }
    }
  );
