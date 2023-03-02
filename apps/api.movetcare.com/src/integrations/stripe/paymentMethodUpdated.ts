import { admin, throwError } from "./../../config/config";
const DEBUG = false; // environment.type === "production";
export const paymentMethodUpdated = (event: any): void => {
  const { customer, card, id, type, billing_details } =
    event?.data?.object || {};
  if (customer)
    admin
      .firestore()
      .collection("clients")
      .where("customer", "==", customer)
      .limit(1)
      .get()
      .then((querySnapshot: any) => {
        if (DEBUG)
          console.log(
            "querySnapshot?.docs?.length",
            querySnapshot?.docs?.length
          );
        if (querySnapshot?.docs?.length > 0)
          querySnapshot.forEach((doc: any) => {
            if (
              event?.type === "payment_method.attached" ||
              event?.type === "payment_method.updated" ||
              event?.type === "payment_method.automatically_updated"
            )
              admin
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
                .then(
                  () =>
                    DEBUG &&
                    console.log("paymentMethodUpdated => ", {
                      paymentMethod: id,
                      client: doc?.id,
                      card,
                      id,
                      type,
                      billing_details,
                      active: true,
                      eventIds: event?.id,
                    })
                )
                .catch((error: any) => throwError(error));
          });
      });
  else
    admin
      .firestore()
      .collection("clients")
      .where("customer", "==", event.data.previous_attributes.customer)
      .limit(1)
      .get()
      .then((querySnapshot: any) => {
        if (DEBUG)
          console.log(
            "querySnapshot?.docs?.length",
            querySnapshot?.docs?.length
          );
        if (querySnapshot?.docs?.length > 0)
          querySnapshot.forEach((doc: any) => {
            if (event?.type === "payment_method.detached")
              admin
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
                .then(
                  () =>
                    DEBUG &&
                    console.log("paymentMethodUpdated => DETACHED ", {
                      paymentMethod: id,
                      client: doc?.id,
                      active: false,
                      eventIds: event?.id,
                    })
                )
                .catch((error: any) => throwError(error));
          });
      });
};
