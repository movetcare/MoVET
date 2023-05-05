import { firestore } from "../firebase";
export const getHoursStatus = async () => {
  try {
    return await firestore
      .collection("configuration")
      .doc("bookings")
      .get()
      .then((doc) => {
        return {
          boutiqueStatus: doc.data()?.boutiqueStatus,
          clinicStatus: doc.data()?.clinicStatus,
          housecallStatus: doc.data()?.housecallStatus,
          walkinsStatus: doc.data()?.walkinsStatus,
        };
      });
  } catch (error) {
    console.error(error);
    return { error: (error as any)?.message || JSON.stringify(error) };
  }
};
