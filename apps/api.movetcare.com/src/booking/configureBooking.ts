import {admin, throwError} from "../config/config";
import { CONTACT_STATUS } from "../constant";

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
        { merge: true }
      )
      .then(async () => {
        console.log("BOOKING CONFIGURATION COMPLETE");
        return await admin
          .firestore()
          .collection("contact")
          .add({
            email: "alex.rodriguez+test@movetcare.com",
            firstName: "Alex",
            lastName: "Rodriguez",
            message:
              "TESTING 123... THIS IS JUST A TEST THAT IS AUTOMAGICALLY GENERATED WHEN THE DEV ENVIRONMENT IS SPUN UP!",
            phone: "3147360856",
            reason: { id: "general-inquiry", name: "General Inquiry" },
            source: "app.movetcare.com",
            status: CONTACT_STATUS.NEEDS_PROCESSING,
            createdOn: new Date(),
          })
          .then(async () => {
            console.log("TEST BOOKING SUBMISSION COMPLETE");
            return true;
          })
          .catch(async (error: any) => await throwError(error));
      })
      .catch(async (error: any) => await throwError(error));
  }
};
