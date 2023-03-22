import { firestore } from "../firebase";
const DEBUG = false;
interface Hours {
  type:
    | "Clinic @ Belleview Station"
    | "Boutique @ Belleview Station"
    | "Clinic Walk-In Hours"
    | "Housecalls";
  days: string;
  times: string;
}
export const getHours = async () => {
  try {
    const hours = await firestore
      .collection("configuration")
      .doc("openings")
      .get()
      .then((doc) => doc.data()?.openingDates);
    const websiteOpeningsToDisplay: Array<Hours> = [];
    if (hours)
      hours.forEach((hours: Hours) => {
        if (hours?.type) websiteOpeningsToDisplay.push(hours);
      });
    if (DEBUG)
      console.log("websiteOpeningsToDisplay", websiteOpeningsToDisplay);
    return websiteOpeningsToDisplay;
  } catch (error) {
    console.error(error);
    return { error: (error as any)?.name || JSON.stringify(error) };
  }
};
