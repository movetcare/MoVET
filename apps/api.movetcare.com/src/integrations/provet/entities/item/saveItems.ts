import { admin, throwError } from "../../../../config/config";
import type { Item } from "../../../../types/item";

export const saveItems = async (itemsData: Array<Item>): Promise<boolean> =>
  await Promise.all(
    itemsData.map(
      async (item: Item) =>
        await admin
          .firestore()
          .collection("items")
          .doc(`${item.id}`)
          .set({ ...item, updatedOn: new Date() }, { merge: true })
          .then(() => true)
          .catch(async (error: any) => throwError(error))
    )
  )
    .then(() => true)
    .catch((error: any) => throwError(error));
