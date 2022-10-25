import {getProVetIdFromUrl} from "./../../utils/getProVetIdFromUrl";
import {admin, proVetApiUrl, request, throwError} from "../../config/config";
const DEBUG = false;
export const paymentIntentUpdated = async (event: any) => {
  const {object} = event?.data || {};
  const {id, status, amount, charges} = object || {};
  const {invoice} = object?.metadata || {};
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
      await admin
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
          {merge: true}
        )
        .then(
          async () =>
            await request
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
                const {data} = response;
                if (DEBUG)
                  console.log("API Response: POST /invoicepayment/ => ", data);
              })
              .catch(async (error: any) => await throwError(error))
        )
        .catch(async (error: any) => console.error(error));
    else {
      const userId = await admin
        .firestore()
        .collection("client_invoices")
        .doc(`${invoice}`)
        .get()
        .then((doc: any) => getProVetIdFromUrl(doc.data()?.client))
        .catch(async (error: any) => console.error(error));
      if (userId)
        await admin
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
            {merge: true}
          )
          .then(
            async () =>
              await request
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
                  const {data} = response;
                  if (DEBUG)
                    console.log(
                      "API Response: POST /invoicepayment/ => ",
                      data
                    );
                })
                .then(
                  async () =>
                    await admin
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
                        {merge: true}
                      )
                )
                .then(async () => {
                  //if (DEBUG) console.log('`${userId}`', `${userId}`);
                  const user = await admin
                    .auth()
                    .getUser(`${userId}`)
                    .catch((error: any) => console.error(error));
                  console.log("`${userId}`", `${userId}`);
                  console.log("`${user.email}`", `${user.email}`);
                  if (user) {
                    const clientIsOnWaitlist = await admin
                      .firestore()
                      .collection("waitlist")
                      .doc(user?.email)
                      .get()
                      .then((doc: any) => {
                        console.log("clientIsOnWaitlist DATA", doc.data());
                        return true;
                      })
                      .catch((error: any) => {
                        console.error(error);
                        return false;
                      });
                    console.log("`clientIsOnWaitlist`", clientIsOnWaitlist);
                    if (clientIsOnWaitlist) {
                      if (DEBUG)
                        console.log(
                          "ARCHIVING CLIENT FROM WAITLIST",
                          user?.email
                        );
                      await admin
                        .firestore()
                        .collection("waitlist")
                        .doc(user?.email)
                        .set(
                          {
                            updatedOn: new Date(),
                            isActive: false,
                          },
                          {merge: true}
                        )
                        .catch((error: any) => console.error(error));
                    } else if (DEBUG)
                      console.log("CLIENT WAS NOT ON WAITLIST", user?.email);
                  }
                })
                .catch(async (error: any) => await throwError(error))
          )
          .catch(async (error: any) => console.error(error));
      else
        await throwError(
          `FAILED TO CLOSE PROVET INVOICE - UNABLE TO LOCATE CLIENT ID ON INVOICE ${invoice}`
        );
    }
  }
};
