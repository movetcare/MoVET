import { admin, throwError, environment, DEBUG } from "../config/config";

export const configureBooking = async (): Promise<boolean> => {
  const alreadyHasConfiguration = await admin
    .firestore()
    .collection("configuration")
    .doc("bookings")
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
    // if (environment.type !== "production") generateTestBookingData();
  } else {
    console.log("STARTING BOOKING CONFIGURATION");
    const today = new Date();
    if (DEBUG) {
      console.log("today", today);
      console.log(
        "5 Days from now",
        new Date(today.setDate(today.getDate() + 5))
      );
    }
    admin
      .firestore()
      .collection("configuration")
      .doc("bookings")
      .set(
        {
          clinicOpenMonday: true,
          clinicOpenMondayTime: 930,
          clinicClosedMondayTime: 1700,
          clinicOpenTuesday: true,
          clinicOpenTuesdayTime: 930,
          clinicClosedTuesdayTime: 1700,
          clinicOpenWednesday: true,
          clinicOpenWednesdayTime: 930,
          clinicClosedWednesdayTime: 1700,
          clinicOpenThursday: true,
          clinicOpenThursdayTime: 930,
          clinicClosedThursdayTime: 1700,
          clinicOpenFriday: true,
          clinicOpenFridayTime: 930,
          clinicClosedFridayTime: 1700,
          clinicOpenSaturday: false,
          clinicOpenSaturdayTime: 1300,
          clinicClosedSaturdayTime: 1700,
          clinicOpenSunday: false,
          clinicOpenSundayTime: 1300,
          clinicClosedSundayTime: 1700,
          clinicLunchDuration: 30,
          clinicLunchTime: 1200,
          clinicOnePatientDuration: 45,
          clinicTwoPatientDuration: 60,
          clinicThreePatientDuration: 90,
          clinicAppointmentBufferTime: 15,
          clinicStandardVcprReason: {
            value: 106,
            label: "Establish Care Exam",
          },
          clinicSameDayAppointmentVcprRequired: true,
          clinicSameDayAppointmentLeadTime: 90,
          housecallOpenMonday: true,
          housecallOpenMondayTime: 930,
          housecallClosedMondayTime: 1700,
          housecallOpenTuesday: true,
          housecallOpenTuesdayTime: 930,
          housecallClosedTuesdayTime: 1700,
          housecallOpenWednesday: true,
          housecallOpenWednesdayTime: 930,
          housecallClosedWednesdayTime: 1700,
          housecallOpenThursday: true,
          housecallOpenThursdayTime: 930,
          housecallClosedThursdayTime: 1700,
          housecallOpenFriday: true,
          housecallOpenFridayTime: 930,
          housecallClosedFridayTime: 1700,
          housecallOpenSaturday: false,
          housecallOpenSaturdayTime: 1300,
          housecallClosedSaturdayTime: 1700,
          housecallOpenSunday: false,
          housecallOpenSundayTime: 1300,
          housecallClosedSundayTime: 1700,
          housecallLunchDuration: 30,
          housecallLunchTime: 1200,
          housecallOnePatientDuration: 60,
          housecallTwoPatientDuration: 90,
          housecallThreePatientDuration: 120,
          housecallStandardVcprReason: {
            value: 105,
            label: "Establish Care Exam",
          },
          virtualOpenMonday: true,
          virtualOpenMondayTime: 930,
          virtualClosedMondayTime: 1700,
          virtualOpenTuesday: true,
          virtualOpenTuesdayTime: 930,
          virtualClosedTuesdayTime: 1700,
          virtualOpenWednesday: true,
          virtualOpenWednesdayTime: 930,
          virtualClosedWednesdayTime: 1700,
          virtualOpenThursday: true,
          virtualOpenThursdayTime: 930,
          virtualClosedThursdayTime: 1700,
          virtualOpenFriday: true,
          virtualOpenFridayTime: 930,
          virtualClosedFridayTime: 1700,
          virtualOpenSaturday: false,
          virtualOpenSaturdayTime: 1300,
          virtualClosedSaturdayTime: 1700,
          virtualOpenSunday: false,
          virtualOpenSundayTime: 1300,
          virtualClosedSundayTime: 1700,
          virtualLunchDuration: 30,
          virtualLunchTime: 1200,
          virtualOnePatientDuration: 45,
          virtualTwoPatientDuration: 60,
          virtualThreePatientDuration: 90,
          virtualStandardVcprReason: {
            value: 121,
            label: "Virtual Meet & Greet",
          },
          requirePaymentMethodToRequestAnAppointment: false,
          winterHousecallMode: {
            startDate: new Date(),
            endDate: new Date(today.setDate(today.getDate() + 5)),
            message:
              "Due to weather variability housecalls are by request only beginning Wednesday, Dec 21st. Normal scheduling will reopen Monday, April 3rd.",
            isActiveOnWebsite: false,
            isActiveOnMobileApp: false,
            isActiveOnWebApp: false,
            enableForNewPatientsOnly: true,
          },
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .then(async () => {
        console.log("BOOKING CONFIGURATION COMPLETE");
        // if (environment.type !== "production") generateTestBookingData();
        if (environment.type !== "production")
          admin
            .firestore()
            .collection("alerts")
            .doc("banner")
            .set(
              {
                color: "#DAAA00",
                message:
                  "This is your own personal local development environment...",
                title: "Welcome!",
                link: "/contact",
                isActive: true,
                isActiveMobile: true,
                icon: "info-circle",
              },
              { merge: true }
            )
            .then(async () => {
              console.log("ALERT BANNER SETUP COMPLETE");
              return true;
            });
      })
      .catch((error: any) => throwError(error));
  }
  return true;
};

// const generateTestBookingData = () =>
//   admin
//     .firestore()
//     .collection("contact")
//     .add({
//       email: "dev+test@movetcare.com",
//       firstName: "Alex",
//       lastName: "Rodriguez",
//       message:
//         "TESTING 123... THIS IS JUST A TEST THAT IS AUTOMAGICALLY GENERATED WHEN THE DEV ENVIRONMENT IS SPUN UP!",
//       phone: "3147360856",
//       reason: { id: "appointment-request", name: "Appointment Request" },
//       source: "app.movetcare.com",
//       status: CONTACT_STATUS.NEEDS_PROCESSING,
//       createdOn: new Date(),
//     })
//     .then(() => {
//       console.log("TEST CONTACT FORM BOOKING REQUEST COMPLETE");
//       admin
//         .firestore()
//         .collection("bookings")
//         .add({
//           createdAt: new Date(),
//           client: {
//             uid: "5769",
//             phoneNumber: "+1314 7360856",
//             displayName: "Alex Rodriguez",
//             email: "dev+test@movetcare.com",
//           },
//           vcprRequired: true,
//           id: "T565UH1WjK7qN5gW6WH5",
//           illPatients: ["5585", "5586"],
//           nextPatient: null,
//           illnessDetails: null,
//           patients: [
//             {
//               gender: "Female, neutered",
//               species: "Dog (Canine - Domestic)",
//               vcprRequired: true,
//               illnessDetails: {
//                 symptoms: ["Eye Infection"],
//                 notes: "Test Illness #2",
//               },
//               name: "TESTTESTTEST1",
//               hasMinorIllness: true,
//               value: "5585",
//             },
//             {
//               gender: "Female, neutered",
//               species: "Dog (Canine - Domestic)",
//               vcprRequired: true,
//               illnessDetails: {
//                 symptoms: ["Coughing", "Minor Cuts / Scrapes"],
//                 notes: "Test Illness #1",
//               },
//               name: "TESTTEST2",
//               hasMinorIllness: true,
//               value: "5586",
//             },
//             {
//               gender: "Female, neutered",
//               species: "Cat (Feline - Domestic)",
//               vcprRequired: true,
//               name: "VCPR TEST CAT 22",
//               hasMinorIllness: false,
//               value: "5587",
//             },
//           ],
//           address: {
//             zipcode: "80237",
//             parts: [
//               "4912",
//               "South Newport Street",
//               "Southeast",
//               "Denver",
//               "Denver County",
//               "Colorado",
//               "United States",
//               "80237",
//             ],
//             placeId: "ChIJrfSG_-KGbIcRRls6Rip0HmM",
//             full: "4912 S Newport St, Denver, CO 80237, USA",
//             info: "Apartment #2A",
//           },
//           location: "Home",
//           reason: {
//             label: "Annual Exam - VCPR / Rabies (DVM)",
//             value: 30,
//           },
//           requestedDateTime: {
//             date: new Date(),
//             time: "09:00",
//           },
//           step: "success",
//           isActive: false,
//           updatedOn: new Date(),
//         })
//         .then(() => {
//           console.log("TEST BOOKING FLOW SUBMISSION COMPLETE");
//           admin
//             .firestore()
//             .collection("alerts")
//             .doc("banner")
//             .set(
//               {
//                 color: "#DAAA00",
//                 message:
//                   "This is your own personal local development environment...",
//                 title: "Welcome!",
//                 link: "/contact",
//                 isActive: true,
//                 isActiveMobile: true,
//                 icon: "info-circle",
//               },
//               { merge: true }
//             )
//             .then(async () => {
//               console.log("ALERT BANNER SETUP COMPLETE");
//               return true;
//             });
//         })
//         .catch((error: any) => throwError(error));
//     })
//     .catch((error: any) => throwError(error));
