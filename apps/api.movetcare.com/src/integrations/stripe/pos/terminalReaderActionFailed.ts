import { admin, stripe, throwError, DEBUG } from "../../../config/config";

export const terminalReaderActionFailed = (event: any): void => {
  if (DEBUG)
    console.log("terminalReaderActionFailed EVENT:", event?.data?.action);
  admin
    .firestore()
    .collection("configuration")
    .doc("pos")
    .collection("terminals")
    .doc(`${event?.data?.object?.id}`)
    .set(
      {
        ...event?.data?.object,
        display: null,
        updatedOn: new Date(),
      },
      { merge: true }
    )
    .then(() => true)
    .catch((error: any) => throwError(error));
  admin
    .firestore()
    .collection("counter_sales")
    .where(
      "paymentIntent",
      "==",
      event?.data?.object?.action?.process_payment_intent?.payment_intent
    )
    .limit(1)
    .get()
    .then((querySnapshot: any) => {
      if (DEBUG)
        console.log("querySnapshot?.docs?.length", querySnapshot?.docs?.length);
      if (querySnapshot?.docs?.length > 0)
        querySnapshot.forEach(async (doc: any) => {
          const paymentIntent: any = await stripe.paymentIntents.retrieve(
            event?.data?.object?.action?.process_payment_intent?.payment_intent
          );
          if (DEBUG) {
            console.log(doc.id, " => ", doc.data());
            console.log("paymentIntent", paymentIntent);
          }
          const canceledPaymentIntent = await stripe.paymentIntents.cancel(
            event?.data?.object?.action?.process_payment_intent?.payment_intent
          );
          if (DEBUG)
            console.log("canceledPaymentIntent", canceledPaymentIntent);
          admin
            .firestore()
            .collection("counter_sales")
            .doc(doc.id)
            .collection("failed_payments")
            .doc(paymentIntent?.id)
            .set(
              {
                ...canceledPaymentIntent,
                updatedOn: new Date(),
              },
              { merge: true }
            )
            .catch((error: any) => throwError(error));
          admin
            .firestore()
            .collection("counter_sales")
            .doc(doc.id)
            .set(
              {
                paymentStatus: event?.data?.object?.action?.status,
                paymentIntentObject: paymentIntent,
                failureCode: paymentIntent?.charges?.data[0]?.failure_code,
                failureMessage:
                  paymentIntent?.charges?.data[0]?.failure_message,
                updatedOn: new Date(),
              },
              { merge: true }
            )
            .catch((error: any) => throwError(error));
        });
      else
        admin
          .firestore()
          .collection("client_invoices")
          .where(
            "paymentIntent",
            "==",
            event?.data?.object?.action?.process_payment_intent?.payment_intent
          )
          .limit(1)
          .get()
          .then(async (querySnapshot: any) => {
            if (DEBUG)
              console.log(
                "querySnapshot?.docs?.length",
                querySnapshot?.docs?.length
              );
            if (querySnapshot?.docs?.length > 0)
              querySnapshot.forEach(async (doc: any) => {
                const paymentIntent: any = await stripe.paymentIntents.retrieve(
                  event?.data?.object?.action?.process_payment_intent
                    ?.payment_intent
                );
                if (DEBUG) {
                  console.log(doc.id, " => ", doc.data());
                  console.log("paymentIntent", paymentIntent);
                }
                const canceledPaymentIntent =
                  await stripe.paymentIntents.cancel(
                    event?.data?.object?.action?.process_payment_intent
                      ?.payment_intent
                  );
                if (DEBUG)
                  console.log("canceledPaymentIntent", canceledPaymentIntent);
                admin
                  .firestore()
                  .collection("client_invoices")
                  .doc(doc.id)
                  .collection("failed_payments")
                  .doc(paymentIntent?.id)
                  .set(
                    {
                      ...canceledPaymentIntent,
                      updatedOn: new Date(),
                    },
                    { merge: true }
                  )
                  .catch((error: any) => throwError(error));
                admin
                  .firestore()
                  .collection("client_invoices")
                  .doc(doc.id)
                  .set(
                    {
                      paymentStatus: event?.data?.object?.action?.status,
                      paymentIntentObject: paymentIntent,
                      failureCode:
                        paymentIntent?.charges?.data[0]?.failure_code,
                      failureMessage:
                        paymentIntent?.charges?.data[0]?.failure_message,
                      updatedOn: new Date(),
                    },
                    { merge: true }
                  )
                  .catch((error: any) => throwError(error));
              });
            else
              throwError({
                message: "FAILED TO UPDATE FAILED INVOICE PAYMENT",
                paymentIntent:
                  event?.data?.object?.action?.process_payment_intent
                    ?.payment_intent,
              });
          })
          .catch((error: any) => throwError(error));
    })
    .catch((error: any) => throwError(error));
};
