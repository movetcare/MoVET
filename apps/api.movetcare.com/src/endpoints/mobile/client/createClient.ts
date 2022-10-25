import {createAuthClient} from "../../../integrations/provet/entities/client/createAuthClient";
import {
  functions,
  defaultRuntimeOptions,
  mobileClientApiKey,
} from "../../../config/config";
import {createProVetClient} from "../../../integrations/provet/entities/client/createProVetClient";

export const createClient = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: NewClientPayload): Promise<boolean> => {
    if (data?.apiKey === mobileClientApiKey) {
      const proVetClientData: any = await createProVetClient(data);
      if (proVetClientData)
        return await createAuthClient({
          ...proVetClientData,
          password: data?.password || null,
        });
    }
    return false;
  });
