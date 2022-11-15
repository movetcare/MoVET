import { admin, environment, throwError } from "../config/config";
import { CONTACT_STATUS } from "../constant";

export const configureBooking = async () => {
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
    return environment.type === "production"
      ? true
      : await generateTestBookingData();
  } else {
    console.log("STARTING BOOKING CONFIGURATION");
    return await admin
      .firestore()
      .collection("configuration")
      .doc("bookings")
      .set(
        {
          clinicMinorIllnessVcprReason: {
            value: 106,
            label: "Establish Care Exam",
          },
          clinicStandardVcprReason: {
            value: 106,
            label: "Establish Care Exam",
          },
          housecallMinorIllnessVcprReason: {
            value: 105,
            label: "Establish Care Exam",
          },
          housecallStandardVcprReason: {
            value: 105,
            label: "Establish Care Exam",
          },
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .then(async () => {
        console.log("BOOKING CONFIGURATION COMPLETE");
        return environment.type === "production"
          ? true
          : await generateTestBookingData();
      })
      .catch((error: any) => throwError(error));
  }
};

const generateTestBookingData = async () =>
  await admin
    .firestore()
    .collection("contact")
    .add({
      email: "alex.rodriguez+test@movetcare.com",
      firstName: "Alex",
      lastName: "Rodriguez",
      message:
        "TESTING 123... THIS IS JUST A TEST THAT IS AUTOMAGICALLY GENERATED WHEN THE DEV ENVIRONMENT IS SPUN UP!",
      phone: "3147360856",
      reason: { id: "appointment-request", name: "Appointment Request" },
      source: "app.movetcare.com",
      status: CONTACT_STATUS.NEEDS_PROCESSING,
      createdOn: new Date(),
    })
    .then(async () => {
      console.log("TEST CONTACT FORM BOOKING REQUEST COMPLETE");
      return await admin
        .firestore()
        .collection("bookings")
        .add({
          createdAt: new Date(),
          client: {
            uid: "5125",
            phoneNumber: "+1314 7360856",
            displayName: "Alex Rodriguez",
            email: "alex.rodriguez+test@movetcare.com",
          },
          vcprRequired: true,
          id: "T565UH1WjK7qN5gW6WH5",
          illPatients: ["5585", "5586"],
          nextPatient: null,
          illnessDetails: null,
          patients: [
            {
              gender: "Female, neutered",
              species: "Dog (Canine - Domestic)",
              vcprRequired: true,
              illnessDetails: {
                symptoms: ["Eye Infection"],
                notes: "Test Illness #2",
              },
              name: "TESTTESTTEST1",
              hasMinorIllness: true,
              value: "5585",
            },
            {
              gender: "Female, neutered",
              species: "Dog (Canine - Domestic)",
              vcprRequired: true,
              illnessDetails: {
                symptoms: ["Coughing", "Minor Cuts / Scrapes"],
                notes: "Test Illness #1",
              },
              name: "TESTTEST2",
              hasMinorIllness: true,
              value: "5586",
            },
            {
              gender: "Female, neutered",
              species: "Cat (Feline - Domestic)",
              vcprRequired: true,
              name: "VCPR TEST CAT 22",
              hasMinorIllness: false,
              value: "5587",
            },
          ],
          address: {
            zipcode: "80237",
            parts: [
              "4912",
              "South Newport Street",
              "Southeast",
              "Denver",
              "Denver County",
              "Colorado",
              "United States",
              "80237",
            ],
            placeId: "ChIJrfSG_-KGbIcRRls6Rip0HmM",
            full: "4912 S Newport St, Denver, CO 80237, USA",
            info: "Apartment #2A",
          },
          location: "Home",
          reason: {
            label: "Annual Exam - VCPR / Rabies (DVM)",
            value: 30,
          },
          requestedDateTime: {
            date: new Date(),
            time: "09:00",
          },
          step: "complete",
          isActive: false,
          updatedOn: new Date(),
        })
        .then(async () => {
          console.log("TEST BOOKING FLOW SUBMISSION COMPLETE");
          return await admin
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
    })
    .catch((error: any) => throwError(error));
