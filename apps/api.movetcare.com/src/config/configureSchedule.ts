import { admin, throwError, DEBUG } from "./config";

export const configureSchedule = async (): Promise<boolean> => {
  const alreadyHasClosureConfiguration = await admin
    .firestore()
    .collection("configuration")
    .doc("closures")
    .get()
    .then((document: any) => (document.data()?.closureDates ? true : false))
    .catch(() => false);

  if (alreadyHasClosureConfiguration) {
    console.log(
      "configuration/closures DOCUMENT DETECTED - SKIPPING CONFIGURATION..."
    );
    console.log(
      "DELETE THE configuration/closures DOCUMENT COLLECTION AND RESTART TO REFRESH THE ADMIN CONFIGURATION"
    );
    return true;
  } else {
    console.log("STARTING CLOSURES CONFIGURATION");
    const today = new Date();
    if (DEBUG) {
      console.log("today", today);
      console.log(
        "5 Days from now",
        new Date(today.setDate(today.getDate() + 5))
      );
    }
    const closureDates = [
      {
        startDate: new Date(),
        endDate: new Date(today.setDate(today.getDate() + 5)),
        isActiveForClinic: true,
        isActiveForHousecalls: true,
        isActiveForTelehealth: true,
        showOnWebsite: true,
        name: "Christmas Holiday",
      },
      {
        startDate: new Date(today.setDate(today.getDate() + 10)),
        endDate: new Date(today.setDate(today.getDate() + 10)),
        isActiveForClinic: true,
        isActiveForHousecalls: true,
        isActiveForTelehealth: true,
        showOnWebsite: true,
        name: "New Years Holiday",
      },
      {
        startDate: new Date(today.setDate(today.getDate() + 22)),
        endDate: new Date(today.setDate(today.getDate() + 22)),
        isActiveForClinic: true,
        isActiveForHousecalls: true,
        isActiveForTelehealth: true,
        showOnWebsite: false,
        name: "Test Hidden Holiday",
      },
    ];
    return await admin
      .firestore()
      .collection("configuration")
      .doc("closures")
      .set(
        {
          closureDates,
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .then(async () => {
        if (DEBUG) console.log("Closures Configured => ", closureDates);
        return true;
      })
      .catch((error: any) => throwError(error));
  }
};
