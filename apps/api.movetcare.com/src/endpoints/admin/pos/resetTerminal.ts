import {
  defaultRuntimeOptions,
  functions,
  throwError,
} from "../../../config/config";
import { configureTerminals } from "../../../config/configureTerminals";
import { requestIsAuthorized } from "./requestIsAuthorized";
const DEBUG = true;
export const resetTerminal = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      data: { mode: "counter" | "client"; invoice: string; reader: string },
      context: any
    ): Promise<any> => {
      if (DEBUG) {
        console.log("simulatePayment context.app => ", context.app);
        console.log("simulatePayment context.auth => ", context.auth);
        console.log(data);
      }
      const isAuthorized = await requestIsAuthorized(context);
      if (isAuthorized) {
        return await configureTerminals();
      } else
        return throwError(
          `UNABLE TO RESET TERMINAL -> ${JSON.stringify(data)}`
        );
    }
  );
