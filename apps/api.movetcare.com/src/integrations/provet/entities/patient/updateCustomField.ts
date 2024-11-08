// PROVET CUSTOM FIELDS MAPPING - https://us.provetcloud.com/4285/api/0.1/custom_fields/
import { admin, request } from "../../../../config/config";
const DEBUG = true;
export const updateCustomField = async (
  patient: string,
  id: number,
  value: any,
): Promise<boolean> => {
  if (DEBUG) {
    console.log("updateCustomField => Patient", patient);
    console.log("updateCustomField => Id", id);
    console.log("updateCustomField => Value", value);
  }
  const customFieldValue = await admin
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
                if (customField.field_id === id) return customField.id;
                else return;
              },
            )
        : null,
    )
    .catch((error: any) => console.log("updateCustomField => ERROR: ", error));
  if (DEBUG) {
    console.log(
      "updateCustomField updateCustomField => customFieldValue",
      customFieldValue,
    );
    console.log(
      "updateCustomField updateCustomField => customFieldValue.length ",
      customFieldValue?.length,
    );
    console.log(
      "updateCustomField updateCustomField => customFieldValue.length < 1",
      customFieldValue?.length < 1,
    );
    console.log(
      "updateCustomField updateCustomField => Array.isArray(customFieldValue) ",
      Array.isArray(customFieldValue),
    );
    console.log(
      // eslint-disable-next-line quotes
      'updateCustomField typeof customFieldValue === "object"',
      typeof customFieldValue === "object",
    );
    console.log(
      "updateCustomField typeof customFieldValue === 'undefined'",
      typeof customFieldValue === "undefined",
    );
    console.log("id", id);
  }
  // TODO: FIX LOGIC...
  // if (id === 2 && value === "False") {
  // Check if patient has vcprRequired = true, if vcprRequired value does not exist skip, if it does exist, set vcprRenewedOn
  //   if (DEBUG) console.log("updateCustomField => vcprRenewedOn", new Date());
  //   admin.firestore().collection("patients").doc(`${patient}`).set(
  //     {
  //       vcprRenewedOn: new Date(),
  //       updatedOn: new Date(),
  //     },
  //     { merge: true },
  //   );
  // }
  if (
    customFieldValue === null ||
    customFieldValue === false ||
    typeof customFieldValue === "undefined" ||
    (Array.isArray(customFieldValue) && customFieldValue?.length < 1)
  )
    return await request
      .post("/custom_field_values/", {
        field: id,
        value: value,
        object_id: patient,
      })
      .then(
        async (response: any) =>
          DEBUG &&
          console.log(
            "API Response: POST /custom_field_values/ => ",
            response.data,
          ),
      )
      .then(() => true)
      .catch((error: any) => (console.log("ERROR: ", error) as any) && false);
  else
    return await request
      .patch(`/custom_field_values/${customFieldValue[0]?.id}`, {
        field: id,
        value: value,
        object_id: patient,
      })
      .then(
        async (response: any) =>
          DEBUG &&
          console.log(
            `API Response: PATCH /custom_field_values/${id} => `,
            response.data,
          ),
      )
      .then(() => true)
      .catch(
        (error: any) =>
          (console.log("API ERROR: ", JSON.stringify(error)) as any) && false,
      );
};
