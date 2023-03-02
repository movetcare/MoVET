import { admin, throwError } from "../../../../config/config";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { modifyDateString } from "../../../../utils/modifyStringDate";
const DEBUG = false; 
export const savePatient = async (
  proVetPatientData: any,
  vcprRequired?: boolean
): Promise<void> => {
  const patientDocument = await admin
    .firestore()
    .collection("patients")
    .doc(`${proVetPatientData.id}`);
  let vcprRequiredCustomField = false;
  if (
    proVetPatientData?.fields_rel &&
    proVetPatientData?.fields_rel?.length > 0
  ) {
    proVetPatientData.fields_rel.forEach(
      (customField: {
        value: null | string;
        field_id: number;
        label: string;
      }) => {
        if (customField.field_id === 2 && customField.value === "True") {
          if (DEBUG) console.log(`${customField.label}`, customField.value);
          vcprRequiredCustomField = true;
        } else if (DEBUG) console.log(`${customField.label} SKIPPED`);
      }
    );
  }
  if (DEBUG) {
    console.log("vcprRequired", vcprRequired);
    console.log("vcprRequiredCustomField", vcprRequiredCustomField);
  }
  const patientData = {
    id: proVetPatientData?.id,
    archived: proVetPatientData.archived,
    breed: proVetPatientData.breed,
    breedId: proVetPatientData.breed_code
      ? parseInt(proVetPatientData.breed_code.toString().replace("001", ""))
      : null,
    gender: proVetPatientData.gender,
    name: proVetPatientData.name,
    picture: proVetPatientData.picture,
    species: proVetPatientData.species,
    weight: proVetPatientData.weight,
    vcprRequired: vcprRequired || vcprRequiredCustomField,
    customFields: proVetPatientData?.fields_rel || null,
    birthday: proVetPatientData.date_of_birth
      ? modifyDateString(proVetPatientData.date_of_birth)
      : null,
  };

  const data = proVetPatientData?.client
    ? {
        client: getProVetIdFromUrl(proVetPatientData?.client),
        ...patientData,
      }
    : patientData;

  return await patientDocument
    .get()
    .then(async (document: any) => {
      if (document.exists) {
        if (DEBUG)
          console.log(`Existing Patient Found: #${proVetPatientData.id}`);
        return await patientDocument
          .update({
            ...data,
            updatedOn: new Date(),
          })
          .then(() => {
            if (DEBUG)
              console.log(
                `Successfully Synchronized PROVET Cloud Data w/ Firestore for Patient #${proVetPatientData.id}`
              );
            return proVetPatientData.id;
          });
      } else {
        if (DEBUG)
          console.log(
            `Unable to find Patient #${proVetPatientData.id} in Firestore`
          );
        return await admin
          .firestore()
          .collection("patients")
          .doc(`${proVetPatientData.id}`)
          .set({
            ...data,
            createdOn: new Date(),
          })
          .then(() => {
            if (DEBUG)
              console.log(
                `Successfully Generated Firestore Document for Patient #${proVetPatientData.id}`
              );
            return proVetPatientData.id;
          })
          .catch((error: any) => throwError(error));
      }
    })
    .catch((error: any) => throwError(error));
};
