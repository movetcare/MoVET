import type { PopUpAd } from "types";
import { firestore } from "../firebase";

export const getPopUpAd = async () => {
  try {
    return await firestore
      .collection("alerts")
      .doc("pop_up_ad")
      .get()
      .then((doc) => {
        return {
          icon: doc.data()?.icon || "bullhorn",
          title: doc.data()?.title || "MISSING: title",
          description: doc.data()?.description || "MISSING: description",
          imagePath:
            "https://movetcare.com" + doc.data()?.imagePath ||
            "https://movetcare.com/images/logos/logo-paw-black.png",
          urlRedirect:
            "https://movetcare.com" + doc.data()?.urlRedirect ||
            "https://movetcare.com",
          ignoreUrlPath:
            "https://movetcare.com" + doc.data()?.ignoreUrlPath ||
            "https://movetcare.com",
          isActive: doc.data()?.isActive || false,
          autoOpen: doc.data()?.autoOpen || false,
          height: doc.data()?.height || 400,
          width: doc.data()?.width || 400,
        } as PopUpAd;
      });
  } catch (error) {
    console.error(error);
    return { error: (error as any)?.name || JSON.stringify(error) };
  }
};
