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
        "5 Days: from now",
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
    const closureDatesClinic = [
      {
        name: "Test Closure for Development - 1",
        startTime: 930,
        endTime: 1200,
        date: new Date(),
      },
      {
        name: "Test Closure for Development - 2",
        startTime: 1300,
        endTime: 1500,
        date: new Date(today.setDate(today.getDate() + 1)),
      },
      {
        name: "Test Closure for Development - 3",
        startTime: 1000,
        endTime: 1500,
        date: new Date(today.setDate(today.getDate() + 1)),
      },
    ];
    await admin
      .firestore()
      .collection("configuration")
      .doc("closures")
      .set(
        {
          closureDates,
          closureDatesClinic,
          closureDatesHousecall: [],
          closureDatesVirtual: [],
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .then(
        async () =>
          DEBUG &&
          console.log("Closures Configured => ", {
            closureDates,
            closureDatesClinic,
            closureDatesHousecall: [],
            closureDatesVirtual: [],
          })
      )
      .catch((error: any) => throwError(error));
  }
  const alreadyHasHoursConfiguration = await admin
    .firestore()
    .collection("configuration")
    .doc("openings")
    .get()
    .then((document: any) => (document.data()?.openingDates ? true : false))
    .catch(() => false);
  if (alreadyHasHoursConfiguration) {
    console.log(
      "configuration/openings DOCUMENT DETECTED - SKIPPING CONFIGURATION..."
    );
    console.log(
      "DELETE THE configuration/openings DOCUMENT COLLECTION AND RESTART TO REFRESH THE ADMIN CONFIGURATION"
    );
    return true;
  } else {
    console.log("STARTING HOURS CONFIGURATION");
    const openingDates = [
      {
        days: "Mon - FRI",
        times: "9am TO 5PM",
        type: "Boutique @ Belleview Station",
      },
      {
        days: "Sat & SUN",
        times: "CLOSed",
        type: "Boutique @ Belleview Station",
      },
      {
        days: "TUE",
        times: "9AM - 12PM & 2PM - 4pm",
        type: "Clinic Walk-In Hours",
      },
      {
        days: "THUR",
        times: "9AM - 12PM & 2PM - 4pm",
        type: "Clinic Walk-In Hours",
      },
      {
        days: "Mon - FRI",
        times: "9Am TO 5PM",
        type: "Clinic @ Belleview Station",
      },
      {
        days: "Sat & SUN",
        times: "closeD",
        type: "Clinic @ Belleview Station",
      },
      { days: "Mon - FRI", times: " 9am TO 5PM", type: "Housecalls" },
      { days: "Sat & sun", times: "CLOSed", type: "Housecalls" },
    ];
    await admin
      .firestore()
      .collection("configuration")
      .doc("openings")
      .set(
        {
          openingDates,
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .then(
        async () => DEBUG && console.log("Hours Configured => ", openingDates)
      )
      .catch((error: any) => throwError(error));
  }
  return true;
};
