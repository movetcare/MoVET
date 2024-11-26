import { sendNotification } from "../../../../notifications/sendNotification";
import { fetchEntity } from "../fetchEntity";
import { savePatient } from "./savePatient";
import { updateCustomField } from "./updateCustomField";

export const expirePatientVcpr = async ({ id }: { id: string }) => {
  await updateCustomField(`${id}`, 2, "True");
  const proVetPatientData = await fetchEntity("patient", Number(id));
  await savePatient(proVetPatientData);
  sendNotification({
    type: "slack",
    payload: {
      message: `:robot_face: Patient #${id}'s VCPR has been auto EXPIRED!`,
    },
  });
};
