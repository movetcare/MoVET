import {request, throwError, DEBUG} from "../../../../config/config";
import {verifyExistingClient} from "../../../../utils/auth/verifyExistingClient";
import {capitalizeFirstLetter} from "../../../../utils/capitalizeFirstLetter";

export const createProVetClient = async (data: {
  email: string;
  zip_code: string | null;
  firstname?: string;
  lastname?: string;
}): Promise<any> => {
  const {email, zip_code, firstname, lastname} = data || {};
  if (!(typeof email === "string") || email.length === 0)
    throwError({message: "INVALID_PAYLOAD"});
  if ((await verifyExistingClient(email)) === false) {
    const requestBody: any = {
      email: email?.toLowerCase(),
      zip_code: zip_code === null ? "" : zip_code, // Required by PROVET API
      firstname: capitalizeFirstLetter(firstname || ""), // Required by PROVET API
      lastname: capitalizeFirstLetter(lastname || ""), // Required by PROVET API
      street_address: "", // Required by PROVET API
      city: "", // Required by PROVET API
      patients: [], // Required by PROVET API
    };
    return await request
      .post("/client/", requestBody)
      .then(async (response: any) => {
        const { data } = response;
        if (DEBUG) console.log("API Response: POST /client/ => ", data);
        return data;
      })
      .catch((error: any) => throwError(error));
  } else return false;
};
