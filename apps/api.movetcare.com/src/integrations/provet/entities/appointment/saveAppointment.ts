import {sendAppointmentConfirmationEmail} from "./../../../../notifications/sendAppointmentConfirmationEmail";
import {fetchEntity} from "./../fetchEntity";
import {admin, throwError, DEBUG, environment} from "../../../../config/config";
import {getProVetIdFromUrl} from "../../../../utils/getProVetIdFromUrl";
import {deleteAppointmentNotifications} from "./notifications/deleteAppointmentNotifications";
import {generateNewAppointmentNotifications} from "./notifications/generateNewAppointmentNotifications";
// import {getAuthUserById} from '../../../../utils/auth/getAuthUserById';
// import {getDateStringFromDate} from '../../../../utils/getDateStringFromDate';

export const saveAppointment = async (
  proVetAppointmentData: AppointmentType,
  movetAppointmentData?: any
): Promise<boolean> => {
  const data: any = {};

  if (proVetAppointmentData) {
    // data.record = proVetAppointmentData;
    if (
      proVetAppointmentData?.active === 1 ||
      proVetAppointmentData?.active === 0
    )
      data.active = proVetAppointmentData?.active;
    if (proVetAppointmentData?.request_hash)
      data.requestHash = proVetAppointmentData?.request_hash;
    if (proVetAppointmentData?.instructions)
      data.instructions = proVetAppointmentData?.instructions;
    if (proVetAppointmentData?.user)
      data.user = getProVetIdFromUrl(proVetAppointmentData?.user);
    if (proVetAppointmentData?.reason)
      data.reason = proVetAppointmentData?.reason;
    if (proVetAppointmentData?.notes) data.notes = proVetAppointmentData?.notes;
    if (proVetAppointmentData?.start)
      data.start = new Date(proVetAppointmentData?.start);
    if (proVetAppointmentData?.end)
      data.end = new Date(proVetAppointmentData?.end);
    if (proVetAppointmentData?.client)
      data.client = getProVetIdFromUrl(proVetAppointmentData?.client);
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
    if (movetAppointmentData?.patients)
      data.patients = movetAppointmentData?.patients;
    else if (proVetAppointmentData?.patients) {
      const proVetPatientData: any = await Promise.all(
        proVetAppointmentData?.patients.map(async (patientUrl: string) => {
          const id = getProVetIdFromUrl(patientUrl);
          const patientData = await fetchEntity("patient", id);
          const {name, species, gender} = patientData;
          let complaintsJson = null;
          let minorIllness = null;

          if (typeof proVetAppointmentData?.complaint === "string") {
            if (DEBUG)
              console.log(
                "parse => ",
                JSON.parse(JSON.stringify(proVetAppointmentData?.complaint))
              );

            complaintsJson = JSON.parse(
              JSON.stringify(proVetAppointmentData?.complaint)
            );
            if (complaintsJson) {
              if (DEBUG) {
                console.log("complaintsJson =>", complaintsJson);
                console.log("complaintsJson.length", complaintsJson.length);
              }
              try {
                complaintsJson.map((patient: any) => {
                  if (DEBUG) {
                    console.log("patient", patient);
                    console.log(
                      "id === parseInt(patient.id)",
                      id === parseInt(patient.id)
                    );
                  }
                  if (id === parseInt(patient.id)) {
                    minorIllness = patient.minorIllness;
                  }
                });
              } catch {
                if (DEBUG) console.log("Failed Parse");
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
        })
      ).catch(async (error: any) => await throwError(error));
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
      await deleteAppointmentNotifications(proVetAppointmentData?.id);
    else if (data.client && !appointmentIsToday) {
      await deleteAppointmentNotifications(proVetAppointmentData?.id);
      await generateNewAppointmentNotifications({
        ...data,
        send24HourReminder: true,
        id: proVetAppointmentData?.id,
      });
      await generateNewAppointmentNotifications({
        ...data,
        send30MinReminder: true,
        id: proVetAppointmentData?.id,
      });
    } else if (data.client && appointmentIsToday) {
      await deleteAppointmentNotifications(proVetAppointmentData?.id);
      await generateNewAppointmentNotifications({
        ...data,
        send30MinReminder: true,
        id: proVetAppointmentData?.id,
      });
    } else if (DEBUG)
      console.log(
        "SKIPPING APPOINTMENT NOTIFICATION GENERATION - APPOINTMENT DOES NOT HAVE A CLIENT!"
      );

    // if (data?.active === 0)
    //   await admin
    //     .firestore()
    //     .collection('appointment_reminders')
    //     .where('appointmentId', '==', proVetAppointmentData.id)
    //     .get()
    //     .then((querySnapshot: any) => {
    //       querySnapshot.forEach(async (doc: any) => {
    //         if (DEBUG) console.log(doc.id, ' => ', doc.data());
    //         await doc.ref
    //           .delete()
    //           .then(
    //             () =>
    //               DEBUG &&
    //               console.log('DELETED APPOINTMENT REMINDER FOR ', doc?.id)
    //           );
    //       });
    //     });
    // else if (
    //   data?.active === 1 &&
    //   new Date(proVetAppointmentData?.start) >= new Date()
    // ) {
    // const {email, phoneNumber, displayName} = await getAuthUserById(`${data?.client}`, [
    //   'email',
    //   'phoneNumber',
    //   'displayName',
    // ]);
    // if (email) {
    // const sendSms = await admin
    //   .firestore()
    //   .collection('clients')
    //   .doc(`${data?.client}`)
    //   .get()
    //   .then((document: any) => document.data()?.sendSms)
    //   .catch(async (error: any) => await throwError(error));
    // const wasCreatedInProvet = getProVetIdFromUrl(data?.reason) !== null;
    // let petDetails = null;
    // if (wasCreatedInProvet)
    //   petDetails = data?.patients.map((patient: any) =>
    //     `<li>${patient?.name}</li>`.replace(',', '')
    //   );
    // else
    //   petDetails = data?.patients.map((patient: any) =>
    //     `<li>${patient?.name}${
    //       patient?.symptom !== undefined &&
    //       patient?.symptom !== 'No Symptoms of Illness'
    //         ? ` is showing symptoms of ${JSON.parse(patient?.symptom).map(
    //             (symptoms: any) => {
    //               if (symptoms?.id === patient?.id)
    //                 return `${symptoms?.minorIllness.toLowerCase()} - "${
    //                   symptoms?.other
    //                 }"`;
    //               else return;
    //             }
    //           )}`
    //         : (patient?.symptom &&
    //             patient?.symptom === 'No Symptoms of Illness') ||
    //           patient?.minorIllness === undefined
    //         ? ' needs a general checkup'
    //         : ` is showing symptoms of ${patient?.minorIllness.toLowerCase()} - "${
    //             patient?.other
    //           }"`
    //     }</li>`.replace(',', '')
    //   );

    // if (DEBUG) console.log('petDetails', petDetails);
    // const petNames =
    //   data?.patients?.length === 1
    //     ? `${data?.patients[0]?.name}`
    //     : data?.patients
    //         .filter(
    //           (patient: any, index: any) =>
    //             index !== data?.patients.length - 1
    //         )
    //         .map((patient: any) => `${patient.name}`)
    //         .join(', ') +
    //       ', and ' +
    //       `${data?.patients[data?.patients.length - 1].name}`;

    // let reason: any = null;
    // if (wasCreatedInProvet) {
    //   reason = await fetchEntity(
    //     'reason',
    //     getProVetIdFromUrl(data?.reason)
    //   );
    //   if (DEBUG) console.log('reason', reason);
    // }
    //         const payload = {
    //           appointmentId: proVetAppointmentData?.id,
    //           id: `${proVetAppointmentData?.id}_email`,
    //           client: `${data?.client}`,
    //           type: 2,
    //           email,
    //           phone: phoneNumber,
    //           sendAt:
    //             new Date(
    //               new Date().setDate(
    //                 new Date(proVetAppointmentData?.start).getDate() - 1
    //               )
    //             ) || null,
    //           record: null,
    //           updatedOn: new Date(),
    //           message: `${
    //             displayName ? `<p>Hi ${displayName},</p>` : ''
    //           }<p>This is MoVET reminding you of your appointment <b>tomorrow</b> for:</p><ul>${petNames}</ul>${
    //             wasCreatedInProvet && reason
    //               ? `<p><b>Reason:</b> ${reason?.name || reason}</p>`
    //               : ''
    //           }\n\n<p><b><i>Please confirm we have the right information:</i></b></p>\n\n
    // ${
    //   data?.locationType === 'Home' && data?.address
    //     ? `<p><b>Appointment Location</b>: ${data?.address}</p>`
    //     : data?.locationType === 'Virtually'
    //     ? '<p><b>Appointment Location</b>: Virtual - We will send you a link to the virtual meeting room on the day of your appointment.</p>'
    //     : '<p><b>Appointment Location</b>: MoVET Clinic @ <a href="https://goo.gl/maps/GxPDfsCfdXhbmZVe9" target="_blank">4912 S Newport St Denver, CO 80237</a></p>'
    // }${
    //             data?.start
    //               ? `<p><b>Appointment Date & Time</b>: ${getDateStringFromDate(
    //                   data?.start
    //                 )}`
    //               : ''
    //           }${
    //             data?.instructions
    //               ? `<p><b>Instructions</b>: ${data?.instructions}</p>`
    //               : ''
    //           }${
    //             phoneNumber &&
    //             (data?.locationType === 'Home' ||
    //               data?.locationType === 'Virtually')
    //               ? `<p><b>Contact Phone Number</b>: ${phoneNumber}</p><p>*Please keep your phone handy the day of the ${
    //                   data?.locationType === 'Virtually'
    //                     ? 'consultation.'
    //                     : 'appointment. We will text you when we are on our way.</p>'
    //                 }`
    //               : ''
    //           }\n\n${
    //             data?.locationType === 'Home'
    //               ? '<p><b>Home Visit Trip Fee</b>: $60</p><p><b>*Additional charges will apply for add-on diagnostics, medications, pampering, etc.</b></p><p><i>A $60 cancellation fee will be charged if cancellation occurs within 24 hours of your appointment</i></p>\n\n'
    //               : ''
    //           }<p><b>Waiver:</b> Please complete this form prior to your appointment: <a href="https://docs.google.com/forms/d/1ZrbaOEzckSNNS1fk2PATocViVFTkVwcyF_fZBlCrTkY/">MoVET's Waiver / Release form</a> (If you have completed a waiver/release for this pet in the past, then a new one is not necessary.)</p><p><b>COVID-19 Questionnaire</b>: Please complete this Form prior to your appointment: <a href="https://docs.google.com/forms/d/1lKJs78fDD3gUBOV1l5TbomtoBXbgEm4xihij2wqq9VA/">COVID-19 Pre-Screening Questionnaire</a>. We thank you in advance for your cooperation.</p><p>Please be sure to reply to this email if you have any questions or need to make changes to your scheduled appointment.
    // </p>\n\n<p>Looking forward to meeting you,</p><p>- <a href="https://www.instagram.com/drlexiabramson/">Dr. A</a>, <a href="https://www.instagram.com/nessie_themovetpup/">Nessie</a>, and the <a href="https://www.facebook.com/MOVETCARE/">MoVET Team</a></p>`,
    //         };

    // if (DEBUG) console.log('payload ->', payload);

    // await admin
    //   .firestore()
    //   .collection('appointment_reminders')
    //   .doc(payload?.id)
    //   .set(
    //     {
    //       ...payload,
    //     },
    //     {merge: true}
    //   )
    //   .then(
    //     () =>
    //       DEBUG &&
    //       console.log(`GENERATED ${proVetAppointmentData?.id}_email`)
    //   )
    //   .catch(async (error: any) => await throwError(error));
    // if (sendSms) {
    //   await admin
    //     .firestore()
    //     .collection('appointment_reminders')
    //     .doc(`${proVetAppointmentData?.id}_sms`)
    //     .set(
    //       {
    //         ...payload,
    //         id: `${proVetAppointmentData?.id}_sms`,
    //         type: 2,
    //         message: `${
    //           displayName ? `Hi ${displayName}! ` : ''
    //         }This is MoVET reminding you of your appointment tomorrow at ${getDateStringFromDate(
    //           data?.start,
    //           'timeOnly'
    //         )}${petNames ? ` for ${petNames}.` : ''}`.replace(
    //           /(<([^>]+)>)/gi,
    //           ''
    //         ),
    //       },
    //       {merge: true}
    //     )
    //     .then(
    //       () =>
    //         DEBUG &&
    //         console.log(`GENERATED ${proVetAppointmentData?.id}_sms`)
    //     )
    //     .catch(async (error: any) => await throwError(error));
    // }
    // }
    // }

    return await appointmentDocument
      .get()
      .then(async (document: any) => {
        if (document.exists) {
          if (DEBUG)
            console.log(
              `Existing Appointment Found: #${proVetAppointmentData.id}`
            );
          return await appointmentDocument
            .update({
              ...data,
              updatedOn: new Date(),
            })
            .then(async () => {
              if (DEBUG)
                console.log(
                  `Successfully Synchronized PROVET Cloud Data w/ Firestore for Appointment #${proVetAppointmentData.id}`
                );
              return movetAppointmentData
                ? await sendAppointmentConfirmationEmail(
                    `${data?.client}`,
                    `${proVetAppointmentData.id}`
                  )
                : true;
            })
            .catch(async (error: any) => await throwError(error));
        } else {
          if (DEBUG)
            console.log(
              `Unable to find Appointment #${proVetAppointmentData.id} in Firestore`
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
                  `Successfully Generated Firestore Document for Appointment #${proVetAppointmentData.id}`
                );
                console.log(
                  "Setting \"onboardingComplete\" to \"true\" for Client #",
                  String(data?.client)
                );
              }
              await admin
                .auth()
                .setCustomUserClaims(String(data?.client), {
                  onboardingComplete: true,
                })
                .catch(async (error: any) => {
                  if (error.code === "auth/user-not-found") {
                    if (data?.client && environment.type !== "development")
                      await admin
                        .firestore()
                        .collection("tasks_queue")
                        .doc(`create_new_client_${data?.client}`)
                        .set(
                          {
                            options: {
                              clientId: data?.client,
                            },
                            worker: "create_new_client",
                            status: "scheduled",
                            performAt: new Date(),
                            createdOn: new Date(),
                          },
                          {merge: true}
                        )
                        .then(
                          async () =>
                            DEBUG &&
                            console.log(
                              "CREATE NEW CLIENT TASK ADDED TO QUEUE => ",
                              `create_new_client_${data?.client}`
                            )
                        )
                        .catch(async (error: any) => await throwError(error));
                  } else await throwError(error);
                });
              return await sendAppointmentConfirmationEmail(
                `${data?.client}`,
                `${proVetAppointmentData.id}`
              );
            })
            .catch(async (error: any) => await throwError(error));
        }
      })
      .catch(async (error: any) => await throwError(error));
  } else return false;
};
