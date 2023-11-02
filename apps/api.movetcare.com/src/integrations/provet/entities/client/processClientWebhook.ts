import { throwError, DEBUG } from "../../../../config/config";
import { saveClient } from "./saveClient";
import { fetchEntity } from "../fetchEntity";
import { sendNotification } from "../../../../notifications/sendNotification";
import { Request, Response } from "express";
import { deleteAllAccountData } from "../../../../utils/deleteAllAccountData";

export const processClientWebhook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const id = request.body.client_id;
  if (!(typeof id === "string") || id.length === 0)
    throwError({
      message: "INVALID_PAYLOAD => " + JSON.stringify(request.body),
    });
  try {
    const proVetClientData = await fetchEntity("client", id);
    if (DEBUG) console.log("LATEST proVetClientData", proVetClientData);
    if (proVetClientData)
      return (await saveClient(id, proVetClientData))
        ? response.status(200).send({ received: true })
        : response.status(500).send({ received: false });
    else {
      await sendNotification({
        type: "slack",
        payload: {
          message: `:red_circle: Client #${id} has been DELETED in ProVet!\nhttps://admin.movetcare.com/client?id=${id}`,
        },
      });
      await deleteAllAccountData(id);
      return response.status(200).send({ received: true });
    }
  } catch (error: any) {
    throwError(error);
    return response.status(500).send({ received: false });
  }
};
