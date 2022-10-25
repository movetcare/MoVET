import {fetchEntity} from "./../fetchEntity";
import {fetchItemsData} from "./fetchItemsData";
import {saveItems} from "./saveItems";

export const configureItems = async (): Promise<boolean> => {
  console.log("STARTING ITEMS CONFIGURATION");
  const items: Array<Item> = await fetchEntity("item");
  const itemIds: Array<string> = [];
  items.forEach((item: Item) => itemIds.push(item.id?.toString()));
  if (itemIds.length > 0) {
    const itemData: Array<Item> = (await fetchItemsData(
      itemIds as Array<string>
    )) as Array<any>;
    if (itemData) return await saveItems(itemData);
    else return false;
  } else return false;
};
