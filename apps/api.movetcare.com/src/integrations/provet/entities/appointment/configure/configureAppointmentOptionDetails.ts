import {admin, throwError} from "../../../../../config/config";

export const configureAppointmentOptionDetails = async (): Promise<boolean> => {
  const alreadyHasConfiguration = await admin
    .firestore()
    .collection("configuration")
    .doc("appointment_options")
    .get()
    .then((document: any) => (document.data() ? true : false))
    .catch(() => false);

  if (alreadyHasConfiguration) {
    console.log(
      "configuration/appointment_options/ DOCUMENT DETECTED - SKIPPING APPOINTMENT OPTIONS CONFIGURATION..."
    );
    console.log(
      "DELETE THE configuration/appointment_options/ DOCUMENT AND RESTART TO REFRESH THE APPOINTMENT OPTIONS CONFIGURATION"
    );
    return true;
  } else {
    console.log("STARTING APPOINTMENT OPTIONS CONFIGURATION");
    return await admin
      .firestore()
      .collection("configuration")
      .doc("appointment_options")
      .set(
        {
          virtual: {
            description: "Consult with us at the flip of a switch!",
            operatingHours: "TUE & THUR: 9AM - 5PM",
          },
          home: {
            // eslint-disable-next-line quotes
            description: "We'll come to you!",
            operatingHours: "MON & FRI: 9AM - 1PM & WED: 1PM - 5PM",
          },
          clinic: {
            description: "4912 S Newport St Denver, CO 80237",
            operatingHours: "MON - FRI: 9AM - 5PM",
          },

          updatedOn: new Date(),
        },
        {merge: true}
      )
      .then(() => true)
      .catch(async (error: any) => await throwError(error));
  }
};
