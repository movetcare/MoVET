import {getProVetIdFromUrl} from "./../../utils/getProVetIdFromUrl";
import {
  admin,
  proVetApiUrl,
  request,
  throwError,
  DEBUG,
} from "../../config/config";

export const paymentIntentUpdated = async (event: any): Promise<void> => {
  const { object } = event?.data || {};
  const { id, status, amount, charges } = object || {};
  const { invoice } = object?.metadata || {};
  const clientId = await admin
    .firestore()
    .collection("counter_sales")
    .doc(`${invoice}`)
    .get()
    .then((doc: any) =>
      doc.data()?.client !== null
        ? getProVetIdFromUrl(doc.data()?.client)
        : false
    )
    .catch((error: any) => {
      console.log(error);
      return false;
    });
  if (event?.type === "payment_intent.succeeded" && invoice) {
    if (clientId === false)
      admin
        .firestore()
        .collection("counter_sales")
        .doc(`${invoice}`)
        .set(
          {
            paymentIntent: id,
            paymentStatus: status,
            paymentIntentObject: object,
            updatedOn: new Date(),
          },
          { merge: true }
        )
        .then(() =>
          request
            .post("/invoicepayment/", {
              invoice: proVetApiUrl + `/invoice/${invoice}/`,
              payment_type: 0,
              paid: amount / 100,
              status: 3,
              info: charges?.data[0]?.payment_method_details?.card
                ? `${charges?.data[0]?.payment_method_details?.card?.brand?.toUpperCase()} - ${
                    charges?.data[0]?.payment_method_details?.card?.last4
                  }`
                : charges?.data[0]?.payment_method_details?.card_present
                ? `${charges?.data[0]?.payment_method_details?.card_present?.brand?.toUpperCase()} - ${
                    charges?.data[0]?.payment_method_details?.card_present
                      ?.last4
                  }`
                : `UNKNOWN PAYMENT: ${id}`,
              created_user:
                proVetApiUrl +
                `/user/${
                  7
                  // environment?.type === 'production' ? '7' : '63'
                }/`,
            })
            .then((response: any) => {
              const { data } = response;
              if (DEBUG)
                console.log("API Response: POST /invoicepayment/ => ", data);
            })
            .catch((error: any) => throwError(error))
        )
        .catch((error: any) => console.error(error));
    else {
      const userId = await admin
        .firestore()
        .collection("client_invoices")
        .doc(`${invoice}`)
        .get()
        .then((doc: any) => getProVetIdFromUrl(doc.data()?.client))
        .catch((error: any) => console.error(error));
      if (userId)
        admin
          .firestore()
          .collection("client_invoices")
          .doc(`${invoice}`)
          .set(
            {
              paymentIntent: id,
              paymentStatus: status,
              paymentIntentObject: object,
              updatedOn: new Date(),
            },
            { merge: true }
          )
          .then(() =>
            request
              .post("/invoicepayment/", {
                invoice: proVetApiUrl + `/invoice/${invoice}/`,
                payment_type: 0,
                paid: amount / 100,
                status: 3,
                info: charges?.data[0]?.payment_method_details?.card
                  ? `${charges?.data[0]?.payment_method_details?.card?.brand?.toUpperCase()} - ${
                      charges?.data[0]?.payment_method_details?.card?.last4
                    }`
                  : charges?.data[0]?.payment_method_details?.card_present
                  ? `${charges?.data[0]?.payment_method_details?.card_present?.brand?.toUpperCase()} - ${
                      charges?.data[0]?.payment_method_details?.card_present
                        ?.last4
                    }`
                  : `UNKNOWN PAYMENT: ${id}`,
                created_user:
                  proVetApiUrl +
                  `/user/${
                    7
                    // environment?.type === 'production' ? '7' : '63'
                  }/`,
              })
              .then((response: any) => {
                const { data } = response;
                if (DEBUG)
                  console.log("API Response: POST /invoicepayment/ => ", data);
              })
              .then(() =>
                admin
                  .firestore()
                  .collection("clients")
                  .doc(`${userId}`)
                  .collection("invoices")
                  .doc(`${invoice}`)
                  .set(
                    {
                      paymentIntent: id,
                      paymentStatus: status,
                      paymentIntentObject: object,
                      updatedOn: new Date(),
                    },
                    { merge: true }
                  )
              )
              .then(async () => {
                //if (DEBUG) console.log('`${userId}`', `${userId}`);
                const user = await admin
                  .auth()
                  .getUser(`${userId}`)
                  .catch((error: any) => console.error(error));
                if (DEBUG) {
                  console.log("`${userId}`", `${userId}`);
                  console.log("`${user.email}`", `${user.email}`);
                }
                if (user) {
                  const clientIsOnWaitlist = await admin
                    .firestore()
                    .collection("waitlist")
                    .doc(user?.email)
                    .get()
                    .then((doc: any) => {
                      if (DEBUG)
                        console.log("clientIsOnWaitlist DATA", doc.data());
                      return true;
                    })
                    .catch((error: any) => {
                      console.error(error);
                      return false;
                    });
                  if (DEBUG)
                    console.log("`clientIsOnWaitlist`", clientIsOnWaitlist);
                  if (clientIsOnWaitlist) {
                    if (DEBUG)
                      console.log(
                        "ARCHIVING CLIENT FROM WAITLIST",
                        user?.email
                      );
                    admin
                      .firestore()
                      .collection("waitlist")
                      .doc(user?.email)
                      .set(
                        {
                          updatedOn: new Date(),
                          isActive: false,
                        },
                        { merge: true }
                      )
                      .catch((error: any) => console.error(error));
                  } else if (DEBUG)
                    console.log("CLIENT WAS NOT ON WAITLIST", user?.email);
                }
              })
              .catch((error: any) => throwError(error))
          )
          .catch((error: any) => console.error(error));
      else
        throwError(
          `FAILED TO CLOSE PROVET INVOICE - UNABLE TO LOCATE CLIENT ID ON INVOICE ${invoice}`
        );
    }
  }
};
