import {DEBUG, throwError} from "../../../../config/config";
import {saveClient} from "./saveClient";
import {fetchEntity} from "../fetchEntity";

export const processClientWebhook = async (
  request: any,
  response: any
): Promise<any> => {
  if (
    !(typeof request.body.client_id === "string") ||
    request.body.client_id.length === 0
  )
    throwError({message: "INVALID_PAYLOAD"});
  try {
    const proVetClientData = await fetchEntity(
      "client",
      request.body.client_id
    );
    if (DEBUG) console.log("LATEST proVetClientData", proVetClientData);
    return (await saveClient(request.body.client_id, proVetClientData))
      ? response.status(200).send({received: true})
      : response.status(500).send({received: false});
  } catch (error: any) {
    if (DEBUG) console.error(error);
    return response.status(500).send({received: false});
  }
};
