import {admin, throwError} from "../config/config";

export const configureBooking = async () => {
  const alreadyHasConfiguration = await admin
    .firestore()
    .collection("configuration")
    .doc("booking")
    .get()
    .then((document: any) => (document.data() ? true : false))
    .catch(() => false);

  if (alreadyHasConfiguration) {
    console.log(
      "configuration/booking/ COLLECTION DETECTED - SKIPPING BOOKING CONFIGURATION..."
    );
    console.log(
      "DELETE THE configuration/booking/ COLLECTION AND RESTART TO REFRESH THE BOOKING CONFIGURATION"
    );
    return true;
  } else {
    console.log("STARTING BOOKING CONFIGURATION");
    return await admin
      .firestore()
      .collection("configuration")
      .doc("booking")
      .set(
        {
          clinicMinorIllnessVcprReason: 30,
          clinicStandardVcprReason: 30,
          housecallMinorIllnessVcprReason: 30,
          housecallStandardVcprReason: 30,
          updatedOn: new Date(),
        },
        {merge: true}
      )
      .then(() => {
        console.log("BOOKING CONFIGURATION COMPLETE");
        return true;
      })
      .catch(async (error: any) => await throwError(error));
  }
};
