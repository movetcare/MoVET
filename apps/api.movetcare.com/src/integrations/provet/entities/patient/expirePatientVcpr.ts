import { sendNotification } from "../../../../notifications/sendNotification";
import { updateCustomField } from "./updateCustomField";

export const expirePatientVcpr = ({ id }: { id: string }) => {
  updateCustomField(`${id}`, 2, "True");
  sendNotification({
    type: "slack",
    payload: {
      message: `:robot_face: Patient #${id}'s VCPR has been auto EXPIRED!`,
    },
  });
};
