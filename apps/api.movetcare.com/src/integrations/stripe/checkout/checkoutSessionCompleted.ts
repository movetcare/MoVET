import {admin, stripe, throwError, DEBUG} from "../../../config/config";

export const checkoutSessionCompleted = async (event: any) =>
  await admin
    .firestore()
    .collection("clients")
    .doc(event?.data?.object?.client_reference_id)
    .set(
      {
        updatedOn: new Date(),
        customer: {id: event?.data?.object?.customer},
      },
      {merge: true}
    )
    .then(
      () =>
        DEBUG &&
        console.log(
          "SUCCESSFULLY ADDED SETUP INTENT TO CLIENT",
          event?.data?.object?.client_reference_id
        )
    )
    .then(async () => {
      await admin
        .auth()
        .setCustomUserClaims(event?.data?.object?.client_reference_id, {
          onboardingComplete: true,
          isClient: true,
        })
        .catch((error: any) => throwError(error));
    })
    .then(async () => {
      await admin
        .firestore()
        .collection("waitlist")
        .where("id", "==", event?.data?.object?.client_reference_id)
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
              await admin
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
                  },
                  { merge: true }
                )
                .catch((error: any) => throwError(error));
            });
        })
        .catch((error: any) => throwError(error));
    })
    .catch(async (error: any) => throwError(error));
