import { firestore } from "../firebase";
const DEBUG = false;
export const getWinterMode = async () => {
  try {
    const winterMode: {
      enableForNewPatientsOnly: string;
      endDate: any;
      startDate: any;
      isActiveOnWebApp: boolean;
      isActiveOnWebsite: boolean;
      message: string;
    } = await firestore
      .collection("configuration")
      .doc("bookings")
      .get()
      .then((doc) => doc.data()?.winterHousecallMode);
    const {
      enableForNewPatientsOnly,
      endDate,
      startDate,
      isActiveOnWebApp,
      isActiveOnWebsite,
      message,
    } = winterMode;
    if (DEBUG)
      console.log("(SSG) FIRESTORE QUERY -> getWinterMode() =>", {
        enableForNewPatientsOnly,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),

        isActiveOnWebApp,
        isActiveOnWebsite,
        message,
      });
    if (isActiveOnWebApp || isActiveOnWebsite) {
      const today = new Date();
      if (today > startDate.toDate() && today < endDate.toDate()) {
        if (DEBUG)
          console.log("✅ date is between the 2 dates", {
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            today,
          });
        return {
          isActive: true,
          enableForNewPatientsOnly: enableForNewPatientsOnly || null,
          message: message || null,
          isActiveOnWebApp: isActiveOnWebApp || false,
          isActiveOnWebsite: isActiveOnWebsite || false,
        };
      } else {
        if (DEBUG)
          console.log("⛔️ date is not in the range", {
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            today,
          });
        return { isActive: false };
      }
    }
  } catch (error) {
    console.error(error);
    return { error: (error as any)?.message || JSON.stringify(error) };
  }
};
