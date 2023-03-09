import { sendNotification } from "../notifications/sendNotification";
import { functions } from "../config/config";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { getAuthUserByEmail } from "../utils/auth/getAuthUserByEmail";
import { createProVetNote } from "../integrations/provet/entities/note/createProVetNote";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import { createProVetClient } from "../integrations/provet/entities/client/createProVetClient";
import { updateProVetClient } from "../integrations/provet/entities/client/updateProVetClient";
const DEBUG = false;
export const handleK9SmilesRequest = functions.firestore
  .document("k9_smiles/{id}")
  .onCreate(async (snapshot: any, context: any) => {
    const { id } = context.params || {};
    const data = snapshot.data();
    if (DEBUG)
      console.log("handleK9SmilesRequest => DATA", {
        id,
        data,
      });
    if (data !== undefined) {
      const { email, firstName, lastName, phone, source, status } = data as {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        source: string;
        status: string;
      };
      if (status === "started") {
        let authUser: UserRecord | null = await getAuthUserByEmail(email);
        let didUpdateClientInfo = false;
        if (DEBUG) console.log("authUser", authUser);
        if (authUser === null) {
          const proVetClientData: any = await createProVetClient({
            email,
            firstname: firstName,
            lastname: lastName,
            zip_code: null,
          });
          if (DEBUG) console.log("proVetClientData?.id", proVetClientData?.id);
          didUpdateClientInfo = await updateProVetClient({
            phone,
            id: proVetClientData?.id,
          });
          (authUser as any) = { uid: null };
          (authUser as any).uid = proVetClientData?.id;
        } else {
          didUpdateClientInfo = await updateProVetClient({
            firstname: firstName,
            lastname: lastName,
            phone,
            id: authUser?.uid,
          });
        }
        if (DEBUG) console.log("didUpdateClientInfo", didUpdateClientInfo);
        if (
          !email?.toLowerCase()?.includes("+test") &&
          didUpdateClientInfo &&
          authUser?.uid !== null
        ) {
          sendNotification({
            type: "slack",
            payload: {
              channel: "appointment-request",
              message: [
                {
                  type: "section",
                  text: {
                    text: `:toothbrush: _New K-9 Smiles Appointment Request!_ - ${id} :toothbrush:`,
                    type: "mrkdwn",
                  },
                  fields: [
                    {
                      type: "mrkdwn",
                      text: "*FIRST NAME:*",
                    },
                    {
                      type: "plain_text",
                      text: firstName,
                    },
                    {
                      type: "mrkdwn",
                      text: "*LAST NAME:*",
                    },
                    {
                      type: "plain_text",
                      text: lastName,
                    },
                    {
                      type: "mrkdwn",
                      text: "*EMAIL:*",
                    },
                    {
                      type: "plain_text",
                      text: email,
                    },
                    {
                      type: "mrkdwn",
                      text: "*PHONE:*",
                    },
                    {
                      type: "plain_text",
                      text: phone,
                    },
                    {
                      type: "mrkdwn",
                      text: "*SOURCE:*",
                    },
                    {
                      type: "plain_text",
                      text: source,
                    },
                  ],
                },
              ],
            },
          });
          createProVetNote({
            type: 1,
            subject: `New K-9 Smiles Appointment Request from ${firstName} ${lastName} @ ${source}`,
            message: `<p><b>Name:</b> ${firstName} ${lastName}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> <a href="tel://+1${phone}">${formatPhoneNumber(
              phone
            )}</a></p><p><b>Source:</b> ${source}</p>`,
            client: authUser?.uid as string,
            patients: [],
          });
          return true;
        } else {
          if (DEBUG)
            console.log("SKIPPED NOTIFICATION", {
              email: !email?.toLowerCase()?.includes("+test"),
              didUpdateClientInfo,
              authUserUid: authUser?.uid,
            });
          return false;
        }
      } else return false;
    } else return false;
  });
