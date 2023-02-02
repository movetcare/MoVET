import { getAuthUserById } from "./auth/getAuthUserById";
import { admin, environment, stripe } from "../config/config";
import { updateProVetAppointment } from "../integrations/provet/entities/appointment/updateProVetAppointment";
import { updateProVetClient } from "../integrations/provet/entities/client/updateProVetClient";
import { fetchEntity } from "../integrations/provet/entities/fetchEntity";
import { updateProVetPatient } from "../integrations/provet/entities/patient/updateProVetPatient";
import { sendNotification } from "../notifications/sendNotification";
import { getCustomerId } from "./getCustomerId";
import { getProVetIdFromUrl } from "./getProVetIdFromUrl";
import { deleteCollection } from "./deleteCollection";
const DEBUG = environment.type === "production";
export const deleteAllAccountData = async (client: {
  uid: string;
}): Promise<boolean> => {
  const { email } = await getAuthUserById(client?.uid, [
    "email",
    "displayName",
  ]);
  if (DEBUG) console.log("deleteMoVETAccount =>", email);
  let clientIds, patientIds, appointmentIds;
  if (email) {
    const matchingProVetClients = await fetchEntity(
      "client",
      null,
      encodeURI(`?email__is=${email}&archived__is=0`)
    );
    if (DEBUG)
      console.log(
        "QUERY STRING =>`)",
        encodeURI(`?email__is=${email}&archived__is=0`)
      );

    const proVetClientIds = matchingProVetClients.map(
      (client: any) => client?.id
    );
    clientIds = proVetClientIds;
    if (DEBUG) {
      console.log("matchingProVetClients", matchingProVetClients);
      console.log("proVetClientIds", proVetClientIds);
    }

    const proVetPatientIds: Array<number> = [];
    matchingProVetClients.map(
      (client: any) =>
        client?.patients.length &&
        client?.patients.map((patient: string) =>
          proVetPatientIds.push(getProVetIdFromUrl(patient) as number)
        )
    );
    patientIds = proVetPatientIds;
    if (DEBUG) console.log("proVetPatientIds", proVetPatientIds);

    let proVetAppointmentIds: Array<number> = [];

    await Promise.all(
      proVetClientIds.map(async (id: number) => {
        if (DEBUG)
          console.log(
            "QUERY STRING =>",
            `?client__eq=${id}&active=1
          &start__gte=${new Date().toISOString().split("T")[0]}%2000:00%2B00:00`
          );
        const appointments = await fetchEntity(
          "appointment",
          null,
          `?client__eq=${id}&active=1&start__gte=${
            new Date().toISOString().split("T")[0]
          }%2000:00%2B00:00`
        );
        if (appointments.length)
          proVetAppointmentIds = appointments.map(
            (appointment: any) => appointment?.id
          );
      })
    );
    appointmentIds = proVetAppointmentIds;
    if (proVetAppointmentIds.length) {
      if (DEBUG) console.log("ARCHIVING APPOINTMENTS: ", proVetAppointmentIds);
      await Promise.all(
        proVetAppointmentIds.map(
          async (id: number) => await updateProVetAppointment({ id, active: 0 })
        )
      );
    } else if (DEBUG)
      console.log("NO FUTURE APPOINTMENTS FOUND", proVetAppointmentIds);

    if (proVetPatientIds.length) {
      if (DEBUG) console.log("ARCHIVING PATIENTS: ", proVetPatientIds);
      await Promise.all(
        proVetPatientIds.map(
          async (id: number) =>
            await updateProVetPatient({ id: `${id}`, archived: true })
        )
      );
    } else if (DEBUG) console.log("NO PATIENTS FOUND", proVetPatientIds);

    if (proVetClientIds.length) {
      if (DEBUG) console.log("ARCHIVING CLIENTS: ", proVetClientIds);
      await Promise.all(
        proVetClientIds.map(
          async (id: number) =>
            await updateProVetClient({ id: id, archived: true })
        )
      );
    } else if (DEBUG) console.log("NO CLIENTS FOUND", proVetPatientIds);
  } else {
    const proVetClient = await fetchEntity("client", Number(client?.uid));
    clientIds = proVetClient;
    if (DEBUG) console.log("proVetClient", proVetClient);

    const proVetPatientIds: Array<number> = [];
    if (proVetClient?.patients.length)
      proVetClient?.patients.map((patient: string) =>
        proVetPatientIds.push(getProVetIdFromUrl(patient) as number)
      );

    patientIds = proVetPatientIds;
    if (DEBUG) console.log("proVetPatientIds", proVetPatientIds);

    let proVetAppointmentIds: Array<number> = [];

    if (DEBUG)
      console.log(
        "QUERY STRING =>",
        `?client__eq=${client?.uid}&active=1
          &start__gte=${new Date().toISOString().split("T")[0]}%2000:00%2B00:00`
      );
    const appointments = await fetchEntity(
      "appointment",
      null,
      `?client__eq=${client?.uid}&active=1&start__gte=${
        new Date().toISOString().split("T")[0]
      }%2000:00%2B00:00`
    );
    if (appointments.length)
      proVetAppointmentIds = appointments.map(
        (appointment: any) => appointment?.id
      );

    appointmentIds = proVetAppointmentIds;
    if (proVetAppointmentIds.length) {
      if (DEBUG) console.log("ARCHIVING APPOINTMENTS: ", proVetAppointmentIds);
      await Promise.all(
        proVetAppointmentIds.map(
          async (id: number) => await updateProVetAppointment({ id, active: 0 })
        )
      );
    } else if (DEBUG)
      console.log("NO FUTURE APPOINTMENTS FOUND", proVetAppointmentIds);

    if (proVetPatientIds.length) {
      if (DEBUG) console.log("ARCHIVING PATIENTS: ", proVetPatientIds);
      await Promise.all(
        proVetPatientIds.map(
          async (id: number) =>
            await updateProVetPatient({ id: `${id}`, archived: true })
        )
      );
    } else if (DEBUG) console.log("NO PATIENTS FOUND", proVetPatientIds);

    await updateProVetClient({ id: client?.uid, archived: true });
  }
  const customerId = await getCustomerId(client?.uid, true);

  if (DEBUG) console.log("customerId", customerId);

  if (customerId)
    stripe.customers
      .del(customerId)
      .then(
        (result) => DEBUG && console.log("STRIPE CUSTOMER DELETED: ", result)
      )
      .catch((error: any) => console.error(error));

  deleteCollection(`clients/${client?.uid}/notifications`)
    .then(
      () => DEBUG && console.log(`DELETED clients/${client?.uid}/notifications`)
    )
    .catch((error: any) => console.error(error));

  deleteCollection(`clients/${client?.uid}/payment_methods`)
    .then(
      () =>
        DEBUG && console.log(`DELETED clients/${client?.uid}/payment_methods`)
    )
    .catch((error: any) => console.error(error));

  deleteCollection(`clients/${client?.uid}/logs`)
    .then(() => DEBUG && console.log(`DELETED clients/${client?.uid}/logs`))
    .catch((error: any) => console.error(error));

  deleteCollection(`clients/${client?.uid}/invoices`)
    .then(() => DEBUG && console.log(`DELETED clients/${client?.uid}/invoices`))
    .catch((error: any) => console.error(error));

  admin
    .firestore()
    .collection("clients")
    .doc(client?.uid)
    .delete()
    .then(
      () =>
        DEBUG && console.log("FIRESTORE CLIENT RECORD DELETED: ", client?.uid)
    )
    .catch((error: any) => console.error(error));

  sendNotification({
    type: "slack",
    payload: {
      message: `MoVET Account and Data Archived for ${
        client?.uid
      } => ${JSON.stringify({
        clientIds,
        patientIds,
        appointmentIds,
        customerId,
      })}`,
    },
  });
  return true;
};
