import { firestore } from "../firebase";
export const getHoursStatus = async () => {
  try {
    return await firestore
      .collection("configuration")
      .doc("hours_status")
      .get()
      .then((doc) => {
        return {
          boutiqueStatus: doc.data()?.boutiqueStatus || null,
          clinicStatus: doc.data()?.clinicStatus || null,
          housecallStatus: doc.data()?.housecallStatus || null,
          walkinsStatus: doc.data()?.walkinsStatus || null,
        };
      });
  } catch (error) {
    console.error(error);
    return { error: (error as any)?.message || JSON.stringify(error) };
  }
};
