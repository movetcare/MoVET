import { defaultRuntimeOptions, functions } from "../../../config/config";
import { deleteAllAccountData } from "../../../utils/deleteAllAccountData";

export const deleteMoVETAccount = functions
  .runWith({ ...defaultRuntimeOptions, memory: "4GB" })
  .auth.user()
  .onDelete(async (user: { uid: string }) =>
    deleteAllAccountData(user?.uid, false),
  );
