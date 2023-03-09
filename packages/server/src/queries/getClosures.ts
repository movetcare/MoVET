import { firestore } from "../firebase";
const DEBUG = false;
interface Closure {
  isActiveForClinic: boolean;
  endDate: any;
  startDate: any;
  isActiveForHousecalls: boolean;
  isActiveForTelehealth: boolean;
  showOnWebsite: boolean;
  name: string;
}
export const getClosures = async () => {
  try {
    const closures = await firestore
      .collection("configuration")
      .doc("closures")
      .get()
      .then((doc) => doc.data()?.closureDates);
    const websiteClosuresToDisplay: Array<Closure> = [];
    closures.forEach((closure: Closure) => {
      if (closure?.showOnWebsite)
        websiteClosuresToDisplay.push({
          ...closure,
          startDate: closure?.startDate?.toDate()?.toLocaleDateString("en-us", {
            weekday: "short",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }),
          endDate: closure?.endDate?.toDate()?.toLocaleDateString("en-us", {
            weekday: "short",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }),
        });
    });
    if (DEBUG)
      console.log("websiteClosuresToDisplay", websiteClosuresToDisplay);
    return websiteClosuresToDisplay;
  } catch (error) {
    console.error(error);
    return { error: (error as any)?.name || JSON.stringify(error) };
  }
};
