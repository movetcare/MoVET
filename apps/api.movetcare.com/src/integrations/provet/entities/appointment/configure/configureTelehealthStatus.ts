import { admin, throwError } from "../../../../../config/config";

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
      "alerts/telehealth/ COLLECTION DETECTED - SKIPPING TELEHEALTH STATUS CONFIGURATION...",
    );
    console.log(
      "DELETE THE alerts/telehealth/ COLLECTION AND RESTART TO REFRESH THE TELEHEALTH STATUS CONFIGURATION",
    );
    return true;
  } else {
    console.log("STARTING TELEHEALTH STATUS CONFIGURATION");
    await admin
      .firestore()
      .collection("configuration")
      .doc("telehealth")
      .set(
        {
          onlineTemplates: [
            {
              title: "Busy w/ a Patient",
              message:
                "Thanks for reaching out! We are currently with a patient, but a MoVET Expert will be with you shortly. Thanks for your patience!",
            },
            {
              title: "Extreme Weather",
              message:
                "Thanks for reaching out! Our clinic is currently closed for our staff's safety due to the extreme weather forecast. Communications from clients will still be checked and answered to the best of our ability. Thank you for your patience.",
            },
          ],
          offlineTemplates: [
            {
              title: "Closed for the Day",
              message:
                "Thanks for reaching out! Our office is currently closed. We will reopen at 9:00 AM.",
            },
            {
              title: "Holiday Closure",
              message:
                "Thanks for reaching out! Our office is closed for the __________ holiday. We will reopen __________. Don't forget, you can always book an appointment on your own using our mobile app (https://movetcare.com/get-the-app). We will reply to your message when our office opens.",
            },
          ],
          updatedOn: new Date(),
        },
        { merge: true },
      )
      .then(() => true)
      .catch((error: any) => throwError(error));
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
        { merge: true },
      )
      .then(() => true)
      .catch((error: any) => throwError(error));
  }
};
