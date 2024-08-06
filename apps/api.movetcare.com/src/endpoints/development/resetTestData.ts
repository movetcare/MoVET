/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Response } from "express";
import {
  functions,
  defaultRuntimeOptions,
  admin,
  stripe,
  mobileClientApiKey,
  DEBUG,
} from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";
import { updateProVetAppointment } from "../../integrations/provet/entities/appointment/updateProVetAppointment";
import { fetchEntity } from "../../integrations/provet/entities/fetchEntity";
export const resetTestData: Promise<Response> = functions
  .runWith(defaultRuntimeOptions)
  .https.onRequest(async (request: any, response: any) => {
    if (request.body?.apiKey === mobileClientApiKey) {
      if (request.body?.id === 6008) {
        await admin
          .firestore()
          .collection("bookings")
          .where("client.uid", "==", "6008")
          .get()
          .then((querySnapshot: any) =>
            querySnapshot.forEach((doc: any) => {
              doc.ref.delete();
              DEBUG &&
                console.log(
                  "Successfully Deleted Booking Document for Client 6008",
                  doc.id,
                );
            }),
          )
          .catch((error: any) => DEBUG && console.error(error));
        const client = await fetchEntity("client", 6008);
        let proVetAppointmentIds: Array<number> = [];
        if (DEBUG)
          console.log(
            "QUERY STRING =>",
            `?client__eq=${client?.id}&active=1
            &start__gte=${
              new Date().toISOString().split("T")[0]
            }%2000:00%2B00:00`,
          );
        const appointments = await fetchEntity(
          "appointment",
          null,
          `?client__eq=${client?.id}&active=1&start__gte=${
            new Date().toISOString().split("T")[0]
          }%2000:00%2B00:00`,
        );
        if (appointments.length)
          proVetAppointmentIds = appointments.map(
            (appointment: any) => appointment?.id,
          );

        if (proVetAppointmentIds.length) {
          if (DEBUG)
            console.log("ARCHIVING APPOINTMENTS: ", proVetAppointmentIds);
          Promise.all(
            proVetAppointmentIds.map((id: number) =>
              updateProVetAppointment({ id, active: 0 }),
            ),
          );
        } else if (DEBUG)
          console.log("NO FUTURE APPOINTMENTS FOUND", proVetAppointmentIds);
      } else if (request.body?.id === 5769) {
        await disableWinterMode();
        await admin
          .auth()
          .updateUser("5769", {
            phoneNumber: null,
            displayName: null,
          })
          .then(
            (userRecord: any) =>
              DEBUG &&
              console.log(
                "Successfully Updated Auth User",
                userRecord.toJSON(),
              ),
          )
          .catch((error: any) => DEBUG && console.error(error));
        await admin
          .firestore()
          .collection("bookings")
          .where("client.uid", "==", "5769")
          .get()
          .then((querySnapshot: any) =>
            querySnapshot.forEach((doc: any) => {
              doc.ref.delete();
              DEBUG &&
                console.log(
                  "Successfully Deleted Booking Document Client 5769",
                  doc.id,
                );
            }),
          )
          .catch((error: any) => DEBUG && console.error(error));
        await admin
          .firestore()
          .collection("clients")
          .doc("5769")
          .delete()
          .then(
            () =>
              DEBUG &&
              console.log("Successfully Deleted Client Document", 5769),
          )
          .catch((error: any) => DEBUG && console.error(error));
        const patients = admin
          .firestore()
          .collection("patients")
          .where("client", "==", 5769);
        patients
          .get()
          .then((querySnapshot: any) =>
            querySnapshot.forEach((doc: any) => {
              //if (doc.data()?.id !== 5769) {
              doc.ref.delete();
              if (DEBUG)
                console.log("Successfully Deleted Patient Document", doc.id);
              //}
            }),
          )
          .catch((error: any) => DEBUG && console.error(error));

        const client = await fetchEntity("client", 5769);

        // const proVetPatientIds: Array<number> = [];
        // if (client?.patients.length)
        //   client?.patients.map((patient: string) =>
        //     proVetPatientIds.push(getProVetIdFromUrl(patient) as number)
        //   );

        // if (DEBUG) console.log("proVetPatientIds", proVetPatientIds);

        let proVetAppointmentIds: Array<number> = [];

        if (DEBUG)
          console.log(
            "QUERY STRING =>",
            `?client__eq=${client?.id}&active=1
            &start__gte=${
              new Date().toISOString().split("T")[0]
            }%2000:00%2B00:00`,
          );
        const appointments = await fetchEntity(
          "appointment",
          null,
          `?client__eq=${client?.id}&active=1&start__gte=${
            new Date().toISOString().split("T")[0]
          }%2000:00%2B00:00`,
        );
        if (appointments.length)
          proVetAppointmentIds = appointments.map(
            (appointment: any) => appointment?.id,
          );

        if (proVetAppointmentIds.length) {
          if (DEBUG)
            console.log("ARCHIVING APPOINTMENTS: ", proVetAppointmentIds);
          Promise.all(
            proVetAppointmentIds.map((id: number) =>
              updateProVetAppointment({ id, active: 0 }),
            ),
          );
        } else if (DEBUG)
          console.log("NO FUTURE APPOINTMENTS FOUND", proVetAppointmentIds);

        // if (proVetPatientIds.length) {
        //   if (DEBUG) console.log("ARCHIVING PATIENTS: ", proVetPatientIds);
        //   await Promise.all(
        //     proVetPatientIds.map(
        //       async (id: number) =>
        //         await updateProVetPatient({ id: `${id}`, archived: true })
        //     )
        //   );
        // } else if (DEBUG) console.log("NO PATIENTS FOUND", proVetPatientIds);

        const paymentMethods: any = await stripe.paymentMethods
          .list({
            customer: "cus_Prf6RZhu7iELJN",
            type: "card",
          })
          .catch((error: any) => DEBUG && console.error(error));
        if (DEBUG) console.log("paymentMethods", paymentMethods);
        if (paymentMethods) {
          const paymentMethodIds = paymentMethods?.data?.map(
            (paymentMethod: { id: string }) => paymentMethod?.id,
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
                      paymentMethodId,
                    ),
                )
                .catch((error: any) => DEBUG && console.error(error)),
            ),
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
          .where("client.uid", "==", "6008")
          .get()
          .then((querySnapshot: any) =>
            querySnapshot.forEach((doc: any) => {
              doc.ref.delete();
              DEBUG &&
                console.log(
                  "Successfully Deleted Booking Document for Client 6008",
                  doc.id,
                );
            }),
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
            { merge: true },
          );
      } else if (request.body?.id === "winter-mode-off")
        await disableWinterMode();
      else if (
        request.body?.id ===
        "require_payment_method_to_request_an_appointment_on"
      )
        await admin
          .firestore()
          .collection("configuration")
          .doc("bookings")
          .set(
            {
              requirePaymentMethodToRequestAnAppointment: true,
              updatedOn: new Date(),
            },
            { merge: true },
          )
          .catch((error: any) => DEBUG && console.error(error));
      else if (
        request.body?.id ===
        "require_payment_method_to_request_an_appointment_off"
      )
        await admin
          .firestore()
          .collection("configuration")
          .doc("bookings")
          .set(
            {
              requirePaymentMethodToRequestAnAppointment: false,
              updatedOn: new Date(),
            },
            { merge: true },
          )
          .catch((error: any) => DEBUG && console.error(error));
      else if (request.body?.id === "wipe_test_data") {
        await admin
          .firestore()
          .collection("bookings")
          .where("client.firstName", "==", "TEST")
          .get()
          .then(async (querySnapshot: any) =>
            querySnapshot.forEach(async (doc: any) => {
              await doc.ref
                .delete()
                .then(
                  () =>
                    DEBUG &&
                    console.log(
                      "Successfully Deleted Test `bookings` Document",
                      doc.id,
                    ),
                )
                .catch((error: any) => DEBUG && console.error(error));
            }),
          )
          .catch((error: any) => DEBUG && console.error(error));
        await admin
          .firestore()
          .collection("bookings")
          .where("client.firstName", "==", "test")
          .get()
          .then(async (querySnapshot: any) =>
            querySnapshot.forEach(async (doc: any) => {
              await doc.ref
                .delete()
                .then(
                  () =>
                    DEBUG &&
                    console.log(
                      "Successfully Deleted Test `bookings` Document",
                      doc.id,
                    ),
                )
                .catch((error: any) => DEBUG && console.error(error));
            }),
          )
          .catch((error: any) => DEBUG && console.error(error));
        await admin
          .firestore()
          .collection("bookings")
          .where("client.firstName", "==", "CYPRESS")
          .get()
          .then(async (querySnapshot: any) =>
            querySnapshot.forEach(async (doc: any) => {
              await doc.ref
                .delete()
                .then(
                  () =>
                    DEBUG &&
                    console.log(
                      "Successfully Deleted Test `bookings` Document",
                      doc.id,
                    ),
                )
                .catch((error: any) => DEBUG && console.error(error));
            }),
          )
          .catch((error: any) => DEBUG && console.error(error));
        await admin
          .firestore()
          .collection("k9_smiles")
          .where("firstName", "==", "CYPRESS")
          .get()
          .then(async (querySnapshot: any) =>
            querySnapshot.forEach(async (doc: any) => {
              await doc.ref
                .delete()
                .then(
                  () =>
                    DEBUG &&
                    console.log(
                      "Successfully Deleted Test `k9_smiles` Document",
                      doc.id,
                    ),
                )
                .catch((error: any) => DEBUG && console.error(error));
            }),
          )
          .catch((error: any) => DEBUG && console.error(error));
        await admin
          .firestore()
          .collection("contact")
          .where("firstName", "==", "CYPRESS")
          .get()
          .then(async (querySnapshot: any) =>
            querySnapshot.forEach(async (doc: any) => {
              await doc.ref
                .delete()
                .then(
                  () =>
                    DEBUG &&
                    console.log(
                      "Successfully Deleted Test `contact` Document",
                      doc.id,
                    ),
                )
                .catch((error: any) => DEBUG && console.error(error));
            }),
          )
          .catch((error: any) => DEBUG && console.error(error));
      }
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
      { merge: true },
    )
    .catch((error: any) => DEBUG && console.error(error));
