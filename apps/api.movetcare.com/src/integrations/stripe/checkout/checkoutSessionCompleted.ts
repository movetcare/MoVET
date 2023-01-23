import { admin, stripe, throwError } from "../../../config/config";
const DEBUG = true;
export const checkoutSessionCompleted = (event: any) =>
  admin
    .firestore()
    .collection("clients")
    .doc(event?.data?.object?.client_reference_id)
    .set(
      {
        updatedOn: new Date(),
        customer: event?.data?.object?.customer,
      },
      { merge: true }
    )
    .then(
      () =>
        DEBUG &&
        console.log(
          "SUCCESSFULLY ADDED SETUP INTENT TO CLIENT",
          event?.data?.object?.client_reference_id
        )
    )
    .then(() => {
      admin
        .auth()
        .setCustomUserClaims(event?.data?.object?.client_reference_id, {
          onboardingComplete: true,
          isClient: true,
        })
        .catch((error: any) => throwError(error));
    })
    .then(() => {
      admin
        .firestore()
        .collection("waitlist")
        .where("id", "==", event?.data?.object?.client_reference_id)
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
              const client = await admin
                .firestore()
                .collection("clients")
                .doc(event?.data?.object?.client_reference_id)
                .get()
                .then((doc: any) => doc.data())
                .catch((error: any) => throwError(error));

              if (DEBUG) {
                console.log("client", client);
              }
              admin
                .firestore()
                .collection("waitlist")
                .doc(doc.data()?.email)
                .set(
                  {
                    paymentMethod: (
                      (await stripe.customers.listPaymentMethods(
                        event?.data?.object?.customer,
                        { type: "card", limit: 1 }
                      )) as any
                    )?.data[0],
                    status: "complete",
                    isActive: true,
                    updatedOn: new Date(),
                    id: event?.data?.object?.client_reference_id,
                    firstName: client?.firstName,
                    lastName: client?.lastName,
                    phone: client?.phone,
                    customerId: event?.data?.object?.customer,
                  },
                  { merge: true }
                )
                .catch((error: any) => throwError(error));
            });
        })
        .catch((error: any) => throwError(error));
    })
    .catch((error: any) => throwError(error));
