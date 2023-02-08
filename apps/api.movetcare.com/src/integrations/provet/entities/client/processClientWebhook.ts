import { throwError, DEBUG } from "../../../../config/config";
import { saveClient } from "./saveClient";
import { fetchEntity } from "../fetchEntity";
import { sendNotification } from "../../../../notifications/sendNotification";
import { deleteAllAccountData } from "../../../../utils/deleteAllAccountData";

export const processClientWebhook = async (
  request: any,
  response: any
): Promise<any> => {
  const id = request.body.client_id;
  if (!(typeof id === "string") || id.length === 0)
    throwError({ message: "INVALID_PAYLOAD" });
  try {
    const proVetClientData = await fetchEntity("client", id);
    if (DEBUG) console.log("LATEST proVetClientData", proVetClientData);
    if (proVetClientData)
      return (await saveClient(id, proVetClientData))
        ? response.status(200).send({ received: true })
        : response.status(500).send({ received: false });
    else {
      sendNotification({
        type: "slack",
        payload: {
          message: `:red_circle: Client #${id} has been DELETED in ProVet - Proceeding to DELETE ALL MoVET Account Data!`,
        },
      });
      deleteAllAccountData(id);
    }
  } catch (error: any) {
    throwError(error);
    return response.status(500).send({ received: false });
  }
};
