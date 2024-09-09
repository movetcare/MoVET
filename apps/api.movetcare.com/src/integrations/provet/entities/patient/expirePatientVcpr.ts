import { updateCustomField } from "./updateCustomField";

export const expirePatientVcpr = ({ id }: { id: string }) =>
  updateCustomField(`${id}`, 2, "True");
