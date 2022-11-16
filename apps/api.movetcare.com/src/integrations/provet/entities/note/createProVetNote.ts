import {
  proVetApiUrl,
  proVetAppUrl,
  request,
  throwError,
} from "../../../../config/config";
import { sendNotification } from "../../../../notifications/sendNotification";
const DEBUG = false;
export const createProVetNote = ({
  subject,
  message,
  type,
  client,
  patients,
}: {
  subject: string;
  message: string;
  type: number;
  client: string;
  patients: Array<string>;
}) => {
  if (DEBUG)
    console.log("createProVetNote DATA", {
      subject,
      message,
      type,
      client,
      patients,
    });
  request
    .post("/note/", {
      title: subject,
      type,
      client: proVetApiUrl + `/client/${client}/`,
      patients: patients.map(
        (patient: any) => proVetApiUrl + `/patient/${patient}/`
      ),
      note: message,
    })
    .then((response: any) => {
      const { data } = response;
      if (DEBUG) console.log("API Response: POST /note/ => ", data);
      sendNotification({
        type: "slack",
        payload: {
          message: `:notebook: New ProVet Client Note Posted - "${subject}"\n\n${
            proVetAppUrl + `/client/${client}/tabs/?tab=communication`
          }\n\n`,
        },
      });
    })
    .catch((error: any) => throwError(error));
};
