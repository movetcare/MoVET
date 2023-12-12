import {
  request,
  throwError,
  proVetApiUrl,
  DEBUG,
} from "../../../../config/config";
import type { Patient } from "../../../../types/patient";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { savePatient } from "./savePatient";
import { updateCustomField } from "./updateCustomField";

export const updateProVetPatient = async (data: Patient): Promise<any> => {
  if (DEBUG) console.log("updateProVetPatient -> ", data);
  // const {weight} = data;
  const { photoUrl, spayedOrNeutered } = data || {};
  const requestPayload: any = {};

  Object.entries(data).forEach(([key, value]) => {
    switch (key) {
      case "client":
        requestPayload.client = `${proVetApiUrl}/client/${value}/`;
        break;
      case "name":
        requestPayload.name = capitalizeFirstLetter(value as string);
        break;
      case "species":
        requestPayload.species = `${
          (value as string)?.toLowerCase() === "dog" ? "1445" : "1443"
        }001`;
        break;
      case "gender":
        (value as string)?.toLowerCase() === "male"
          ? spayedOrNeutered
            ? 3
            : 1
          : spayedOrNeutered
            ? 4
            : 2;
        break;
      case "breed":
        requestPayload.breed = `${value}001`;
        break;
      case "birthday":
        requestPayload.date_of_birth = value;
        break;
      case "archived":
        requestPayload.archived = value;
        break;
      case "aggressionStatus":
        updateCustomField(
          String(data?.id),
          4,
          (value as string)?.includes("no history of aggression")
            ? "False"
            : "True",
        );
        break;
      case "notes":
        updateCustomField(String(data?.id), 6, value);
        break;
      case "vet":
        updateCustomField(String(data?.id), 5, value);
        break;
      case "photoUrl":
        updateCustomField(String(data?.id), 7, value);
        break;
      default:
        break;
    }
  });

  if (DEBUG) console.log("REQUEST PAYLOAD =>", requestPayload);

  const proVetPatientData = await request
    .patch(`/patient/${data?.id}`, requestPayload)
    .then(async (response: any) => {
      const { data } = response;
      // const patientId = data?.id;
      // let updatedWeightHistory = null;
      // if (DEBUG) console.log('API Response: POST /patient/ => ', data);
      // if (DEBUG)
      //   console.log('PAYLOAD: ', {
      //     timestamp: toIsoString(new Date()), // Required by PROVET API
      //     weight: parseInt(weight as string), // Required by PROVET API
      //   });
      // if (weight && patientId) {
      //   updatedWeightHistory = await request
      //     .post(`/patient/${patientId}/weight/`, {
      //       timestamp: '2021-12-10T20:42:43', // Required by PROVET API
      //       weight: parseInt(weight), // Required by PROVET API
      //     })
      //     .then(async (response: any) => {
      //       const {data} = response;
      //       if (DEBUG)
      //         console.log(
      //           `API Response: POST /patient/${patientId}/weight/ => `,
      //           data
      //         );
      //       return data?.results;
      //     })
      //      .catch((error: any) => throwError(error));
      // }
      // return {
      //   ...data,
      //   weight: updatedWeightHistory ? updatedWeightHistory : null,
      // };
      return data;
    })
    .catch((error: any) => throwError(error));

  return photoUrl
    ? await savePatient(proVetPatientData, undefined, photoUrl)
    : await savePatient(proVetPatientData);
};

// function toIsoString(date: Date) {
//   const pad = function (num: number) {
//     const norm = Math.floor(Math.abs(num));
//     return (norm < 10 ? '0' : '') + norm;
//   };
//   return (
//     date.getFullYear() +
//     '-' +
//     pad(date.getMonth() + 1) +
//     '-' +
//     pad(date.getDate()) +
//     'T' +
//     pad(date.getHours()) +
//     ':' +
//     pad(date.getMinutes()) +
//     ':' +
//     pad(date.getSeconds())
//   );
// }
