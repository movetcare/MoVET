import {admin, throwError} from "../../../../../config/config";

export const configureAppointmentEstimates = async (): Promise<boolean> => {
  const alreadyHasConfiguration = await admin
    .firestore()
    .collection("configuration")
    .doc("estimates")
    .get()
    .then((document: any) => (document.data() ? true : false))
    .catch(() => false);

  if (alreadyHasConfiguration) {
    console.log(
      "configuration/estimates/ DOCUMENT DETECTED - SKIPPING APPOINTMENT ESTIMATES CONFIGURATION..."
    );
    console.log(
      "DELETE THE configuration/estimates/ DOCUMENT AND RESTART TO REFRESH THE APPOINTMENT ESTIMATES CONFIGURATION"
    );
    return true;
  } else {
    console.log("STARTING APPOINTMENT ESTIMATES CONFIGURATION");
    return await admin
      .firestore()
      .collection("configuration")
      .doc("estimates")
      .set(
        {
          clinic: {
            healthy: 68,
            unhealthy: 85,
          },
          mobile: {
            healthy: 128,
            unhealthy: 145.0,
          },
          telehealth: {
            healthy: 32.0,
            unhealthy: 32.0,
          },
          updatedOn: new Date(),
        },
        {merge: true}
      )
      .then(() => true)
      .catch(async (error: any) => await throwError(error));
  }
};
