import { throwError } from "../../../../config/config";
import { saveClient } from "./saveClient";
import { fetchEntity } from "../fetchEntity";
import { sendNotification } from "../../../../notifications/sendNotification";
import { Request, Response } from "express";
import { deleteAllAccountData } from "../../../../utils/deleteAllAccountData";
const DEBUG = false;

export const processClientWebhook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const id = request.body.client_id;
  if (!(typeof id === "string") || id.length === 0)
    throwError({
      message: "INVALID_PAYLOAD => " + JSON.stringify(request.body),
    });
  const proVetClientData = await fetchEntity("client", id);
  if (DEBUG) console.log("LATEST proVetClientData", proVetClientData);
  if (proVetClientData) saveClient(id, proVetClientData);
  else {
    if (DEBUG) console.log("DELETING CLIENT", id);
    sendNotification({
      type: "slack",
      payload: {
        message: `:red_circle: Client #${id} has been DELETED in ProVet!\nhttps://admin.movetcare.com/client?id=${id}`,
      },
    });
    deleteAllAccountData(id);
  }
  return response.status(200).send({ received: true });
};
