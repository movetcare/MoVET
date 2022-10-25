import {functions, defaultRuntimeOptions, DEBUG} from "../../../config/config";
import {createCard} from "../../../integrations/trello/createCard";

export const reportABugInternal = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (context.auth.token.email) {
      if (DEBUG) console.log("REPORTING A BUG", data);
      return await createCard({
        ...data,
        createdBy: JSON.stringify(context.auth.token.email),
      });
    } else return false;
  });
