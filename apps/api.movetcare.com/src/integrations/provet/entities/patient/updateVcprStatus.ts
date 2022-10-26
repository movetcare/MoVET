import {admin, request} from "../../../../config/config";

const DEBUG = true;

export const updateVcprStatus = async (
  patient: string,
  status: boolean
): Promise<boolean> => {
  const vcprCustomFieldId = await admin
    .firestore()
    .collection("patients")
    .doc(`${patient}`)
    .get()
    .then((document: any) =>
      document.data()?.customFields && document.data()?.customFields.length > 0
        ? document
            .data()
            ?.customFields.filter(
              (customField: { field_id: number; id: number }) => {
                if (customField.field_id === 2) return customField.id;
                else return;
              }
            )
        : null
    )
    .catch((error: any) => console.log("updateVcprStatus => ERROR: ", error));
  if (DEBUG) {
    console.log("updateVcprStatus => vcprCustomFieldId", vcprCustomFieldId);
    console.log(
      "updateVcprStatus => vcprCustomFieldId.length ",
      vcprCustomFieldId?.length
    );
    console.log(
      "updateVcprStatus => vcprCustomFieldId.length < 1",
      vcprCustomFieldId?.length < 1
    );
    console.log(
      "updateVcprStatus => Array.isArray(vcprCustomFieldId) ",
      Array.isArray(vcprCustomFieldId)
    );
  }
  if (
    vcprCustomFieldId === null ||
    vcprCustomFieldId === false ||
    vcprCustomFieldId === undefined ||
    (Array.isArray(vcprCustomFieldId) && vcprCustomFieldId?.length < 1)
  )
    return await request
      .post("/custom_field_values/", {
        field: 2,
        value: status ? "True" : "False",
        object_id: patient,
      })
      .then(
        async (response: any) =>
          DEBUG &&
          console.log(
            "API Response: POST /custom_field_values/ => ",
            response.data
          )
      )
      .then(() => true)
      .catch((error: any) => (console.log("ERROR: ", error) as any) && false);
  else
    return await request
      .patch(`/custom_field_values/${vcprCustomFieldId}`, {
        field: 2,
        value: status ? "True" : "False",
        object_id: patient,
      })
      .then(
        async (response: any) =>
          DEBUG &&
          console.log(
            `API Response: PATCH /custom_field_values/${vcprCustomFieldId} => `,
            response.data
          )
      )
      .then(() => true)
      .catch((error: any) => (console.log("ERROR: ", error) as any) && false);
};
