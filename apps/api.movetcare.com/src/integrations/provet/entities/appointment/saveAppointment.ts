import { sendAppointmentConfirmationEmail } from "../../../../notifications/templates/sendAppointmentConfirmationEmail";
import { fetchEntity } from "./../fetchEntity";
import { admin, throwError, environment } from "../../../../config/config";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { deleteAppointmentNotifications } from "./deleteAppointmentNotifications";
import { generateNewAppointmentNotifications } from "./generateNewAppointmentNotifications";
import type { Appointment } from "../../../../types/appointment";
// import {getAuthUserById} from '../../../../utils/auth/getAuthUserById';
// import {getDateStringFromDate} from '../../../../utils/getDateStringFromDate';

const DEBUG = false;
export const saveAppointment = async (
  proVetAppointmentData: Appointment,
  movetAppointmentData?: any,
): Promise<boolean> => {
  const data: any = {};

  if (proVetAppointmentData) {
    if (proVetAppointmentData?.id) data.id = proVetAppointmentData?.id;
    if (proVetAppointmentData?.confirmed)
      data.confirmed = proVetAppointmentData?.confirmed;
    if (
      proVetAppointmentData?.active === 1 ||
      proVetAppointmentData?.active === 0
    )
      data.active = proVetAppointmentData?.active;
    if (proVetAppointmentData?.request_hash)
      data.requestHash = proVetAppointmentData?.request_hash;
    if (proVetAppointmentData?.instructions)
      data.instructions = proVetAppointmentData?.instructions;
    if (proVetAppointmentData?.user) {
      await admin
        .firestore()
        .collection("users")
        .doc(`${getProVetIdFromUrl(proVetAppointmentData?.user)}`)
        .get()
        .then((doc: any) => {
          if (doc.exists)
            data.user = {
              name: doc.data()?.title,
              picture: doc.data()?.picture || null,
              bio: doc.data()?.areasOfExpertise,
              id: doc.data()?.id,
            };
        });
    }
    if (proVetAppointmentData?.additional_users) {
      const additionalUsers: any = [];
      proVetAppointmentData?.additional_users.forEach(async (user: any) => {
        await admin
          .firestore()
          .collection("users")
          .doc(`${getProVetIdFromUrl(user)}`)
          .get()
          .then((doc: any) => {
            if (doc.exists)
              additionalUsers.push({
                name: doc.data()?.title,
                picture: doc.data()?.picture || null,
                bio: doc.data()?.areasOfExpertise,
                id: doc.data()?.id,
              });
          });
      });
      data.additionalUsers = additionalUsers;
    }
    if (proVetAppointmentData?.reason)
      data.reason = proVetAppointmentData?.reason;
    if (proVetAppointmentData?.notes) data.notes = proVetAppointmentData?.notes;
    if (proVetAppointmentData?.start)
      data.start = new Date(proVetAppointmentData?.start);
    if (proVetAppointmentData?.end)
      data.end = new Date(proVetAppointmentData?.end);
    if (proVetAppointmentData?.client)
      data.client = getProVetIdFromUrl(String(proVetAppointmentData?.client));
    if (proVetAppointmentData?.type) data.type = proVetAppointmentData?.type;
    if (proVetAppointmentData?.telemedicine_room)
      data.telehealthRoom = proVetAppointmentData?.telemedicine_room;
    if (proVetAppointmentData?.telemedicine_url)
      data.telemedicineUrl = proVetAppointmentData?.telemedicine_url;
    if (proVetAppointmentData?.telemedicine_url_master)
      data.telemedicineUrl = proVetAppointmentData?.telemedicine_url_master;
    if (movetAppointmentData?.locationType)
      data.locationType = movetAppointmentData?.locationType;
    if (movetAppointmentData?.address)
      data.address = movetAppointmentData?.address;
    if (movetAppointmentData?.location)
      data.location = movetAppointmentData?.location;
    if (proVetAppointmentData?.resources)
      data.resources = proVetAppointmentData?.resources.map((resource) =>
        getProVetIdFromUrl(resource),
      );
    if (proVetAppointmentData?.ward)
      data.ward = getProVetIdFromUrl(proVetAppointmentData?.ward);
    if (movetAppointmentData?.patients)
      data.patients = movetAppointmentData?.patients;
    if (movetAppointmentData?.notes)
      data.additionalNotes = movetAppointmentData?.notes;
    if (movetAppointmentData?.illnessDetails)
      data.illnessDetails = movetAppointmentData?.illnessDetails;
    else if (proVetAppointmentData?.patients) {
      const proVetPatientData: any = await Promise.all(
        proVetAppointmentData?.patients.map(async (patientUrl: string) => {
          const id = getProVetIdFromUrl(patientUrl);
          const patientData = await fetchEntity("patient", id);
          const { name, species, gender } = patientData;
          let complaintsJson = null;
          let minorIllness = null;

          if (typeof proVetAppointmentData?.complaint === "string") {
            // if (DEBUG)
            //   console.log(
            //     "parse => ",
            //     JSON.parse(JSON.stringify(proVetAppointmentData?.complaint))
            //   );

            complaintsJson = JSON.parse(
              JSON.stringify(proVetAppointmentData?.complaint),
            );
            if (complaintsJson) {
              // if (DEBUG) {
              //   console.log("complaintsJson =>", complaintsJson);
              //   console.log("complaintsJson.length", complaintsJson.length);
              // }
              try {
                complaintsJson.map((patient: any) => {
                  // if (DEBUG) {
                  //   console.log("patient", patient);
                  //   console.log(
                  //     "id === parseInt(patient.id)",
                  //     id === parseInt(patient.id)
                  //   );
                  // }
                  if (id === parseInt(patient.id)) {
                    minorIllness = patient.minorIllness;
                  }
                });
              } catch {
                //if (DEBUG) console.log("Failed Parse");
                minorIllness = proVetAppointmentData?.complaint;
              }
            } else minorIllness = proVetAppointmentData?.complaint;
          }

          return {
            id,
            name,
            species,
            gender,
            minorIllness,
          };
        }),
      ).catch((error: any) => throwError(error));
      data.patients = proVetPatientData;
    }
  }

  if (proVetAppointmentData?.id) {
    const appointmentDocument = await admin
      .firestore()
      .collection("appointments")
      .doc(`${proVetAppointmentData.id}`);

    const appointmentIsToday =
      data.start.getMonth() === new Date().getMonth() &&
      data.start.getDay() === new Date().getDay();

    if (DEBUG) console.log("appointmentIsToday", appointmentIsToday);

    if (data?.active === 0)
      deleteAppointmentNotifications(proVetAppointmentData?.id);
    else if (data.client && !appointmentIsToday) {
      deleteAppointmentNotifications(proVetAppointmentData?.id);
      generateNewAppointmentNotifications({
        ...data,
        send24HourReminder: true,
        id: proVetAppointmentData?.id,
      });
      generateNewAppointmentNotifications({
        ...data,
        send30MinReminder: true,
        id: proVetAppointmentData?.id,
      });
    } else if (data.client && appointmentIsToday) {
      deleteAppointmentNotifications(proVetAppointmentData?.id);
      generateNewAppointmentNotifications({
        ...data,
        send30MinReminder: true,
        id: proVetAppointmentData?.id,
      });
    } else if (DEBUG)
      console.log(
        "SKIPPING APPOINTMENT NOTIFICATION GENERATION - APPOINTMENT DOES NOT HAVE A CLIENT!",
      );

    return await appointmentDocument
      .get()
      .then(async (document: any) => {
        if (document.exists) {
          if (DEBUG)
            console.log(
              `Existing Appointment Found: #${proVetAppointmentData.id}`,
            );
          return await appointmentDocument
            .update({
              ...data,
              updatedOn: new Date(),
            })
            .then(async () => {
              if (DEBUG)
                console.log(
                  `Successfully Synchronized PROVET Cloud Data w/ Firestore for Appointment #${proVetAppointmentData.id}`,
                );
              if (movetAppointmentData && environment.type === "production")
                sendAppointmentConfirmationEmail(
                  `${data?.client}`,
                  `${proVetAppointmentData.id}`,
                );
              return true;
            })
            .catch((error: any) => throwError(error));
        } else {
          if (DEBUG)
            console.log(
              `Unable to find Appointment #${proVetAppointmentData.id} in Firestore`,
            );
          return await admin
            .firestore()
            .collection("appointments")
            .doc(`${proVetAppointmentData.id}`)
            .set({
              ...data,
              createdOn: new Date(),
            })
            .then(async () => {
              if (DEBUG) {
                console.log(
                  `Successfully Generated Firestore Document for Appointment #${proVetAppointmentData.id}`,
                );
                // console.log(
                //   // eslint-disable-next-line quotes
                //   'Setting "onboardingComplete" to "true" for Client #',
                //   String(data?.client),
                // );
              }
              // admin
              //   .auth()
              //   .setCustomUserClaims(String(data?.client), {
              //     onboardingComplete: true,
              //   })
              //   .catch((error: any) => {
              //     if (error.code === "auth/user-not-found") {
              //       if (data?.client && environment.type === "production")
              //         admin
              //           .firestore()
              //           .collection("tasks_queue")
              //           .doc(`create_new_client_${data?.client}`)
              //           .set(
              //             {
              //               options: {
              //                 clientId: data?.client,
              //               },
              //               worker: "create_new_client",
              //               status: "scheduled",
              //               performAt: new Date(),
              //               createdOn: new Date(),
              //             },
              //             { merge: true },
              //           )
              //           .then(
              //             async () =>
              //               DEBUG &&
              //               console.log(
              //                 "CREATE NEW CLIENT TASK ADDED TO QUEUE => ",
              //                 `create_new_client_${data?.client}`,
              //               ),
              //           )
              //           .catch((error: any) => throwError(error));
              //     } else throwError(error);
              //   });
              if (environment.type === "production")
                sendAppointmentConfirmationEmail(
                  `${data?.client}`,
                  `${proVetAppointmentData.id}`,
                );
              return true;
            })
            .catch((error: any) => throwError(error));
        }
      })
      .catch((error: any) => throwError(error));
  } else return false;
};
