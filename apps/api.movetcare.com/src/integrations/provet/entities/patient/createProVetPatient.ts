import { savePatient } from "./savePatient";
import {
  request,
  throwError,
  proVetApiUrl,
  DEBUG,
} from "../../../../config/config";
import { toIsoString } from "../../../../utils/toIsoString";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { updateCustomField } from "./updateCustomField";

export const createProVetPatient = async (data: {
  client: string;
  name: string;
  breed: string;
  species: string;
  gender: string;
  birthday: string;
  weight?: string;
  notes?: string;
  spayedOrNeutered?: boolean;
  vcprRequired?: boolean;
}): Promise<any> => {
  const {
    client,
    name,
    species,
    gender,
    breed,
    birthday,
    weight,
    notes,
    spayedOrNeutered,
    vcprRequired,
  } = data;
  if (DEBUG) console.log("createProVetPatient -> ", data);
  if (
    !(typeof client === "string") ||
    client.length === 0 ||
    !(typeof name === "string") ||
    name.length === 0 ||
    !(typeof species === "string") ||
    species.length === 0 ||
    // !(typeof breed === 'string') ||
    // breed.length === 0 ||
    !(typeof birthday === "string") ||
    birthday.length === 0 ||
    // !(typeof weight === 'string') ||
    // weight.length === 0 ||
    !(typeof gender === "string") ||
    gender.length === 0
  )
    return throwError({ message: "INVALID_PAYLOAD" });

  if (DEBUG)
    console.log("REQUEST PAYLOAD =>", {
      client: `${proVetApiUrl}/client/${client}/`,
      name,
      species: `${species === "Dog" ? "1445" : "1443"}001`,
      gender:
        gender === "Male"
          ? spayedOrNeutered
            ? 3
            : 1
          : spayedOrNeutered
          ? 4
          : 2,
      breed:
        breed === null || breed === "null"
          ? `${species === "Dog" ? "6714" : "6713"}001`
          : `${breed}001`,
      date_of_birth: birthday,
      archived: 0,
      critical_notes: notes || "",
    });

  const proVetPatientData = await request
    .post("/patient/", {
      client: `${proVetApiUrl}/client/${client}/`, // Required by PROVET API
      name: capitalizeFirstLetter(name), // Required by PROVET API
      species: `${species === "Dog" || species === "dog" ? "1445" : "1443"}001`, // Required by PROVET API - Species ID in Cloud. Needs to have a ending number of 001 for own species list or 002 for Venom species list.
      gender:
        gender === "Male"
          ? spayedOrNeutered
            ? 3
            : 1
          : spayedOrNeutered
          ? 4
          : 2, // Required by PROVET API
      breed: `${breed}001`, // Breed ID in Cloud. Needs to have a ending number of 001 for own breed list or 002 for Venom breed list. Has to be a valid value in Cloud. If no valid data available, drop this from array before sending
      date_of_birth: birthday,
      archived: 0,
      critical_notes: notes || "",
    })
    .then(async (response: any) => {
      updateCustomField(`${response.data.id}`, 2, "True");
      return await updatePatientWeight(response.data, weight as string);
    })
    .catch((error: any) => throwError(error));
  return await savePatient(proVetPatientData, vcprRequired);
};

const updatePatientWeight = async (data: any, weight: string) => {
  let updatedWeightHistory = null;
  if (DEBUG) console.log("API Response: POST /patient/ => ", data);
  if (DEBUG)
    console.log("PAYLOAD: ", {
      timestamp: toIsoString(new Date()), // Required by PROVET API
      weight: parseFloat(weight as string)?.toFixed(1), // Required by PROVET API
    });
  if (weight && data?.id) {
    updatedWeightHistory = await request
      .post(`/patient/${data?.id}/weight/`, {
        timestamp: toIsoString(new Date()), // Required by PROVET API
        weight: parseFloat(weight)?.toFixed(1), // Required by PROVET API
      })
      .then(async (response: any) => {
        const { data } = response;
        if (DEBUG)
          console.log(
            `API Response: POST /patient/${data?.id}/weight/ => `,
            data
          );
        return data;
      })
      .catch((error: any) => throwError(error));
  } else if (DEBUG)
    console.log("SKIPPING WEIGHT UPDATE - NO VALUE PROVIDED", data);
  return { ...data, weight: updatedWeightHistory };
};
