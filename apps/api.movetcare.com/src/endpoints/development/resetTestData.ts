import { Response } from "express";
import {
  functions,
  environment,
  defaultRuntimeOptions,
  admin,
  stripe,
  mobileClientApiKey,
} from "../../config/config";
// import { updateProVetAppointment } from "../../integrations/provet/entities/appointment/updateProVetAppointment";
// import { fetchEntity } from "../../integrations/provet/entities/fetchEntity";
// import { updateProVetPatient } from "../../integrations/provet/entities/patient/updateProVetPatient";
import { sendNotification } from "../../notifications/sendNotification";
// import { getProVetIdFromUrl } from "../../utils/getProVetIdFromUrl";
const DEBUG = environment.type === "production";
export const resetTestData: Promise<Response> = functions
  .runWith(defaultRuntimeOptions)
  .https.onRequest(async (request: any, response: any) => {
    if (
      environment.type === "development" &&
      request.headers.host === "localhost:5001" &&
      request.body?.apiKey === mobileClientApiKey
    ) {
      if (request.body?.id === 5749) {
        await admin
          .firestore()
          .collection("bookings")
          .where("client.uid", "==", "5749")
          .get()
          .then((querySnapshot: any) =>
            querySnapshot.forEach((doc: any) => {
              doc.ref.delete();
              DEBUG &&
                console.log("Successfully Deleted Booking Document", doc.id);
            })
          )
          .catch((error: any) => DEBUG && console.error(error));
      } else if (request.body?.id === 5747) {
        await disableWinterMode();
        await admin
          .auth()
          .updateUser("5747", {
            phoneNumber: null,
            displayName: null,
          })
          .then(
            (userRecord: any) =>
              DEBUG &&
              console.log("Successfully Updated Auth User", userRecord.toJSON())
          )
          .catch((error: any) => DEBUG && console.error(error));
        await admin
          .firestore()
          .collection("bookings")
          .where("client.uid", "==", "5747")
          .get()
          .then((querySnapshot: any) =>
            querySnapshot.forEach((doc: any) => {
              doc.ref.delete();
              DEBUG &&
                console.log("Successfully Deleted Booking Document", doc.id);
            })
          )
          .catch((error: any) => DEBUG && console.error(error));
        await admin
          .firestore()
          .collection("clients")
          .doc("5747")
          .delete()
          .then(
            () =>
              DEBUG && console.log("Successfully Deleted Client Document", 5747)
          )
          .catch((error: any) => DEBUG && console.error(error));
        const patients = admin
          .firestore()
          .collection("patients")
          .where("client", "==", 5747);
        patients
          .get()
          .then((querySnapshot: any) =>
            querySnapshot.forEach((doc: any) => {
              //if (doc.data()?.id !== 5747) {
              doc.ref.delete();
              if (DEBUG)
                console.log("Successfully Deleted Patient Document", doc.id);
              //}
            })
          )
          .catch((error: any) => DEBUG && console.error(error));

        // const client = await fetchEntity("client", 5747);

        // const proVetPatientIds: Array<number> = [];
        // if (client?.patients.length)
        //   client?.patients.map((patient: string) =>
        //     proVetPatientIds.push(getProVetIdFromUrl(patient) as number)
        //   );

        // if (DEBUG) console.log("proVetPatientIds", proVetPatientIds);

        // let proVetAppointmentIds: Array<number> = [];

        // if (DEBUG)
        //   console.log(
        //     "QUERY STRING =>",
        //     `?client__eq=${client?.id}&active=1
        //     &start__gte=${new Date().toISOString().split("T")[0]}%2000:00%2B00:00`
        //   );
        // const appointments = await fetchEntity(
        //   "appointment",
        //   null,
        //   `?client__eq=${client?.id}&active=1&start__gte=${
        //     new Date().toISOString().split("T")[0]
        //   }%2000:00%2B00:00`
        // );
        // if (appointments.length)
        //   proVetAppointmentIds = appointments.map(
        //     (appointment: any) => appointment?.id
        //   );

        // if (proVetAppointmentIds.length) {
        //   if (DEBUG)
        //     console.log("ARCHIVING APPOINTMENTS: ", proVetAppointmentIds);
        //   Promise.all(
        //     proVetAppointmentIds.map((id: number) =>
        //       updateProVetAppointment({ id, active: 0 })
        //     )
        //   );
        // } else if (DEBUG)
        //   console.log("NO FUTURE APPOINTMENTS FOUND", proVetAppointmentIds);

        // if (proVetPatientIds.length) {
        //   if (DEBUG) console.log("ARCHIVING PATIENTS: ", proVetPatientIds);
        //   await Promise.all(
        //     proVetPatientIds.map(
        //       async (id: number) =>
        //         await updateProVetPatient({ id: `${id}`, archived: true })
        //     )
        //   );
        // } else if (DEBUG) console.log("NO PATIENTS FOUND", proVetPatientIds);

        const paymentMethods = await stripe.paymentMethods
          .list({
            customer: "cus_NHh7gfsz2LsVnp",
            type: "card",
          })
          .catch((error: any) => DEBUG && console.error(error));
        if (DEBUG) console.log("paymentMethods", paymentMethods);
        if (paymentMethods) {
          const paymentMethodIds = paymentMethods?.data?.map(
            (paymentMethod) => paymentMethod?.id
          );
          if (DEBUG) console.log("paymentMethodIds", paymentMethodIds);
          Promise.all(
            paymentMethodIds.map((paymentMethodId: string) =>
              stripe.paymentMethods
                .detach(paymentMethodId)
                .then(
                  () =>
                    DEBUG &&
                    console.log(
                      "Successfully Deleted Client Payment Method",
                      paymentMethodId
                    )
                )
                .catch((error: any) => DEBUG && console.error(error))
            )
          ).catch((error: any) => DEBUG && console.error(error));
        }
        sendNotification({
          type: "slack",
          payload: {
            message: ":red_circle: TEST DATA RESET FOR dev+test@movetcare.com",
          },
        });
      } else if (request.body?.id === "winter-mode-on") {
        await admin
          .firestore()
          .collection("bookings")
          .where("client.uid", "==", "5749")
          .get()
          .then((querySnapshot: any) =>
            querySnapshot.forEach((doc: any) => {
              doc.ref.delete();
              DEBUG &&
                console.log("Successfully Deleted Booking Document", doc.id);
            })
          )
          .catch((error: any) => DEBUG && console.error(error));
        const today = new Date();
        await admin
          .firestore()
          .collection("configuration")
          .doc("bookings")
          .set(
            {
              winterHousecallMode: {
                startDate: new Date(),
                endDate: new Date(today.setDate(today.getDate() + 5)),
                message:
                  "Due to weather variability housecalls are by request only beginning Wednesday, Dec 21st. Normal scheduling will reopen Monday, April 3rd.",
                isActiveOnWebsite: true,
                isActiveOnMobileApp: true,
                isActiveOnWebApp: true,
                enableForNewPatientsOnly: true,
              },
              updatedOn: new Date(),
            },
            { merge: true }
          );
      } else if (request.body?.id === "winter-mode-off")
        await disableWinterMode();
    }
    return response.status(200).send();
  });

const disableWinterMode = async () =>
  await admin
    .firestore()
    .collection("configuration")
    .doc("bookings")
    .set(
      {
        winterHousecallMode: {
          isActiveOnWebsite: false,
          isActiveOnMobileApp: false,
          isActiveOnWebApp: false,
          enableForNewPatientsOnly: false,
        },
        updatedOn: new Date(),
      },
      { merge: true }
    )
    .catch((error: any) => DEBUG && console.error(error));
