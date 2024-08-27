import { environment, admin, DEBUG } from "../../config/config";
import type { ClinicBooking } from "../../types/booking";
import type { EmailConfiguration } from "../../types/email";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import {
  getClientNotificationSettings,
  UserNotificationSettings,
} from "../../utils/getClientNotificationSettings";
import { getYYMMDDFromString } from "../../utils/getYYMMDDFromString";
import { sendNotification } from "../sendNotification";

export const sendClinicBookingRecoveryNotification = async ({
  id,
}: {
  id: string;
}): Promise<void> => {
  if (id) {
    const booking = await admin
      .firestore()
      .collection("clinic_bookings")
      .doc(id)
      .get()
      .then((doc: any) => {
        return { id, ...doc.data() } as ClinicBooking;
      });
    sendOneHourClinicBookingRecoveryNotification(booking);
    sendAdminClinicBookingRecoveryNotification(booking);
  } else if (DEBUG)
    console.log(
      // eslint-disable-next-line quotes
      'FAILED TO SEND BOOKING ABANDONMENT RECOVERY NOTIFICATION - MISSING "ID" AND/OR "TYPE"',
      { id },
    );
};

const sendAdminClinicBookingRecoveryNotification = async (
  booking: ClinicBooking,
) => {
  const {
    id,
    client,
    createdAt,
    patients,
    clinic,
    requestedDateTime,
    step,
    selectedPatients,
  } = booking;
  const { firstName, lastName, email, phone } = client;
  let allPatients = "";
  if (selectedPatients && patients)
    selectedPatients?.forEach((selectedPatient: any) => {
      patients.map((patient: any) => {
        if (selectedPatient === patient?.id)
          allPatients += `<p><b>------------- PATIENT -------------</b></p><p><b>Name:</b> ${patient?.name}</p><p><b>Species:</b> ${patient?.species}</p><p><b>Gender:</b> ${patient?.gender}</p>${
            patient.aggressionStatus
              ? `<p><b>Aggression Status:</b> "${
                  patient?.aggressionStatus
                    ? "IS AGGRESSIVE!"
                    : "Is not aggressive" ||
                      // eslint-disable-next-line quotes
                      'UNKNOWN - Update "Is Aggressive" custom field on patient\'s profile in ProVet!'
                } "</p>`
              : ""
          }${
            patient.vcprRequired
              ? `<p><b>VCPR Required:</b> ${
                  patient?.vcprRequired ? "Yes" : "No"
                }</p>`
              : ""
          }<p></p><p></p>`;
      });
    });
  const message = `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
    ?.toDate()
    ?.toLocaleString()}</p>${
    firstName && lastName
      ? `<p><b>Client Name:</b> ${firstName} ${lastName}</p>`
      : ""
  }<p><b>Client Email:</b> ${email}</p>${
    phone
      ? `<p><b>Client Phone:</b> <a href="tel://${phone}">${formatPhoneNumber(
          phone?.replaceAll("+1", ""),
        )}</a></p>`
      : ""
  }
  ${step ? "<p><b>Step:</b> " + step + "</p>" : "<p><b>Step:</b> Patient Selection</p>"}
  ${
    Array.isArray(patients) && Array.isArray(selectedPatients)
      ? allPatients
      : ""
  }
  ${clinic?.name ? "<p><b>Reason:</b> " + clinic?.name : ""}
  }
  ${
    requestedDateTime?.date
      ? `<p><b>Requested Date:</b> ${getYYMMDDFromString(
          new Date(requestedDateTime?.date)?.toString(),
        )}</p>`
      : ""
  }${requestedDateTime?.time ? `<p><b>Requested Time:</b> ${requestedDateTime?.time}</p>` : ""}`;
  if (id && email)
    sendNotification({
      type: "email",
      payload: {
        to: "info@movetcare.com",
        replyTo: email,
        subject: `${
          firstName && lastName
            ? firstName + " " + lastName
            : email
              ? email
              : ""
        } abandoned their appointment booking request for the "${clinic?.name}" clinic one hour ago`,
        message,
      },
    });
};

const sendOneHourClinicBookingRecoveryNotification = async (
  booking: ClinicBooking,
) => {
  if (DEBUG)
    console.log("SENDING ONE HOUR BOOKING RECOVERY NOTIFICATION", booking);
  const { isActive, client, id, clinic } = booking;
  const { email, uid } = client || {};
  if (isActive && id && email) {
    let emailHtml = "";
    if (client?.firstName) emailHtml += `<p>Hey ${client?.firstName}!</p>`;
    else emailHtml += "<p>Hey there!</p>";
    emailHtml += `<p>It looks like you were in the process of booking an appointment for the "${clinic?.name}" clinic with MoVET.</p><p><b>Click the link below to resume your session:</b></p><p><a href='${
      (environment.type === "production"
        ? "https://app.movetcare.com"
        : environment.type === "staging"
          ? "https://stage.app.movetcare.com"
          : "http://localhost:3001") + `/booking/${clinic?.id}/?email=${email}`
    }' >Complete Booking</a></p><p>At MoVET @ Belleview Station, we're changing the way that pet care services are handled. Our experienced veterinarian offers primary pet care and minor illness treatment through telehealth, in-clinic, and house appointments. Our goal is to make your vet appointments an easier, stress-free experience for you and your pet! So if your pet needs an annual wellness checkup, vaccines, or dental care, we're there!</p><p>We look forward to seeing you soon!</p><p>The MoVET Team</p><p></p>`;
    const emailConfig: EmailConfiguration = {
      to: email,
      subject:
        "Finish Booking Your Appointment for the " + clinic?.name + " Clinic!",
      message: emailHtml,
    };
    if (DEBUG)
      console.log("BOOKING RECOVERY NOTIFICATION EMAIL READY", emailConfig);
    if (client && uid) {
      const userNotificationSettings: UserNotificationSettings | false =
        await getClientNotificationSettings(uid);
      if (userNotificationSettings && userNotificationSettings?.sendEmail) {
        sendNotification({
          type: "email",
          payload: {
            ...emailConfig,
            client: client.uid,
          },
        });
      }
    } else if (DEBUG)
      console.log(
        "FAILED TO SEND ONE HOUR BOOKING RECOVERY NOTIFICATION EMAIL",
        booking,
      );
  }
};
