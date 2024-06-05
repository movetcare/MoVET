import type { ClinicBooking, ClinicConfig } from "types";
import { firestore } from "../firebase";
const DEBUG = false;
export const getClinicConfig = async ({
  id,
}: {
  id: string;
}): Promise<ClinicBooking["clinic"] | any> => {
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
      return paths?.length ? paths : [{ params: { id: "404" } }];
    } else if (id === "summary") {
      const activePopUpClinics: any = [];
      clinicConfigs.forEach((clinic: ClinicConfig) => {
        console.log("clinic?.isTestClinic", clinic?.isTestClinic);
        if (
          clinic?.isActive &&
          (clinic?.isTestClinic !== true ||
            typeof clinic?.isTestClinic === "undefined")
        )
          activePopUpClinics.push({
            id: clinic?.id,
            name: clinic?.name,
            schedule: {
              date: clinic?.schedule?.date
                ? clinic.schedule.date.toDate()?.toLocaleDateString("en-us", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : null,
              startTime: clinic?.schedule?.startTime,
              endTime: clinic?.schedule?.endTime,
            },
          });
      });
      return activePopUpClinics;
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
        vcprRequired: clinicConfig?.vcprRequired || null,
        address: clinicConfig?.remoteLocation
          ? clinicConfig?.address
          : "MoVET @ Belleview Station",
        addressInfo: clinicConfig?.remoteLocation
          ? clinicConfig?.addressInfo
          : null,
        placeId: clinicConfig?.remoteLocation
          ? clinicConfig?.placeId
          : "ChIJ9aCJc9mHbIcRu0B0dJWB4x8",
        schedule: {
          date: clinicConfig?.schedule?.date
            ? clinicConfig.schedule.date.toDate().toLocaleDateString("en-us", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })
            : null,
          startTime: clinicConfig?.schedule?.startTime,
          endTime: clinicConfig?.schedule?.endTime,
        },
      };
    }
  } catch (error) {
    console.error(error);
    return { error: (error as any)?.message || JSON.stringify(error) } as any;
  }
};
