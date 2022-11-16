import { admin, throwError, DEBUG } from "./../../config/config";

export const paymentMethodUpdated = async (event: any) => {
  const { customer, card, id, type, billing_details } =
    event?.data?.object || {};
  await admin
    .firestore()
    .collection("clients")
    .where("customer.id", "==", customer)
    .limit(1)
    .get()
    .then(async (querySnapshot: any) => {
      if (DEBUG)
        console.log("querySnapshot?.docs?.length", querySnapshot?.docs?.length);
      if (querySnapshot?.docs?.length > 0)
        querySnapshot.forEach(async (doc: any) => {
          if (
            event?.type === "payment_method.attached" ||
            event?.type === "payment_method.updated" ||
            event?.type === "payment_method.automatically_updated"
          )
            await admin
              .firestore()
              .collection("clients")
              .doc(doc?.id)
              .collection("payment_methods")
              .doc(id)
              .set(
                {
                  card,
                  id,
                  type,
                  billing_details,
                  active: true,
                  eventIds: event?.id,
                  updatedOn: new Date(),
                },
                { merge: true }
              )
              .catch((error: any) => throwError(error));
          else if (event?.type === "payment_method.detached")
            await admin
              .firestore()
              .collection("clients")
              .doc(doc.id)
              .collection("payment_methods")
              .doc(id)
              .set(
                {
                  active: false,
                  eventIds: event?.id,
                  updatedOn: new Date(),
                },
                { merge: true }
              )
              .catch((error: any) => throwError(error));
        });
    });
};
