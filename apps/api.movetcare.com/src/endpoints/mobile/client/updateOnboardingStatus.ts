import {
  functions,
  defaultRuntimeOptions,
  throwError,
  mobileClientApiKey,
  admin,
} from "../../../config/config";

export const updateOnboardingStatus = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      data: {apiKey: string; onboardingComplete: boolean},
      context: any
    ): Promise<boolean> => {
      if (!context.auth) return throwError({message: "MISSING AUTHENTICATION"});
      if (data.apiKey === mobileClientApiKey) {
        return await admin
          .auth()
          .setCustomUserClaims(context.auth.uid, {
            onboardingComplete: data.onboardingComplete,
          })
          .catch((error: any) => throwError(error));
      }
      return false;
    }
  );
