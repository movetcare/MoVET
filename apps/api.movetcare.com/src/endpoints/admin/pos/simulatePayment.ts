import {
  throwError,
  defaultRuntimeOptions,
  functions,
  request,
  DEBUG,
} from "../../../config/config";
import { requestIsAuthorized } from "./requestIsAuthorized";

export const simulatePayment = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      data: { card: string; reader: string },
      context: any
    ): Promise<any> => {
      if (DEBUG) {
        console.log("simulatePayment context.app => ", context.app);
        console.log("simulatePayment context.auth => ", context.auth);
        console.log(data);
      }
      const isAuthorized = await requestIsAuthorized(context);
      if (isAuthorized) {
        const { card, reader } = data || {};
        if (card && reader) {
          const params = new URLSearchParams();
          params.append("type", "card_present");
          params.append("card_present[number]", card);
          return await request
            .post(
              `https://api.stripe.com/v1/test_helpers/terminal/readers/${reader}/present_payment_method`,
              params,
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  "Stripe-Version": functions.config()?.stripe?.api_version,
                  Authorization: `Bearer ${
                    functions.config()?.stripe?.secret_key
                  }`,
                },
              }
            )
            .then(async (response: any) => {
              const { data } = response;
              if (DEBUG)
                console.log(
                  `RESPONSE: https://api.stripe.com/v1/test_helpers/terminal/readers/${reader}/present_payment_method => `,
                  data
                );
              return data?.action || null;
            })
            .catch((error: any) => throwError(error));
        } else
          return throwError(
            `UNABLE TO COMPLETE SIMULATED PAYMENT -> ${JSON.stringify(data)}`
          );
      }
    }
  );
