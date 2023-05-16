import { getAuthUserById } from "./auth/getAuthUserById";
import { admin, stripe, throwError, functions } from "../config/config";
import { updateProVetAppointment } from "../integrations/provet/entities/appointment/updateProVetAppointment";
import { updateProVetClient } from "../integrations/provet/entities/client/updateProVetClient";
import { fetchEntity } from "../integrations/provet/entities/fetchEntity";
import { updateProVetPatient } from "../integrations/provet/entities/patient/updateProVetPatient";
import { sendNotification } from "../notifications/sendNotification";
import { getCustomerId } from "./getCustomerId";
import { getProVetIdFromUrl } from "./getProVetIdFromUrl";
import { deleteCollection } from "./deleteCollection";
import * as client from "@sendgrid/client";
client.setApiKey(functions.config()?.sendgrid.api_key);
const sendGridAPI = client;
const DEBUG = true;
export const deleteAllAccountData = async (
  uid: string,
  deleteAuthAccount = true
): Promise<boolean> => {
  const { email } = await getAuthUserById(uid, ["email", "displayName"]);
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
        "deleteMoVETAccount => QUERY STRING =>`)",
        encodeURI(`?email__is=${email}&archived__is=0`)
      );

    const proVetClientIds = matchingProVetClients.map(
      (client: any) => client?.id
    );
    clientIds = proVetClientIds;
    if (DEBUG) {
      console.log(
        "deleteMoVETAccount => matchingProVetClients",
        matchingProVetClients
      );
      console.log("deleteMoVETAccount => proVetClientIds", proVetClientIds);
    }
    if (proVetClientIds) {
      const proVetPatientIds: Array<number> = [];
      matchingProVetClients.map(
        (client: any) =>
          client?.patients.length &&
          client?.patients.map((patient: string) =>
            proVetPatientIds.push(getProVetIdFromUrl(patient) as number)
          )
      );
      patientIds = proVetPatientIds;
      if (DEBUG)
        console.log("deleteMoVETAccount => proVetPatientIds", proVetPatientIds);

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
        if (DEBUG)
          console.log(
            "deleteMoVETAccount => ARCHIVING APPOINTMENTS: ",
            proVetAppointmentIds
          );
        await Promise.all(
          proVetAppointmentIds.map(
            async (id: number) =>
              await updateProVetAppointment({ id, active: 0 })
          )
        );
      } else if (DEBUG)
        console.log(
          "deleteMoVETAccount => NO FUTURE APPOINTMENTS FOUND",
          proVetAppointmentIds
        );

      if (proVetPatientIds.length) {
        if (DEBUG)
          console.log(
            "deleteMoVETAccount => ARCHIVING PATIENTS: ",
            proVetPatientIds
          );
        await Promise.all(
          proVetPatientIds.map(
            async (id: number) =>
              await updateProVetPatient({ id: `${id}`, archived: true })
          )
        );
      } else if (DEBUG)
        console.log(
          "deleteMoVETAccount => NO PATIENTS FOUND",
          proVetPatientIds
        );

      if (proVetClientIds.length) {
        if (DEBUG)
          console.log(
            "deleteMoVETAccount => ARCHIVING CLIENTS: ",
            proVetClientIds
          );
        await Promise.all(
          proVetClientIds.map(
            async (id: number) =>
              await updateProVetClient({ id: id, archived: true })
          )
        );
      } else if (DEBUG)
        console.log("deleteMoVETAccount => NO CLIENTS FOUND", proVetPatientIds);
    }
  } else {
    const proVetClient = await fetchEntity("client", Number(uid));
    clientIds = proVetClient;
    if (DEBUG) console.log("deleteMoVETAccount => proVetClient", proVetClient);
    if (proVetClient) {
      const proVetPatientIds: Array<number> = [];
      if (proVetClient?.patients?.length > 0)
        proVetClient?.patients.map((patient: string) =>
          proVetPatientIds.push(getProVetIdFromUrl(patient) as number)
        );

      patientIds = proVetPatientIds;
      if (DEBUG)
        console.log("deleteMoVETAccount => proVetPatientIds", proVetPatientIds);

      let proVetAppointmentIds: Array<number> = [];

      if (DEBUG)
        console.log(
          "QUERY STRING =>",
          `?client__eq=${uid}&active=1
          &start__gte=${new Date().toISOString().split("T")[0]}%2000:00%2B00:00`
        );
      const appointments = await fetchEntity(
        "appointment",
        null,
        `?client__eq=${uid}&active=1&start__gte=${
          new Date().toISOString().split("T")[0]
        }%2000:00%2B00:00`
      );
      if (appointments.length > 0)
        proVetAppointmentIds = appointments.map(
          (appointment: any) => appointment?.id
        );

      appointmentIds = proVetAppointmentIds;
      if (proVetAppointmentIds.length) {
        if (DEBUG)
          console.log(
            "deleteMoVETAccount => ARCHIVING APPOINTMENTS: ",
            proVetAppointmentIds
          );
        await Promise.all(
          proVetAppointmentIds.map(
            async (id: number) =>
              await updateProVetAppointment({ id, active: 0 })
          )
        );
      } else if (DEBUG)
        console.log(
          "deleteMoVETAccount => NO FUTURE APPOINTMENTS FOUND",
          proVetAppointmentIds
        );

      if (proVetPatientIds.length > 0) {
        if (DEBUG)
          console.log(
            "deleteMoVETAccount => ARCHIVING PATIENTS: ",
            proVetPatientIds
          );
        await Promise.all(
          proVetPatientIds.map(
            async (id: number) =>
              await updateProVetPatient({ id: `${id}`, archived: true })
          )
        );
      } else if (DEBUG)
        console.log(
          "deleteMoVETAccount => NO PATIENTS FOUND",
          proVetPatientIds
        );

      // await updateProVetClient({ id: uid, archived: true }).catch(
      //   (error: any) => DEBUG && console.log(error)
      // );
    }
  }
  const customerId = await getCustomerId(uid, true);

  if (DEBUG) console.log("deleteMoVETAccount => customerId", customerId);

  if (customerId)
    stripe.customers
      .del(customerId)
      .then(
        (result) =>
          DEBUG &&
          console.log("deleteMoVETAccount => STRIPE CUSTOMER DELETED: ", result)
      )
      .catch((error: any) => DEBUG && console.log(error));

  let clientSendgridId: any = null;
  await sendGridAPI
    .request({
      url: "/v3/marketing/contacts/search",
      method: "POST",
      body: {
        query: `email LIKE '${email}%'`,
      },
    })
    .then(([response]: any) => {
      if (DEBUG) {
        console.log(response.statusCode);
        console.log(response.body);
      }
      clientSendgridId = response.body.result[0].id;
      if (DEBUG) console.log("clientSendgridId", clientSendgridId);
    })
    .catch((error: any) => throwError(error));

  if (clientSendgridId)
    sendGridAPI
      .request({
        url: "/v3/marketing/contacts",
        method: "DELETE",
        qs: { ids: clientSendgridId },
      })
      .then(([response]: any) => {
        if (DEBUG) {
          console.log("DELETING CLIENT FROM SENDGRID", {
            email,
            clientSendgridId,
          });
          console.log(response.statusCode);
          console.log(response.body);
        }
      })
      .catch((error: any) => throwError(error));
  else if (DEBUG) console.log("NO CLIENT SENDGRID ID FOUND", email);
  deleteCollection(`clients/${uid}/notifications`)
    .then(() => DEBUG && console.log(`DELETED clients/${uid}/notifications`))
    .catch((error: any) => console.log(error));

  deleteCollection(`clients/${uid}/chat`)
    .then(() => DEBUG && console.log(`DELETED clients/${uid}/chat`))
    .catch((error: any) => console.log(error));

  deleteCollection(`clients/${uid}/payment_methods`)
    .then(() => DEBUG && console.log(`DELETED clients/${uid}/payment_methods`))
    .catch((error: any) => console.log(error));

  deleteCollection(`clients/${uid}/logs`)
    .then(() => DEBUG && console.log(`DELETED clients/${uid}/logs`))
    .catch((error: any) => console.log(error));

  deleteCollection(`clients/${uid}/invoices`)
    .then(() => DEBUG && console.log(`DELETED clients/${uid}/invoices`))
    .catch((error: any) => console.log(error));

  admin
    .firestore()
    .collection("clients")
    .doc(uid)
    .delete()
    .then(
      () =>
        DEBUG &&
        console.log(
          "deleteMoVETAccount => FIRESTORE CLIENT RECORD DELETED: ",
          uid
        )
    )
    .catch((error: any) => DEBUG && console.log(error));

  if (deleteAuthAccount)
    admin
      .auth()
      .deleteUser(uid)
      .then(() => {
        console.log("deleteMoVETAccount => Successfully deleted user");
      })
      .catch((error: any) => DEBUG && console.log(error));

  sendNotification({
    type: "slack",
    payload: {
      message: `:red_circle: ALL MoVET Account & Data has been DELETED for Client #${uid} =>\n\`\`\`${JSON.stringify(
        {
          clientIds,
          patientIds,
          appointmentIds,
          customerId,
        }
      )}\`\`\``,
    },
  });
  return true;
};
