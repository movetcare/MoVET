import { saveClient } from "./saveClient";
import {
  request,
  throwError,
  proVetApiUrl,
  DEBUG,
} from "../../../../config/config";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";

export const updateProVetClient = async (payload: any): Promise<boolean> => {
  if (DEBUG) console.log("updateProVetClient -> ", payload);

  const data: any = {};
  const movetClientData: any = {};

  Object.entries(payload).forEach(([key, value]) => {
    switch (key) {
      case "archived":
        data.archived = value;
        break;
      case "firstName":
        data.firstname = capitalizeFirstLetter(value as string);
        break;
      case "lastName":
        data.lastname = capitalizeFirstLetter(value as string);
        break;
      case "email":
        data.email = String(value)?.toLowerCase();
        break;
      case "sendSms":
        data.no_sms = !value;
        break;
      case "sendEmail":
        data.no_email = !value;
        break;
      case "street":
        data.street_address = value;
        data.state = "CO";
        data.country = "United States of America";
        break;
      case "city":
        data.city = capitalizeFirstLetter(value as string);
        data.state = "CO";
        data.country = "United States of America";
        break;
      case "zip":
        data.zip_code = value;
        data.state = "CO";
        data.country = "United States of America";
        break;
      case "phone":
        movetClientData.phone = payload?.phone;
        break;
      case "sendPush":
        movetClientData.sendPush = payload?.sendPush;
        break;
      case "pushToken":
        movetClientData.pushToken = payload?.sendPush
          ? null
          : payload?.pushToken;
        break;
      case "defaultLocation":
        movetClientData.defaultLocation = payload?.defaultLocation;
        break;
      case "location":
        movetClientData.location = payload?.location;
        break;
      case "payment":
        movetClientData.defaultPayment = payload?.payment;
        break;
      case "customer":
        movetClientData.customer = payload?.customer;
        break;
      default:
        break;
    }
  });

  if (movetClientData.phone) {
    const allPhoneNumberIds = await request
      .get(`/client/${payload?.id}/`)
      .then(async (response: any) => {
        const { data } = response;
        if (DEBUG)
          console.log(`API Response: GET /client/${payload?.id}/ => `, data);
        return data?.phone_numbers.map((phone: any) => phone?.id);
      })
      .catch((error: any) => throwError(error));
    if (allPhoneNumberIds.length > 0)
      allPhoneNumberIds.forEach(
        async (phoneId: string) =>
          await request
            .delete(`/phonenumber/${phoneId}/`)
            .then(async (response: any) => {
              const { data } = response;
              if (DEBUG)
                console.log(
                  `API Response: DELETE /phonenumber/${phoneId} => `,
                  data
                );
            })
            .catch((error: any) => throwError(error))
      );
    await request
      .post("/phonenumber/", {
        client: `${proVetApiUrl}/client/${payload?.id}/`,
        type_code: 1,
        phone_number: `+1${(payload?.phone as string)
          .replace("-", "")
          .replace("(", "")
          .replace(")", "")}`,
        description: "Default Phone Number - Used for SMS Alerts",
      })
      .then(async (response: any) => {
        const { data } = response;
        if (DEBUG) console.log("API Response: POST /phonenumber/ => ", data);
      })
      .catch((error: any) => throwError(error));
  }

  const proVetClientData = await request
    .patch(`/client/${payload?.id}`, data)
    .then(async (response: any) => {
      const { data } = response;
      if (DEBUG)
        console.log(`API Response: PATCH /client/${payload?.id} => `, data);
      return data;
    })
    .catch((error: any) => DEBUG && console.log(error));

  return await saveClient(
    `${proVetClientData.id}`,
    proVetClientData,
    movetClientData
  );
};
