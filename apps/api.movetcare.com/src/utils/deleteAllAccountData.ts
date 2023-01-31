import { getAuthUserById } from "./auth/getAuthUserById";
import { admin, environment, stripe } from "../config/config";
import { updateProVetAppointment } from "../integrations/provet/entities/appointment/updateProVetAppointment";
import { updateProVetClient } from "../integrations/provet/entities/client/updateProVetClient";
import { fetchEntity } from "../integrations/provet/entities/fetchEntity";
import { updateProVetPatient } from "../integrations/provet/entities/patient/updateProVetPatient";
import { sendNotification } from "../notifications/sendNotification";
import { getCustomerId } from "./getCustomerId";
import { getProVetIdFromUrl } from "./getProVetIdFromUrl";
const DEBUG = environment.type === "production";
export const deleteAllAccountData = async (user: { uid: string }) => {
  const { email } = await getAuthUserById(user?.uid, ["email", "displayName"]);
  if (DEBUG) console.log("deleteMoVETAccount =>", email);

  const matchingProVetClients = await fetchEntity(
    "client",
    null,
    // `?email__is=${email}&archived__is=0`
    encodeURI(`?email__is=${email}`)
  );
  if (DEBUG) console.log("QUERY STRING =>`)", encodeURI(`?email__is=${email}`));

  const proVetClientIds = matchingProVetClients.map(
    (client: any) => client?.id
  );

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

  const customerId = await getCustomerId(user?.uid, true);

  if (DEBUG) console.log("customerId", customerId);

  if (customerId)
    stripe.customers
      .del(customerId)
      .then(
        (result) => DEBUG && console.log("STRIPE CUSTOMER DELETED: ", result)
      );

  await admin
    .firestore()
    .collection("clients")
    .doc(user?.uid)
    .delete()
    .then(
      () => DEBUG && console.log("FIRESTORE CLIENT RECORD DELETED: ", user?.uid)
    );

  sendNotification({
    type: "slack",
    payload: {
      message: `MoVET Account and Data Archived for ${
        user?.email
      } => ${JSON.stringify({
        proVetClientIds,
        proVetPatientIds,
        proVetAppointmentIds,
        customerId,
      })}`,
    },
  });
};
