import { functions, defaultRuntimeOptions } from "../../../config/config";
import { createAuthClient } from "../../../integrations/provet/entities/client/createAuthClient";
import { createProVetClient } from "../../../integrations/provet/entities/client/createProVetClient";
import { verifyExistingClient } from "../../../utils/auth/verifyExistingClient";

export const verifyClient = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (data: { email: string }, context: any): Promise<boolean> => {
      console.log("verifyClient context", context);
      const isExistingClient = await verifyExistingClient(data?.email);
      if (isExistingClient) return true;
      else {
        const proVetClientData: any = await createProVetClient(data);
        if (proVetClientData)
          return await createAuthClient({
            ...proVetClientData,
            password: null,
          });
        else return false;
      }
    },
  );
