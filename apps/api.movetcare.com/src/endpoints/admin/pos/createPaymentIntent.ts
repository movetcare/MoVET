import { getProVetIdFromUrl } from "../../../utils/getProVetIdFromUrl";
import {
  throwError,
  defaultRuntimeOptions,
  functions,
  stripe,
  admin,
  request,
  //DEBUG,
} from "../../../config/config";
import { requestIsAuthorized } from "./requestIsAuthorized";
import { getCustomerId } from "../../../utils/getCustomerId";
const DEBUG = false;
export const createPaymentIntent = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      data: {
        mode: "counter" | "client";
        invoice: string;
        reader?: string;
        email?: string;
        paymentMethod?: string;
      },
      context: any,
    ): Promise<any> => {
      if (DEBUG) {
        console.log("createPaymentIntent context.app => ", context.app);
        console.log("createPaymentIntent context.auth => ", context.auth);
        console.log("createPaymentIntent DATA =>", data);
      }
      if (await requestIsAuthorized(context)) {
        const { mode, invoice, reader, paymentMethod } = data || {};
        if (mode && invoice) {
          const invoiceDetails = await admin
            .firestore()
            .collection(
              mode === "counter" ? "counter_sales" : "client_invoices",
            )
            .doc(`${invoice}`)
            .get()
            .then(async (document: any) => document.data())
            .catch((error: any) => throwError(error));
          if (DEBUG) console.log("invoiceDetails", invoiceDetails);
          // const displayParams = new URLSearchParams();
          // displayParams.append('type', 'cart');
          // displayParams.append(
          //   'cart[tax]',
          //   String(invoiceDetails?.total_vat * 100)
          // );
          // displayParams.append(
          //   'cart[total]',
          //   String(Math.floor(invoiceDetails?.client_due_sum * 100))
          // );
          // displayParams.append('cart[currency]', 'usd');
          // await admin
          //   .firestore()
          //   .collection(
          //     mode === 'counter' ? 'counter_sales' : 'client_invoices'
          //   )
          //   .doc(`${invoiceDetails?.id}`)
          //   .collection('items')
          //   .get()
          //   .then((snapshot: any) => {
          //     let shiftedIndex = 0;
          //     snapshot.docs.forEach((item: any, index: number) => {
          //       const {name, sum}: {name: string; sum: number} =
          //         item.data() || {};
          //       if (sum * 100 >= 1) {
          //         displayParams.append(
          //           `cart[line_items][${index - shiftedIndex}][description]`,
          //           name
          //         );
          //         displayParams.append(
          //           `cart[line_items][${index - shiftedIndex}][amount]`,
          //           String(Math.floor(sum * 100))
          //         );
          //         displayParams.append(
          //           `cart[line_items][${index - shiftedIndex}][quantity]`,
          //           '1'
          //         );
          //       } else {
          //         shiftedIndex++;
          //         if (DEBUG)
          //           console.log(
          //             `SKIPPING ITEM "${item?.name}" W/ AMOUNT = ${sum * 100}`
          //           );
          //       }
          //     });
          //   })
          //    .catch((error: any) => throwError(error));
          // if (reader)
          // await request
          //   .post(
          //     `https://api.stripe.com/v1/terminal/readers/${reader}/set_reader_display`,
          //     displayParams,
          //     {
          //       headers: {
          //         'Content-Type': 'application/x-www-form-urlencoded',
          //         'Stripe-Version':
          //           functions.config()?.stripe?.api_version,
          //         Authorization: `Bearer ${
          //           functions.config()?.stripe?.secret_key
          //         }`,
          //       },
          //     }
          //   )
          //   .then(async (response: any) => {
          //     const {data} = response;
          //     if (DEBUG)
          //       console.log(
          //         `RESPONSE: https://api.stripe.com/v1/terminal/readers/${reader}/set_reader_display =>`,
          //         data
          //       );
          //     await admin
          //       .firestore()
          //       .collection('configuration')
          //       .doc('pos')
          //       .collection('terminals')
          //       .doc(`${reader}`)
          //       .set(
          //         {
          //           display: data.action,
          //           updatedOn: new Date(),
          //         },
          //         {merge: true}
          //       )
          //       .then(() => true)
          //        .catch((error: any) => throwError(error));
          //   })
          //    .catch((error: any) => throwError(error));
          const paymentIntentConfig: any = {
            currency: "usd",
            metadata: { invoice },
          };
          if (DEBUG) {
            console.log(
              "client_due_sum * 100: ",
              invoiceDetails?.client_due_sum * 100,
            );
            console.log(
              "Math.floor(invoiceDetails?.client_due_sum * 100): ",
              Math.floor(invoiceDetails?.client_due_sum * 100),
            );
          }
          paymentIntentConfig.amount = Math.floor(
            invoiceDetails?.client_due_sum * 100,
          );
          paymentIntentConfig.payment_method_types = ["card_present"];
          paymentIntentConfig.capture_method = "manual";
          if (mode === "client" && invoiceDetails?.client) {
            if (paymentMethod) {
              paymentIntentConfig.payment_method = paymentMethod;
              paymentIntentConfig.capture_method = "automatic";
              paymentIntentConfig.payment_method_types = ["card"];
              paymentIntentConfig.confirm = true;
              paymentIntentConfig.off_session = true;
              paymentIntentConfig.customer = await getCustomerId(
                `${getProVetIdFromUrl(invoiceDetails?.client)}`,
              );
            } else {
              paymentIntentConfig.off_session = false;
              paymentIntentConfig.setup_future_usage = "off_session";
            }
          } else if (DEBUG)
            console.log(`COUNTER SALE DETECTED -> ${JSON.stringify(data)}`);
          if (DEBUG) console.log("paymentIntentConfig", paymentIntentConfig);
          const paymentIntent: any =
            await stripe.paymentIntents.create(paymentIntentConfig);
          if (DEBUG) console.log("paymentIntent", paymentIntent);
          const params = new URLSearchParams();
          params.append("payment_intent", paymentIntent?.id);
          return reader
            ? await request
                .post(
                  `https://api.stripe.com/v1/terminal/readers/${reader}/process_payment_intent`,
                  params,
                  {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                      "Stripe-Version": functions.config()?.stripe?.api_version,
                      Authorization: `Bearer ${functions.config()?.stripe
                        ?.secret_key}`,
                    },
                  },
                )
                .then(async (response: any) => {
                  const { data } = response;
                  if (DEBUG)
                    console.log(
                      `RESPONSE: https://api.stripe.com/v1/terminal/readers/${reader}/process_payment_intent =>`,
                      data,
                    );
                  await admin
                    .firestore()
                    .collection("configuration")
                    .doc("pos")
                    .collection("terminals")
                    .doc(`${data?.id}`)
                    .set(
                      {
                        ...data,
                        updatedOn: new Date(),
                      },
                      { merge: true },
                    )
                    .then(() => true)
                    .catch((error: any) => throwError(error));
                  await admin
                    .firestore()
                    .collection(
                      mode === "counter" ? "counter_sales" : "client_invoices",
                    )
                    .doc(`${invoice}`)
                    .set(
                      {
                        paymentIntent: paymentIntent?.id,
                        paymentIntentObject: paymentIntent,
                        paymentStatus: data?.action?.status || "unknown",
                        failureCode: data?.action?.failure_code,
                        failureMessage: data?.action?.failure_message,
                        updatedOn: new Date(),
                      },
                      { merge: true },
                    )
                    .then(async () =>
                      mode === "client"
                        ? await admin
                            .firestore()
                            .collection("clients")
                            .doc(
                              `${getProVetIdFromUrl(invoiceDetails?.client)}`,
                            )
                            .collection("invoices")
                            .doc(`${invoiceDetails?.id}`)
                            .set(
                              {
                                paymentIntent: paymentIntent?.id,
                                paymentIntentObject: paymentIntent,
                                paymentStatus:
                                  paymentIntent.status || "unknown",
                                failureCode: data?.action?.failure_code,
                                failureMessage: data?.action?.failure_message,
                                updatedOn: new Date(),
                              },
                              { merge: true },
                            )
                            .catch((error: any) => throwError(error))
                        : null,
                    )
                    .catch((error: any) => throwError(error));
                  return data?.action || null;
                })
                .catch((error: any) => throwError(error))
            : await admin
                .firestore()
                .collection(
                  mode === "counter" ? "counter_sales" : "client_invoices",
                )
                .doc(`${invoice}`)
                .set(
                  {
                    paymentStatus: paymentIntent?.status || "unknown",
                    paymentIntent: paymentIntent?.id,
                    paymentIntentObject: paymentIntent,
                    updatedOn: new Date(),
                  },
                  { merge: true },
                )
                .then(async () =>
                  mode === "client"
                    ? await admin
                        .firestore()
                        .collection("clients")
                        .doc(`${getProVetIdFromUrl(invoiceDetails?.client)}`)
                        .collection("invoices")
                        .doc(`${invoiceDetails?.id}`)
                        .set(
                          {
                            paymentIntent: paymentIntent?.id,
                            paymentIntentObject: paymentIntent,
                            updatedOn: new Date(),
                          },
                          { merge: true },
                        )
                        .then(() => true)
                        .catch((error: any) => throwError(error))
                    : null,
                )
                .then(() => true)
                .catch((error: any) => throwError(error));
        } else
          return throwError(
            `UNABLE TO CREATE PAYMENT INTENT -> ${JSON.stringify(data)}`,
          );
      }
    },
  );
