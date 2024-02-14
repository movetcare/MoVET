import { admin, throwError, DEBUG } from "../../../config/config";

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
      { merge: true },
    )
    .then(
      () =>
        DEBUG &&
        console.log(
          "SUCCESSFULLY ADDED SETUP INTENT TO CLIENT",
          event?.data?.object?.client_reference_id,
        ),
    )
    .catch((error: any) => throwError(error));
