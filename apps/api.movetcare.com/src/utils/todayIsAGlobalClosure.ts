import { admin, throwError } from "../config/config";
const DEBUG = true;

export const todayIsAGlobalClosure = async (): Promise<boolean> => {
  let todayIsAGlobalClosure = false;
  const allGlobalClosures = await admin
    .firestore()
    .collection("configuration")
    .doc("closures")
    .get()
    .then((doc: any) => doc.data()?.closureDates)
    .catch((error: any) => throwError(error));
  if (allGlobalClosures && allGlobalClosures.length > 0) {
    allGlobalClosures.forEach(
      (closure: { startDate: any; endDate: any; showOnWebsite: boolean }) => {
        const checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);
        const closureStartDate = closure.startDate.toDate();
        closureStartDate.setHours(0, 0, 0, 0);
        const closureEndDate = closure.endDate.toDate();
        closureEndDate.setHours(0, 0, 0, 0);
        if (DEBUG) {
          console.log("date", checkDate);
          console.log("closure OBJECT", closure);
          console.log("closureStartDate", closureStartDate);
          console.log("closureEndDate", closureEndDate);
          console.log(
            "date >= closureStartDate",
            checkDate >= closureStartDate,
          );
          console.log("date <= closureEndDate", checkDate <= closureEndDate);
        }
        if (
          closure?.showOnWebsite &&
          checkDate >= closureStartDate &&
          checkDate <= closureEndDate
        )
          todayIsAGlobalClosure = true;
      },
    );
  }
  return todayIsAGlobalClosure;
};
