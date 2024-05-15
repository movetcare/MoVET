import { admin, throwError, environment, DEBUG } from "./config";

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
      "configuration/booking/ COLLECTION DETECTED - SKIPPING BOOKING CONFIGURATION...",
    );
    console.log(
      "DELETE THE configuration/booking/ COLLECTION AND RESTART TO REFRESH THE BOOKING CONFIGURATION",
    );
    // if (environment.type !== "production") generateTestBookingData();
  } else {
    console.log("STARTING BOOKING CONFIGURATION");
    const today = new Date();
    if (DEBUG) {
      console.log("today", today);
      console.log(
        "5 Days from now",
        new Date(today.setDate(today.getDate() + 5)),
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
      .doc("pop_up_clinics")
      .set({
        popUpClinics: [
          {
            id: "spot-check-heartworm-clinic",
            name: "Spot Check Heartworm Clinic",
            isActive: true,
            appointmentBufferTime: 0,
            description:
              "We want to make sure ALL dogs are protected this Spring from Heartworm disease. MoVET is offering a Heartworm 'Spot Check' Clinic on Sunday, May 19th. Clinic includes a Heartworm Test ($45) and Monthly Heartworm Parasite Prevention. Flea/Tick prevention will also be available.",
            reason: "Annual Spring Heartworm Clinic",
            onePatientDuration: 30,
            resourceConfiguration: [{ id: 16, staggerTime: 0 }],
            sameDayAppointmentLeadTime: 0,
            sameDayAppointmentVcprRequired: false,
            threePatientDuration: 60,
            twoPatientDuration: 45,
            vcprRequiredReason: "Annual Spring Heartworm Clinic",
            scheduleType: "ONCE",
            schedule: {
              date: new Date(),
              startTime: 900,
              endTime: 1700,
            },
          },
        ],
        updatedOn: new Date(),
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
          automatedClinicOpenTimeSunday: 900,
          automatedClinicCloseTimeSunday: 1700,
          automatedClinicOpenTimeMonday: 900,
          automatedClinicCloseTimeMonday: 1700,
          automatedClinicOpenTimeTuesday: 900,
          automatedClinicCloseTimeTuesday: 1700,
          automatedClinicOpenTimeWednesday: 900,
          automatedClinicCloseTimeWednesday: 1700,
          automatedClinicOpenTimeThursday: 900,
          automatedClinicCloseTimeThursday: 1700,
          automatedClinicOpenTimeFriday: 900,
          automatedClinicCloseTimeFriday: 1700,
          automatedClinicOpenTimeSaturday: 900,
          automatedClinicCloseTimeSaturday: 900,
          isOpenMondayClinicAutomation: true,
          isOpenTuesdayClinicAutomation: true,
          isOpenWednesdayClinicAutomation: true,
          isOpenThursdayClinicAutomation: true,
          isOpenFridayClinicAutomation: true,
          isOpenSaturdayClinicAutomation: true,
          isOpenSundayClinicAutomation: false,
          automatedBoutiqueOpenTimeSunday: 900,
          automatedBoutiqueCloseTimeSunday: 1700,
          automatedBoutiqueOpenTimeMonday: 900,
          automatedBoutiqueCloseTimeMonday: 1700,
          automatedBoutiqueOpenTimeTuesday: 900,
          automatedBoutiqueCloseTimeTuesday: 1700,
          automatedBoutiqueOpenTimeWednesday: 900,
          automatedBoutiqueCloseTimeWednesday: 1700,
          automatedBoutiqueOpenTimeThursday: 900,
          automatedBoutiqueCloseTimeThursday: 1700,
          automatedBoutiqueOpenTimeFriday: 900,
          automatedBoutiqueCloseTimeFriday: 1700,
          automatedBoutiqueOpenTimeSaturday: 900,
          automatedBoutiqueCloseTimeSaturday: 1700,
          isOpenMondayBoutiqueAutomation: true,
          isOpenTuesdayBoutiqueAutomation: true,
          isOpenWednesdayBoutiqueAutomation: true,
          isOpenThursdayBoutiqueAutomation: true,
          isOpenFridayBoutiqueAutomation: true,
          isOpenSaturdayBoutiqueAutomation: true,
          isOpenSundayBoutiqueAutomation: false,
          automatedWalkInOpenTimeSunday: 900,
          automatedWalkInCloseTimeSunday: 1700,
          automatedWalkInOpenTimeMonday: 900,
          automatedWalkInCloseTimeMonday: 1700,
          automatedWalkInOpenTimeTuesday: 900,
          automatedWalkInCloseTimeTuesday: 1700,
          automatedWalkInOpenTimeWednesday: 900,
          automatedWalkInCloseTimeWednesday: 1700,
          automatedWalkInOpenTimeThursday: 900,
          automatedWalkInCloseTimeThursday: 1700,
          automatedWalkInOpenTimeFriday: 900,
          automatedWalkInCloseTimeFriday: 1700,
          automatedWalkInOpenTimeSaturday: 900,
          automatedWalkInCloseTimeSaturday: 1700,
          isOpenMondayWalkInAutomation: true,
          isOpenTuesdayWalkInAutomation: true,
          isOpenWednesdayWalkInAutomation: true,
          isOpenThursdayWalkInAutomation: true,
          isOpenFridayWalkInAutomation: true,
          isOpenSaturdayWalkInAutomation: true,
          isOpenSundayWalkInAutomation: false,
          automatedHousecallOpenTimeSunday: 900,
          automatedHousecallCloseTimeSunday: 1700,
          automatedHousecallOpenTimeMonday: 900,
          automatedHousecallCloseTimeMonday: 1700,
          automatedHousecallOpenTimeTuesday: 900,
          automatedHousecallCloseTimeTuesday: 1700,
          automatedHousecallOpenTimeWednesday: 900,
          automatedHousecallCloseTimeWednesday: 1700,
          automatedHousecallOpenTimeThursday: 900,
          automatedHousecallCloseTimeThursday: 1700,
          automatedHousecallOpenTimeFriday: 900,
          automatedHousecallCloseTimeFriday: 1700,
          automatedHousecallOpenTimeSaturday: 900,
          automatedHousecallCloseTimeSaturday: 1700,
          isOpenMondayHousecallAutomation: true,
          isOpenTuesdayHousecallAutomation: true,
          isOpenWednesdayHousecallAutomation: true,
          isOpenThursdayHousecallAutomation: true,
          isOpenFridayHousecallAutomation: true,
          isOpenSaturdayHousecallAutomation: true,
          isOpenSundayHousecallAutomation: false,
          clinicActiveResources: [
            { id: 14, staggerTime: 0 },
            { id: 15, staggerTime: 15 },
            { id: 16, staggerTime: 30 },
          ],
          clinicOpenMonday: true,
          clinicOpenMondayTime: 900,
          clinicClosedMondayTime: 1700,
          clinicOpenTuesday: true,
          clinicOpenTuesdayTime: 900,
          clinicClosedTuesdayTime: 1700,
          clinicOpenWednesday: true,
          clinicOpenWednesdayTime: 900,
          clinicClosedWednesdayTime: 1700,
          clinicOpenThursday: true,
          clinicOpenThursdayTime: 900,
          clinicClosedThursdayTime: 1700,
          clinicOpenFriday: true,
          clinicOpenFridayTime: 900,
          clinicClosedFridayTime: 1700,
          clinicOpenSaturday: false,
          clinicOpenSaturdayTime: 1300,
          clinicClosedSaturdayTime: 1700,
          clinicOpenSunday: false,
          clinicOpenSundayTime: 1300,
          clinicClosedSundayTime: 1700,
          // clinicLunchDuration: 60,
          // clinicLunchTime: 1200,
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
          housecallOpenMondayTime: 900,
          housecallClosedMondayTime: 1700,
          housecallOpenTuesday: true,
          housecallOpenTuesdayTime: 900,
          housecallClosedTuesdayTime: 1700,
          housecallOpenWednesday: true,
          housecallOpenWednesdayTime: 900,
          housecallClosedWednesdayTime: 1700,
          housecallOpenThursday: true,
          housecallOpenThursdayTime: 900,
          housecallClosedThursdayTime: 1700,
          housecallOpenFriday: true,
          housecallOpenFridayTime: 900,
          housecallClosedFridayTime: 1700,
          housecallOpenSaturday: true,
          housecallOpenSaturdayTime: 1300,
          housecallClosedSaturdayTime: 1700,
          housecallOpenSunday: false,
          housecallOpenSundayTime: 1300,
          housecallClosedSundayTime: 1700,
          // housecallLunchDuration: 60,
          // housecallLunchTime: 1200,
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
          virtualOpenMondayTime: 900,
          virtualClosedMondayTime: 1700,
          virtualOpenTuesday: true,
          virtualOpenTuesdayTime: 900,
          virtualClosedTuesdayTime: 1700,
          virtualOpenWednesday: true,
          virtualOpenWednesdayTime: 1330,
          virtualClosedWednesdayTime: 1700,
          virtualOpenThursday: true,
          virtualOpenThursdayTime: 900,
          virtualClosedThursdayTime: 1700,
          virtualOpenFriday: true,
          virtualOpenFridayTime: 900,
          virtualClosedFridayTime: 1700,
          virtualOpenSaturday: true,
          virtualOpenSaturdayTime: 1300,
          virtualClosedSaturdayTime: 1700,
          virtualOpenSunday: false,
          virtualOpenSundayTime: 1300,
          virtualClosedSundayTime: 1700,
          // virtualLunchDuration: 60,
          // virtualLunchTime: 1200,
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
        { merge: true },
      )
      .then(async () => {
        console.log("BOOKING CONFIGURATION COMPLETE");
        // if (environment.type !== "production") generateTestBookingData();
        if (environment.type !== "production") {
          admin
            .firestore()
            .collection("alerts")
            .doc("banner")
            .set(
              {
                color: "#DAAA00",
                message:
                  "MOBILE - This is your own personal local development environment...",
                title: "Welcome!",
                link: "/contact",
                isActiveMobile: true,
                icon: "info-circle",
              },
              { merge: true },
            )
            .then(async () => {
              console.log("MOBILE ALERT BANNER SETUP COMPLETE");
              return true;
            });
          admin
            .firestore()
            .collection("alerts")
            .doc("banner_web")
            .set(
              {
                color: "#DAAA00",
                message:
                  "WEB - This is your own personal local development environment...",
                title: "Welcome!",
                link: "/contact",
                isActive: true,
                icon: "info-circle",
              },
              { merge: true },
            )
            .then(async () => {
              console.log("WEB ALERT BANNER SETUP COMPLETE");
              return true;
            });
        }
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
