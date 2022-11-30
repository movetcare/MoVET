import { sendNotification } from "./../../../../notifications/sendNotification";
import { admin, DEBUG } from "../../../../config/config";
import { sendWelcomeEmail } from "../../../../notifications/templates/sendWelcomeEmail";
import { fetchEntity } from "../fetchEntity";
import { getCustomerId } from "../../../../utils/getCustomerId";

export const createNewClientTask = async (options: {
  clientId: number;
}): Promise<void> => {
  const { clientId } = options;
  if (clientId) {
    const client = await fetchEntity("client", clientId);
    if (client && client?.email) {
      if (DEBUG)
        console.log(
          `CREATING NEW FIREBASE AUTH USER FOR CLIENT #${String(clientId)} - ${
            client?.email
          }`
        );
      admin
        .auth()
        .createUser({
          email: client?.email?.toLowerCase(),
          emailVerified: false,
          uid: String(clientId),
        })
        .then(async (userRecord: any) => {
          if (DEBUG)
            console.log("SUCCESSFULLY CREATED NEW USER => ", userRecord);
          sendWelcomeEmail(userRecord?.email, true);
          getCustomerId(userRecord?.uid);
        })
        .then(() =>
          sendNotification({
            type: "slack",
            payload: {
              message: `:person_in_lotus_position: SUCCESSFULLY CREATED NEW MOVET ACCOUNT FOR PROVET CLIENT #${clientId}!`,
            },
          })
        )
        .catch(async (error: any) => {
          if (DEBUG) console.log("ERROR", error);
          if (error.code === "auth/uid-already-exists") {
            if (DEBUG)
              console.log(`${client?.email} IS ALREADY A FIREBASE AUTH USER!`);
            getCustomerId(String(clientId));
            sendNotification({
              type: "slack",
              payload: {
                message: `:person_in_lotus_position: SUCCESSFULLY CREATED NEW MOVET ACCOUNT FOR PROVET CLIENT #${clientId}!`,
              },
            });
            sendNotification({
              type: "slack",
              payload: {
                message: `:person_frowning: FAILED TO CREATE NEW MOVET ACCOUNT FOR PROVET CLIENT #${clientId}\nREASON: CLIENT ALREADY HAS A FIREBASE AUTH USER!`,
              },
            });
          }
        });
    } else {
      if (DEBUG)
        console.log(
          "createNewClientTask FAILED! UNABLE TO FIND CLIENT`s EMAIL ADDRESS IN PROVET"
        );
      sendNotification({
        type: "slack",
        payload: {
          message: `:person_frowning: FAILED TO CREATE NEW MOVET ACCOUNT FOR PROVET CLIENT #${clientId}\nREASON: UNABLE TO FIND CLIENT's EMAIL ADDRESS IN PROVET`,
        },
      });
    }
  } else {
    if (DEBUG) console.log("createNewClientTask FAILED! NO CLIENT ID PROVIDED");
    sendNotification({
      type: "slack",
      payload: {
        message: `:person_frowning: FAILED TO CREATE NEW MOVET ACCOUNT FOR PROVET CLIENT #${clientId}\nREASON: CLIENT ALREADY HAS A FIREBASE AUTH USER!`,
      },
    });
  }
};

