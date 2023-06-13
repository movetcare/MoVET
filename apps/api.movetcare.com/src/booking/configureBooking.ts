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
    await admin
      .firestore()
      .collection("configuration")
      .doc("hours_status")
      .set({
        boutiqueStatus: true,
        clinicStatus: true,
        housecallStatus: true,
        walkinsStatus: false,
      })
      .catch((error: any) => throwError(error));
    await admin
      .firestore()
      .collection("configuration")
      .doc("bookings")
      .set(
        {
          clinicAutomationStatus: true,
          housecallAutomationStatus: false,
          boutiqueAutomationStatus: true,
          walkinsAutomationStatus: false,
          automatedOpenTimeSunday: 900,
          automatedCloseTimeSunday: 1700,
          automatedOpenTimeMonday: 900,
          automatedCloseTimeMonday: 1700,
          automatedOpenTimeTuesday: 900,
          automatedCloseTimeTuesday: 1700,
          automatedOpenTimeWednesday: 900,
          automatedCloseTimeWednesday: 1700,
          automatedOpenTimeThursday: 900,
          automatedCloseTimeThursday: 1700,
          automatedOpenTimeFriday: 900,
          automatedCloseTimeFriday: 1700,
          automatedOpenTimeSaturday: 900,
          automatedCloseTimeSaturday: 1700,
          isOpenMondayAutomation: true,
          isOpenTuesdayAutomation: true,
          isOpenWednesdayAutomation: true,
          isOpenThursdayAutomation: true,
          isOpenFridayAutomation: true,
          isOpenSaturdayAutomation: false,
          isOpenSundayAutomation: false,
          clinicActiveResources: [
            { id: 14, staggerTime: 0 },
            { id: 15, staggerTime: 15 },
            { id: 16, staggerTime: 30 },
          ],
          clinicOpenMonday: true,
          clinicOpenMondayTime: 930,
          clinicClosedMondayTime: 1700,
          clinicOpenTuesday: true,
          clinicOpenTuesdayTime: 930,
          clinicClosedTuesdayTime: 1700,
          clinicOpenWednesday: true,
          clinicOpenWednesdayTime: 930,
          clinicClosedWednesdayTime: 1630,
          clinicOpenThursday: true,
          clinicOpenThursdayTime: 930,
          clinicClosedThursdayTime: 1700,
          clinicOpenFriday: true,
          clinicOpenFridayTime: 930,
          clinicClosedFridayTime: 1700,
          clinicOpenSaturday: true,
          clinicOpenSaturdayTime: 1300,
          clinicClosedSaturdayTime: 1700,
          clinicOpenSunday: false,
          clinicOpenSundayTime: 1300,
          clinicClosedSundayTime: 1700,
          clinicLunchDuration: 60,
          clinicLunchTime: 1200,
          clinicOnePatientDuration: 45,
          clinicTwoPatientDuration: 60,
          clinicThreePatientDuration: 90,
          clinicAppointmentBufferTime: 0,
          clinicStandardVcprReason: {
            value: 106,
            label: "Establish Care Exam",
          },
          clinicSameDayAppointmentVcprRequired: true,
          clinicSameDayAppointmentLeadTime: 90,
          housecallActiveResources: [
            { id: 3, staggerTime: 0 },
            { id: 9, staggerTime: 30 },
          ],
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
          housecallOpenSaturday: true,
          housecallOpenSaturdayTime: 1300,
          housecallClosedSaturdayTime: 1700,
          housecallOpenSunday: false,
          housecallOpenSundayTime: 1300,
          housecallClosedSundayTime: 1700,
          housecallLunchDuration: 60,
          housecallLunchTime: 1200,
          housecallOnePatientDuration: 60,
          housecallTwoPatientDuration: 90,
          housecallThreePatientDuration: 120,
          housecallAppointmentBufferTime: 30,
          housecallStandardVcprReason: {
            value: 105,
            label: "Establish Care Exam",
          },
          housecallSameDayAppointmentVcprRequired: false,
          housecallSameDayAppointmentLeadTime: 120,
          virtualActiveResources: [
            { id: 11, staggerTime: 0 },
            { id: 18, staggerTime: 15 },
          ],
          virtualOpenMonday: true,
          virtualOpenMondayTime: 930,
          virtualClosedMondayTime: 1700,
          virtualOpenTuesday: true,
          virtualOpenTuesdayTime: 930,
          virtualClosedTuesdayTime: 1700,
          virtualOpenWednesday: true,
          virtualOpenWednesdayTime: 1330,
          virtualClosedWednesdayTime: 1630,
          virtualOpenThursday: true,
          virtualOpenThursdayTime: 930,
          virtualClosedThursdayTime: 1700,
          virtualOpenFriday: true,
          virtualOpenFridayTime: 930,
          virtualClosedFridayTime: 1700,
          virtualOpenSaturday: true,
          virtualOpenSaturdayTime: 1300,
          virtualClosedSaturdayTime: 1700,
          virtualOpenSunday: false,
          virtualOpenSundayTime: 1300,
          virtualClosedSundayTime: 1700,
          virtualLunchDuration: 60,
          virtualLunchTime: 1200,
          virtualOnePatientDuration: 45,
          virtualTwoPatientDuration: 60,
          virtualThreePatientDuration: 90,
          virtualAppointmentBufferTime: 0,
          virtualStandardVcprReason: {
            value: 121,
            label: "Virtual Meet & Greet",
          },
          virtualSameDayAppointmentVcprRequired: true,
          virtualSameDayAppointmentLeadTime: 90,
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
