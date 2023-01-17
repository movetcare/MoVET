import {
  functions,
  defaultRuntimeOptions,
  mobileClientApiKey,
  throwError,
  admin,
  DEBUG,
} from "../../../config/config";
import type { WinterMode } from "../../../types/winter-mode";

export const getWinterMode = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      data: { apiKey: string },
      context: any
    ): Promise<WinterMode | { isActive: false }> => {
      if (!context.auth) {
        throwError({ message: "MISSING AUTHENTICATION" });
        return { isActive: false };
      }
      if (data.apiKey === mobileClientApiKey) {
        const data = await admin
          .firestore()
          .collection("configuration")
          .doc("bookings")
          .get()
          .then((document: any) => document.data().winterHousecallMode)
          .catch((error: any) => throwError(error));
        const {
          enableForNewPatientsOnly,
          endDate,
          startDate,
          isActiveOnMobileApp,
          message,
        } = data || {};
        if (isActiveOnMobileApp) {
          const today = new Date();
          if (today > startDate.toDate() && today < endDate.toDate()) {
            if (DEBUG)
              console.log("✅ date is between the 2 dates", {
                startDate: startDate.toDate(),
                endDate: endDate.toDate(),
                today,
              });
            return {
              isActive: true,
              enableForNewPatientsOnly: enableForNewPatientsOnly || false,
              message: message || null,
              isActiveOnMobileApp: isActiveOnMobileApp || false,
            };
          } else {
            if (DEBUG)
              console.log("⛔️ date is not in the range", {
                startDate: startDate.toDate(),
                endDate: endDate.toDate(),
                today,
              });
            return { isActive: false };
          }
        } else return { isActive: false };
      } else return { isActive: false };
    }
  );
