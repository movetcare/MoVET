import { admin, DEBUG, throwError } from "../../../../config/config";
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
          .then(() => {
            if (DEBUG) console.log("ITEM SAVED: ", item);
            return true;
          })
          .catch((error: any) => throwError(error))
    )
  )
    .then(() => {
      if (DEBUG) console.log("ALL ITEM SAVED!");
      return true;
    })
    .catch((error: any) => throwError(error));
