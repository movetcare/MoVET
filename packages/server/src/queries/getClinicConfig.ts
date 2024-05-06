import { ClinicConfig } from "types";
import { firestore } from "../firebase";
const DEBUG = true;
export const getClinicConfig = async ({ id }: { id: string }) => {
  try {
    const clinicConfigs = await firestore
      .collection("configuration")
      .doc("pop_up_clinics")
      .get()
      .then((doc) => doc.data()?.popUpClinics);
    if (DEBUG)
      console.log(
        "(SSG) FIRESTORE QUERY -> getClinicConfig() =>",
        clinicConfigs,
      );
    if (id === "all") {
      const paths: any = [];
      clinicConfigs.forEach((clinic: ClinicConfig) => {
        if (clinic?.isActive)
          paths.push({
            params: { id: clinic?.id },
          });
      });
      if (DEBUG) console.log("paths", paths);
      return paths.length ? paths : [{ params: { id: "" } }];
    } else if (id) {
      const clinicConfig: ClinicConfig = clinicConfigs.find(
        (clinic: ClinicConfig) => clinic?.id === id,
      );
      // if (clinicConfig?.schedule?.date)
      //   clinicConfig.schedule.date = clinicConfig.schedule.date
      //     .toDate()
      //     ?.toLocaleDateString("en-us", {
      //       year: "numeric",
      //       month: "numeric",
      //       day: "numeric",
      //     });
      return {
        id: clinicConfig?.id,
        name: clinicConfig?.name,
        description: clinicConfig?.description,
      };
    }
  } catch (error) {
    console.error(error);
    return { error: (error as any)?.message || JSON.stringify(error) };
  }
};
