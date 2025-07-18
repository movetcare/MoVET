import { updateCustomField } from "./../patient/updateCustomField";
import { throwError, admin } from "../../../../config/config";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { fetchEntity } from "../fetchEntity";
import { Request, Response } from "express";
import { sendNotification } from "../../../../notifications/sendNotification";
import { truncateString } from "../../../../utils/truncateString";
import { savePatient } from "../patient/savePatient";

const DEBUG = true;
export const processConsultationWebhook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  if (
    !(typeof request.body.consultation_id === "string") ||
    request.body.consultation_id.length === 0
  )
    throwError({
      message: "INVALID_PAYLOAD => " + JSON.stringify(request.body),
    });
  try {
    const proVetConsultationData = await fetchEntity(
      "consultation",
      request.body?.consultation_id,
    );
    if (DEBUG)
      console.log(
        "processConsultationWebhook => proVetConsultationData",
        proVetConsultationData,
      );
    // admin
    //   .firestore()
    //   .collection("consultations")
    //   .doc(`${proVetConsultationData?.id}`)
    //   .set(
    //     {
    //       client: proVetConsultationData?.client,
    //       patients: proVetConsultationData?.patients.forEach((patientId: string) =>
    //         getProVetIdFromUrl(patientId),
    //       ),
    //       complaint: proVetConsultationData?.complaint,
    //       reason: getProVetIdFromUrl(proVetConsultationData?.complaint_type),
    //       admitted: new Date(proVetConsultationData?.admitted_time),
    //       firstEntry: new Date(proVetConsultationData?.first_entry),
    //       started: new Date(proVetConsultationData?.started),
    //       ended: new Date(proVetConsultationData?.ended),
    //       finished: new Date(proVetConsultationData?.finished),
    //       consultationItems: proVetConsultationData?.consultation_items.forEach(
    //         (consultationItemUrl: string) =>
    //           getProVetIdFromUrl(consultationItemUrl),
    //       ),
    //       consultationNotes: proVetConsultationData?.consultation_notes.forEach(
    //         (consultationNoteUrl: string) =>
    //           getProVetIdFromUrl(consultationNoteUrl),
    //       ),
    //       consultationDiagnosis:
    //         proVetConsultationData?.consultation_diagnosis.forEach(
    //           (consultationDiagnosisUrl: string) =>
    //             getProVetIdFromUrl(consultationDiagnosisUrl),
    //         ),
    //       consultationDischargeInstructions:
    //         proVetConsultationData?.consultation_dischargeinstructions.forEach(
    //           (consultationDischargeInstructionsUrl: string) =>
    //             getProVetIdFromUrl(consultationDischargeInstructionsUrl),
    //         ),
    //       consultationPatientStatus:
    //         proVetConsultationData?.consultation_patient_status.forEach(
    //           (consultationPatientStatusUrl: string) =>
    //             getProVetIdFromUrl(consultationPatientStatusUrl),
    //         ),
    //       customFields: proVetConsultationData?.custom_fields.forEach(
    //         (customFieldUrl: string) => getProVetIdFromUrl(customFieldUrl),
    //       ),
    //       created: new Date(proVetConsultationData?.created),
    //       modified: new Date(proVetConsultationData?.modified),
    //       updatedOn: new Date(),
    //       type: proVetConsultationData?.type,
    //       status: proVetConsultationData?.status,
    //     },
    //     { merge: true },
    //   );
    // if (
    //   proVetConsultationData?.consultation_items &&
    //   proVetConsultationData?.consultation_items?.length > 0
    // ) {
    //   if (DEBUG)
    //     console.log(
    //       "CONSULTATION ITEMS => ",
    //       proVetConsultationData?.consultation_items,
    //     );
    //   proVetConsultationData?.consultation_items.forEach(
    //     async (noteUrl: string) => {
    //       const consultationNote = await fetchEntity(
    //         "consultationnote",
    //         getProVetIdFromUrl(noteUrl),
    //       );
    //       if (DEBUG) console.log("CONSULTATION NOTE", consultationNote);
    //       if (consultationNote) {
    //         admin.firestore;
    //       }
    //     },
    //   );
    // }
    if (
      proVetConsultationData?.status === 9 ||
      proVetConsultationData?.status === 8
    ) {
      // Place appointment summary in queue...
      if (proVetConsultationData?.status === 9) {
        const appointmentEndedFromInvoicePaymentSuccess = await admin
          .firestore()
          .collection("appointments")
          .doc(`${getProVetIdFromUrl(proVetConsultationData?.appointment)}`)
          .get()
          .then(async (doc: any) => doc.data()?.appointmentEndedAt)
          .catch((error: any) => throwError(error));
        if (DEBUG)
          console.log(
            "processConsultationWebhook => appointmentEndedFromInvoicePaymentSuccess",
            appointmentEndedFromInvoicePaymentSuccess,
          );
        if (!appointmentEndedFromInvoicePaymentSuccess) {
          admin
            .firestore()
            .collection("appointments")
            .doc(`${getProVetIdFromUrl(proVetConsultationData?.appointment)}`)
            .set(
              {
                status: "COMPLETE",
                appointmentEndedAt: new Date(),
                updatedOn: new Date(),
              },
              { merge: true },
            )
            .then(async () => {
              sendNotification({
                type: "push",
                payload: {
                  user: {
                    uid: getProVetIdFromUrl(proVetConsultationData?.client),
                  },
                  category: "client-appointment",
                  title: "Your MoVET Invoice is Paid!",
                  message: truncateString(
                    "Please leave us a review on the services you received today",
                  ),
                  path: "/home/",
                },
              });
            })
            .catch((error: any) => throwError(error));
          // TODO: replace with checking consultation items for patients with established care and vcpr items
          const vcprEstablishedIds: Array<number> = [];
          if (DEBUG) {
            console.log(
              "processConsultationWebhook => proVetConsultationData?.invoice",
              proVetConsultationData?.invoice,
            );
          }
          await admin
            .firestore()
            .collection("client_invoices")
            .doc(`${getProVetIdFromUrl(proVetConsultationData?.invoice)}`)
            .collection("items")
            .get()
            .then((snapshot: any) => {
              snapshot.docs.forEach((doc: any) => {
                if (DEBUG) {
                  console.log(
                    "processConsultationWebhook => item?.name includes 'establish care' or 'vcpr'",
                    doc
                      .data()
                      ?.name?.toLowerCase()
                      ?.includes("establish care") ||
                      doc.data()?.name?.toLowerCase()?.includes("vcpr"),
                  );
                }
                if (
                  doc.data()?.name?.toLowerCase()?.includes("establish care") ||
                  doc.data()?.name?.toLowerCase()?.includes("vcpr")
                ) {
                  const patientId = getProVetIdFromUrl(doc.data()?.patient);
                  if (patientId) vcprEstablishedIds.push(patientId);
                }
              });
            })
            .catch((error: any) => throwError(error));
          if (DEBUG) {
            console.log(
              "processConsultationWebhook => vcprEstablishedIds",
              vcprEstablishedIds,
            );
          }
          if (vcprEstablishedIds.length > 0)
            vcprEstablishedIds.forEach(async (patientId: number) => {
              if (DEBUG)
                console.log(
                  "processConsultationWebhook => disabling vcpr for patientId",
                  patientId,
                );
              await updateCustomField(`${patientId}`, 2, "False");
              const proVetPatientData = await fetchEntity("patient", patientId);
              await savePatient(proVetPatientData);
            });
          else if (
            proVetConsultationData?.complaint
              ?.toLowerCase()
              ?.includes("vcpr") ||
            proVetConsultationData?.complaint
              ?.toLowerCase()
              ?.includes("establish care")
          )
            proVetConsultationData?.patients?.forEach(
              async (patientIdUrl: string) => {
                if (DEBUG)
                  console.log(
                    "processConsultationWebhook => disabling vcpr for patientIdUrl",
                    patientIdUrl,
                  );
                await updateCustomField(
                  `${getProVetIdFromUrl(patientIdUrl)}`,
                  2,
                  "False",
                );
                const proVetPatientData = await fetchEntity(
                  "patient",
                  getProVetIdFromUrl(patientIdUrl),
                );
                await savePatient(proVetPatientData);
              },
            );
        }
      } else if (proVetConsultationData?.status === 8) {
        admin
          .firestore()
          .collection("appointments")
          .doc(`${getProVetIdFromUrl(proVetConsultationData?.appointment)}`)
          .set(
            {
              consultation: proVetConsultationData?.id,
              invoice: getProVetIdFromUrl(proVetConsultationData?.invoice),
              status: "IN-PROGRESS",
              updatedOn: new Date(),
            },
            { merge: true },
          );
      }
    }
    return response.status(200).send({ received: true });
  } catch (error: any) {
    throwError(error);
    return response.status(400).send({ received: false });
  }
};
