import {admin, throwError} from "../../../../../config/config";

export const configureTelehealthStatus = async (): Promise<boolean> => {
  const alreadyHasConfiguration = await admin
    .firestore()
    .collection("alerts")
    .doc("telehealth")
    .get()
    .then((document: any) => (document.data() ? true : false))
    .catch(() => false);

  if (alreadyHasConfiguration) {
    console.log(
      "alerts/telehealth/ COLLECTION DETECTED - SKIPPING TELEHEALTH STATUS CONFIGURATION..."
    );
    console.log(
      "DELETE THE alerts/telehealth/ COLLECTION AND RESTART TO REFRESH THE TELEHEALTH STATUS CONFIGURATION"
    );
    return true;
  } else {
    console.log("STARTING TELEHEALTH STATUS CONFIGURATION");
    return await admin
      .firestore()
      .collection("alerts")
      .doc("telehealth")
      .set(
        {
          isOnline: false,
          queueSize: 0,
          waitTime: 1,
          message:
            "We are currently unavailable, but promise to reply to your question(s) ASAP",
          onlineAutoReply:
            "(AUTO REPLY) Thanks for reaching out! A MoVET Expert will be with you shortly.",
          offlineAutoReply:
            "(AUTO REPLY) Thanks for reaching out! We are currently offline, but we promise to get back to you ASAP.",
          updatedOn: new Date(),
        },
        {merge: true}
      )
      .then(() => true)
      .catch(async (error: any) => await throwError(error));
  }
};
