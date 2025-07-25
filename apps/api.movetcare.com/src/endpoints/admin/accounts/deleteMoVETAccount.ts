import { defaultRuntimeOptions, functions } from "../../../config/config";
import { deleteAllAccountData } from "../../../utils/deleteAllAccountData";

export const deleteMoVETAccount = functions
  .runWith(defaultRuntimeOptions)
  .auth.user()
  .onDelete(async (user: { uid: string }) =>
    deleteAllAccountData(user?.uid, false),
  );
