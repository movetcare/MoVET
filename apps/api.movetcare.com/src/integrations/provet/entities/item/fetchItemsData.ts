import { admin, throwError, request, DEBUG } from "../../../../config/config";
import { addMinutesToDateObject } from "../../../../utils/addMinutesToDateObject";
import { sliceArrayIntoChunks } from "../../../../utils/sliceArrayIntoChunks";

export const fetchItemsData = async (
  itemIds: Array<string>,
): Promise<Array<any>> => {
  const itemsData: Array<any> = [];
  if (itemIds.length > 30) {
    if (DEBUG)
      console.log(
        "ITEM IDS > 30 - ADDING REQUESTS TO TASK QUEUE",
        itemIds.length,
      );
    const itemIdChunks = sliceArrayIntoChunks(itemIds, 30);
    if (DEBUG) console.log("itemIdChunks[0]", itemIdChunks[0]);
    itemIdChunks.map(
      async (itemIds: Array<string>, index: number) =>
        index !== 0 &&
        (await admin
          .firestore()
          .collection("tasks_queue")
          .doc(`configure_items_${index}`)
          .set(
            {
              options: {
                itemIds,
              },
              worker: "configure_items",
              status: "scheduled",
              performAt: addMinutesToDateObject(new Date(), index),
              createdOn: new Date(),
            },
            { merge: true },
          )
          .then(
            async () =>
              DEBUG &&
              console.log(
                "CONFIGURE ITEMS TASK ADDED TO QUEUE => ",
                `configure_items_${index}`,
              ),
          )
          .catch((error: any) => throwError(error))),
    );
    await Promise.all(
      itemIdChunks[0].map(async (itemId: string) => {
        const initialItemData = await request
          .get(`/item/${itemId}/`)
          .then(
            (result: any) =>
              ({
                id: result.data?.id,
                code: result.data?.code,
                barcode: result.data?.barcode,
                accountNumber: result.data?.account_number,
                name: result.data?.name,
                printName: result.data?.print_name,
                hideOnConsultation: result.data?.hide_on_consultation,
                price: result.data?.price,
                priceWithVat: result.data?.price_with_vat,
                minimumPrice: result.data?.minimum_price,
                minimumPriceWithVat: result.data?.minimum_price_with_vat,
                wholesalePrice: result.data?.wholesale_price,
                wholesalerDiscount: result.data?.wholesaler_discount,
                producerDiscount: result.data?.producer_discount,
                specialDiscount: result.data?.special_discount,
                marginPercent: result.data?.margin_percent,
                vatGroup: result.data?.vat_group,
                invoiceGroup: result.data?.invoice_group,
                itemList: result.data?.item_list,
                typeCode: result.data?.type_code,
                polymorphicCtype: result.data?.polymorphic_ctype,
                parent: result.data?.parent,
                parentAmount: result.data?.parent_amount,
                instructions: result.data?.instructions,
                archived: result.data?.archived,
                archivedDateTime: result.data?.archived_datetime,
                excludeDiscount: result.data?.exclude_discount,
                linkedItems: result.data?.linked_items,
                hideOnCounterSaleSearch:
                  result.data?.hide_on_countersale_search,
                performedByRule: result.data?.performed_by_rule,
                royaltyFee: result.data?.royalty_fee,
                created: result.data?.created,
                modified: result.data?.modified,
                hideOnConsultationSearch:
                  result.data?.hide_on_consultation_search,
              }) as any,
          )
          .catch((error: any) => throwError(error));
        if (DEBUG) console.log("initialItemData", initialItemData);
        if (initialItemData) itemsData.push(initialItemData as any);
      }),
    );
    if (DEBUG) console.log("itemsData", itemsData);
    return itemsData;
  } else {
    await Promise.all(
      itemIds.map(async (itemId: string) => {
        const itemData = await request
          .get(`/item/${itemId}/`)
          .then(
            (result: any) =>
              ({
                id: result.data?.id,
                code: result.data?.code,
                barcode: result.data?.barcode,
                accountNumber: result.data?.account_number,
                name: result.data?.name,
                printName: result.data?.print_name,
                hideOnConsultation: result.data?.hide_on_consultation,
                price: result.data?.price,
                priceWithVat: result.data?.price_with_vat,
                minimumPrice: result.data?.minimum_price,
                minimumPriceWithVat: result.data?.minimum_price_with_vat,
                wholesalePrice: result.data?.wholesale_price,
                wholesalerDiscount: result.data?.wholesaler_discount,
                producerDiscount: result.data?.producer_discount,
                specialDiscount: result.data?.special_discount,
                marginPercent: result.data?.margin_percent,
                vatGroup: result.data?.vat_group,
                invoiceGroup: result.data?.invoice_group,
                itemList: result.data?.item_list,
                typeCode: result.data?.type_code,
                polymorphicCtype: result.data?.polymorphic_ctype,
                parent: result.data?.parent,
                parentAmount: result.data?.parent_amount,
                instructions: result.data?.instructions,
                archived: result.data?.archived,
                archivedDateTime: result.data?.archived_datetime,
                excludeDiscount: result.data?.exclude_discount,
                linkedItems: result.data?.linked_items,
                hideOnCounterSaleSearch:
                  result.data?.hide_on_countersale_search,
                performedByRule: result.data?.performed_by_rule,
                royaltyFee: result.data?.royalty_fee,
                created: result.data?.created,
                modified: result.data?.modified,
                hideOnConsultationSearch:
                  result.data?.hide_on_consultation_search,
              }) as any,
          )
          .catch((error: any) => throwError(error));
        if (DEBUG) console.log("itemData", itemData);
        if (itemData) itemsData.push(itemData as any);
      }),
    );
    if (DEBUG) console.log("itemsData", itemsData);
    return itemsData;
  }
};
