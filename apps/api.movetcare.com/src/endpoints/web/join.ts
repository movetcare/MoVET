import {
  functions,
  defaultRuntimeOptions,
  throwError,
  admin,
  DEBUG,
} from "../../config/config";
import {createProVetClient} from "../../integrations/provet/entities/client/createProVetClient";
import { updateSendGridContact } from "../../integrations/sendgrid/updateSendGridContact";
import { sendNotification } from "../../notifications/sendNotification";
import { recaptchaIsVerified } from "../../utils/recaptchaIsVerified";

interface JoinRequest {
  token: string;
  email: string;
  createClient: boolean;
  source: "grand-opening";
}

export const join = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async ({
      token,
      email,
      source,
      createClient,
    }: JoinRequest): Promise<boolean> => {
      const payload = {
        token,
        email,
        source,
        createClient,
      };
      if (DEBUG) console.log("INCOMING REQUEST PAYLOAD => ", payload);
      if (token && (await recaptchaIsVerified(token))) {
        return await admin
          .firestore()
          .collection("forms")
          .doc("join")
          .collection("web")
          .doc(`${new Date().toString()}`)
          .set({
            ...payload,
            createdOn: new Date(),
          })
          .then(async () => {
            if (DEBUG)
              console.log("Successfully Saved New Join Request", {
                ...payload,
                createdOn: new Date(),
              });
            const sendGridPayload: any = { email };
            if (source === "grand-opening") {
              sendGridPayload.customFields = { e2_N: 1, e1_T: "join" };
            } else sendGridPayload.customFields = { e1_T: "join" };
            await updateSendGridContact(sendGridPayload);
            if (createClient) {
              await createProVetClient({
                email,
                zip_code: null,
              });
              sendNotification({
                type: "slack",
                payload: { message: `:tada: ${email} joined MoVET!` },
              });
            }
          })
          .catch((error: any) => throwError(error));
      } else return false;
    }
  );
