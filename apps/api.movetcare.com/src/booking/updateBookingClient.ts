import { sendNotification } from "./../notifications/sendNotification";
import { admin, throwError } from "../config/config";
import { updateProVetClient } from "../integrations/provet/entities/client/updateProVetClient";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
const DEBUG = false;
export const updateBookingClient = async (
  id: string,
  client: {
    uid: string;
    firstName: string;
    lastName: string;
    phone: string;
  }
): Promise<void> => {
  if (DEBUG)
    console.log("UPDATING CLIENT", {
      id,
      client,
    });
  const didUpdateClient = await updateProVetClient({
    id: client.uid,
    firstName: capitalizeFirstLetter(client.firstName),
    lastName: capitalizeFirstLetter(client.lastName),
    phone: client.phone,
  });
  if (DEBUG) console.log("didUpdateClient", didUpdateClient);
  if (didUpdateClient) {
    if (DEBUG)
      console.log("UPDATING CLIENT BOOKING DATA", {
        id,
        client,
      });
    admin
      .firestore()
      .collection("bookings")
      .doc(id)
      .set(
        {
          id,
          step: "patient-selection",
          updatedOn: new Date(),
          client: {
            displayName: capitalizeFirstLetter(client.firstName),
            phoneNumber: client.phone,
          },
        },
        { merge: true }
      )
      .then(() => {
        if (DEBUG)
          console.log("SUCCESSFULLY UPDATED BOOKING W/ CLIENT DATA", {
            id,
            client,
          });
        sendNotification({
          type: "slack",
          payload: {
            message: [
              {
                type: "section",
                text: {
                  text: ":book: _Appointment Booking_ *UPDATE*",
                  type: "mrkdwn",
                },
                fields: [
                  {
                    type: "mrkdwn",
                    text: "*Session ID*",
                  },
                  {
                    type: "plain_text",
                    text: id,
                  },
                  {
                    type: "mrkdwn",
                    text: "*Step*",
                  },
                  {
                    type: "plain_text",
                    text: "Client Info",
                  },
                  {
                    type: "mrkdwn",
                    text: "*Name*",
                  },
                  {
                    type: "plain_text",
                    text: `${client.firstName ? `${client.firstName}` : ""}${
                      client.lastName ? ` ${client.lastName}` : ""
                    }`,
                  },
                  {
                    type: "mrkdwn",
                    text: "*Phone*",
                  },
                  {
                    type: "plain_text",
                    text: `${client.phone ? `${client.phone}` : ""}`,
                  },
                ],
              },
            ],
          },
        });
      })
      .catch((error: any) => throwError(error));
  } else throwError({ message: "FAILED TO UPDATE CLIENT IN PROVET" });
};
