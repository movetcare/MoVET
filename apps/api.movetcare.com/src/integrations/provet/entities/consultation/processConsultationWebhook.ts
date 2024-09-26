import { updateCustomField } from "./../patient/updateCustomField";
import { throwError, admin } from "../../../../config/config";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { fetchEntity } from "../fetchEntity";
import { Request, Response } from "express";
import { sendNotification } from "../../../../notifications/sendNotification";
import { truncateString } from "../../../../utils/truncateString";

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
    //       patients: proVetConsultationData?.patients.map((patientId: string) =>
    //         getProVetIdFromUrl(patientId),
    //       ),
    //       complaint: proVetConsultationData?.complaint,
    //       reason: getProVetIdFromUrl(proVetConsultationData?.complaint_type),
    //       admitted: new Date(proVetConsultationData?.admitted_time),
    //       firstEntry: new Date(proVetConsultationData?.first_entry),
    //       started: new Date(proVetConsultationData?.started),
    //       ended: new Date(proVetConsultationData?.ended),
    //       finished: new Date(proVetConsultationData?.finished),
    //       consultationItems: proVetConsultationData?.consultation_items.map(
    //         (consultationItemUrl: string) =>
    //           getProVetIdFromUrl(consultationItemUrl),
    //       ),
    //       consultationNotes: proVetConsultationData?.consultation_notes.map(
    //         (consultationNoteUrl: string) =>
    //           getProVetIdFromUrl(consultationNoteUrl),
    //       ),
    //       consultationDiagnosis:
    //         proVetConsultationData?.consultation_diagnosis.map(
    //           (consultationDiagnosisUrl: string) =>
    //             getProVetIdFromUrl(consultationDiagnosisUrl),
    //         ),
    //       consultationDischargeInstructions:
    //         proVetConsultationData?.consultation_dischargeinstructions.map(
    //           (consultationDischargeInstructionsUrl: string) =>
    //             getProVetIdFromUrl(consultationDischargeInstructionsUrl),
    //         ),
    //       consultationPatientStatus:
    //         proVetConsultationData?.consultation_patient_status.map(
    //           (consultationPatientStatusUrl: string) =>
    //             getProVetIdFromUrl(consultationPatientStatusUrl),
    //         ),
    //       customFields: proVetConsultationData?.custom_fields.map(
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
        proVetConsultationData.patients.map((patient: string) => {
          const patientId = getProVetIdFromUrl(patient);
          updateCustomField(`${patientId}`, 2, "False");
          const today = new Date();
          admin
            .firestore()
            .collection("tasks_queue")
            .doc(`${patientId}_expire_vcpr`)
            .set(
              {
                options: {
                  id: patientId,
                },
                worker: "expire_patient_vcpr",
                status: "scheduled",
                performAt: new Date(today.setMonth(today.getMonth() + 13)),
                createdOn: new Date(),
              },
              { merge: true },
            )
            .then(
              () =>
                DEBUG &&
                console.log(
                  "PATIENT VCPR EXPIRE TASK ADDED TO QUEUE => ",
                  `${patientId}_expire_vcpr`,
                ),
            )
            .catch((error: any) => throwError(error));
        });
        admin
          .firestore()
          .collection("appointments")
          .doc(`${getProVetIdFromUrl(proVetConsultationData?.appointment)}`)
          .set(
            {
              status: "COMPLETE",
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
                  "Please leave us a review on the services you received today...",
                ),
                path: "/home/",
              },
            });
          })
          .catch((error: any) => throwError(error));
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
