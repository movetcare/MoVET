import { updateCustomField } from "./../patient/updateCustomField";
import { throwError, DEBUG, admin } from "../../../../config/config";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { fetchEntity } from "../fetchEntity";
import { Request, Response } from "express";
import {
  getClientNotificationSettings,
  UserNotificationSettings,
} from "../../../../utils/getClientNotificationSettings";
import { sendNotification } from "../../../../notifications/sendNotification";
import { truncateString } from "../../../../utils/truncateString";

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
    if (proVetConsultationData?.status === 9) {
      proVetConsultationData.patients.map((patient: string) =>
        updateCustomField(`${getProVetIdFromUrl(patient)}`, 2, "False"),
      );
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
          const userNotificationSettings: UserNotificationSettings | false =
            await getClientNotificationSettings(
              `${getProVetIdFromUrl(proVetConsultationData?.client)}`,
            );
          if (
            userNotificationSettings &&
            userNotificationSettings?.sendPush &&
            proVetConsultationData?.client
          )
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
    return response.status(200).send({ received: true });
  } catch (error: any) {
    throwError(error);
    return response.status(400).send({ received: false });
  }
};
