import { admin, stripe, throwError, DEBUG } from "../../../config/config";

export const terminalReaderActionSucceeded = (event: any): void => {
  if (DEBUG) console.log("terminalReaderActionSucceeded EVENT => ", event);
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
          let didCapturePayment: any = null;
          if (paymentIntent?.status === "requires_capture") {
            didCapturePayment = await stripe.paymentIntents
              .capture(
                event?.data?.object?.action?.process_payment_intent
                  ?.payment_intent
              )
              .catch((error: any) => throwError(error));
          }
          if (DEBUG) console.log("didCapturePayment", didCapturePayment);
          // await admin
          //   .firestore()
          //   .collection('counter_sales')
          //   .doc(doc.id)
          //   .set(
          //     {
          //       paymentStatus: !didCapturePayment
          //         ? event?.data?.object?.action?.status
          //         : didCapturePayment?.status,
          //       paymentIntentObject: !didCapturePayment
          //         ? paymentIntent
          //         : didCapturePayment,
          //       updatedOn: new Date(),
          //     },
          //     {merge: true}
          //   )
          // .then(
          //   async () =>
          //     await request
          //       .post('/invoicepayment/', {
          //         invoice: doc.data()?.url,
          //         payment_type: 0,
          //         paid: paymentIntent?.amount / 100,
          //         status: 3,
          //         info: !didCapturePayment
          //           ? `${paymentIntent?.charges?.data[0]?.card_present?.brand.toUpperCase()} - ${
          //               paymentIntent?.charges?.data[0]?.card_present?.last4
          //             }`
          //           : `${didCapturePayment?.charges?.data[0]?.card_present?.brand.toUpperCase()} - ${
          //               didCapturePayment?.charges?.data[0]?.card_present
          //                 ?.last4
          //             }`,
          //         created_user:
          //           proVetApiUrl +
          //           `/user/${
          //             7
          //             // environment?.type === 'production' ? '7' : '63'
          //           }/`,
          //       })
          //       .then((response: any) => {
          //         const {data} = response;
          //         if (DEBUG)
          //           console.log(
          //             'API Response: POST /invoicepayment/ => ',
          //             data
          //           );
          //       })
          //       .catch(
          //         async (error: any) =>
          //           (throwError(error)) &&
          //           console.error('error.response.data', error.response.data)
          //       )
          // )
          //  .catch((error: any) => throwError(error));
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
          .then((querySnapshot: any) => {
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
                let didCapturePayment: any = null;
                if (paymentIntent?.status === "requires_capture") {
                  didCapturePayment = await stripe.paymentIntents
                    .capture(
                      event?.data?.object?.action?.process_payment_intent
                        ?.payment_intent
                    )
                    .catch((error: any) => throwError(error));
                }
                if (DEBUG) console.log("didCapturePayment", didCapturePayment);
                // await admin
                //   .firestore()
                //   .collection('client_invoices')
                //   .doc(doc.id)
                //   .set(
                //     {
                //       paymentStatus: !didCapturePayment
                //         ? event?.data?.object?.action?.status
                //         : didCapturePayment?.status,
                //       paymentIntentObject: !didCapturePayment
                //         ? paymentIntent
                //         : didCapturePayment,
                //       updatedOn: new Date(),
                //     },
                //     {merge: true}
                //   );
                // .then(
                //   async () =>
                //     await request
                //       .post('/invoicepayment/', {
                //         invoice: doc.data()?.url,
                //         payment_type: 0,
                //         paid: paymentIntent?.amount / 100,
                //         status: 3,
                //         info: !didCapturePayment
                //           ? `${paymentIntent?.charges?.data[0]?.card_present?.brand.toUpperCase()} - ${
                //               paymentIntent?.charges?.data[0]?.card_present
                //                 ?.last4
                //             }`
                //           : `${didCapturePayment?.charges?.data[0]?.card_present?.brand.toUpperCase()} - ${
                //               didCapturePayment?.charges?.data[0]
                //                 ?.card_present?.last4
                //             }`,
                //         created_user:
                //           proVetApiUrl +
                //           `/user/${
                //             7
                //             // environment?.type === 'production' ? '7' : '63'
                //           }/`,
                //       })
                //       .then((response: any) => {
                //         const {data} = response;
                //         if (DEBUG)
                //           console.log(
                //             'API Response: POST /invoicepayment/ => ',
                //             data
                //           );
                //       })
                //       .catch(
                //         async (error: any) =>
                //           (throwError(error)) &&
                //           console.error(
                //             'error.response.data',
                //             error.response.data
                //           )
                //       )
                // )
                //  .catch((error: any) => throwError(error));
              });
            else
              throwError({
                message: `FAILED TO COMPLETE TRANSACTION => ${event?.data?.object?.action?.process_payment_intent?.payment_intent}`,
              });
          })
          .catch((error: any) => throwError(error));
    })
    .catch((error: any) => throwError(error));
};
