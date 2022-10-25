import {
  functions,
  defaultRuntimeOptions,
  mobileClientApiKey,
  DEBUG,
} from "../../config/config";
import {logAuthEvent} from "../../utils/logging/logAuthEvent";
import {syncFromProVetClientData} from "../../integrations/provet/entities/client/syncFromProVetClientData";
import {logServiceRequest} from "../../utils/logging/logServiceRequest";
import {logEvent} from "../../utils/logging/logEvent";

export const event = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (payload: EventLogPayload, context: any): Promise<boolean> => {
      if (DEBUG) console.log("INCOMING REQUEST PAYLOAD => ", payload);
      if (payload.apiKey === mobileClientApiKey) {
        await logEvent({sendToSlack: true, ...payload});
        if (payload.tag === "login" || payload.tag === "reset-password") {
          await logAuthEvent({
            ...payload,
            ip: context.rawRequest.ip || "UNKNOWN",
          });
          if (payload.tag === "login" && payload.success)
            syncFromProVetClientData(payload.data?.email);
        } else if (payload?.tag === "service-request") {
          logServiceRequest({
            email: payload?.data?.email,
            zipcode: payload?.data?.zipcode,
            inState: !payload?.success,
          });
        }
        return true;
      } else {
        return false;
      }
    }
  );
