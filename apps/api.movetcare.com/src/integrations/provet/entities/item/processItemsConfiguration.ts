import {DEBUG} from "../../../../config/config";
import { fetchItemsData } from "./fetchItemsData";
import { saveItems } from "./saveItems";

export const processItemsConfiguration = async ({
  itemIds,
}: {
  itemIds: Array<string>;
}): Promise<void> => {
  if (DEBUG) console.log("PROCESSING ITEMS CONFIGURATION => ", itemIds);
  if (itemIds) {
    const itemData: any | null = await fetchItemsData(itemIds as Array<string>);
    if (itemData)
      saveItems(itemData as any).then(
        () => DEBUG && console.log("SUCCESSFULLY CONFIGURED ITEMS", itemIds)
      );
    else if (DEBUG)
      console.log("FAILED ITEMS CONFIGURATION - MISSING ITEMS DATA");
  } else if (DEBUG)
    console.log("FAILED ITEMS CONFIGURATION - MISSING ITEMS IDS");
};
