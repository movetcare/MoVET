import { throwError } from "../../config/config";
// import { formatDateToMMDDYY } from "../../utils/formatDateToMMDDYYY";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { sendNotification } from "../sendNotification";
export const sendBookingRequestAdminNotification = async ({
  id,
  bookingRef,
}: {
  id: string;
  bookingRef: any;
}) => {
  const {
    client,
    createdAt,
    patients,
    reason,
    selectedPatients,
    requestedDateTime,
    location,
    address,
    selectedStaff,
  }: any = await bookingRef
    .get()
    .then((doc: any) => doc.data())
    .catch((error: any) => throwError(error));
  const { email, displayName, phoneNumber } = client;

  let allPatients = "";
  selectedPatients.forEach((selectedPatient: any) => {
    patients.map((patient: any) => {
      if (selectedPatient === patient?.id)
        allPatients += `<p><b>------------- PATIENT -------------</b></p><p><b>Name:</b> ${
          patient?.name
        }</p><p><b>Species:</b> ${patient?.species}</p><p><b>Gender:</b> ${
          patient?.gender
        }</p><p><b>Minor Illness:</b> ${
          patient?.hasMinorIllness
            ? `${JSON.stringify(patient?.illnessDetails?.symptoms)} - ${
                patient?.illnessDetails?.notes
              }`
            : " NONE"
        }</p>${
          patient.aggressionStatus
            ? `<p><b>Aggression Status:</b> "${patient?.aggressionStatus?.name}"</p>`
            : ""
        }${
          patient.vcprRequired
            ? `<p><b>VCPR Required:</b> ${
                patient?.vcprRequired ? "Yes" : "No"
              }</p>`
            : ""
        }<p><b>-----------------------------------</b></p>`;
    });
  });

  const message = `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
    ?.toDate()
    ?.toString()}</p>${
    displayName ? `<p><b>Client Name:</b> ${displayName}</p>` : ""
  }<p><b>Client Email:</b> ${email}</p>${
    phoneNumber
      ? `<p><b>Client Phone:</b> <a href="tel://${phoneNumber}">${formatPhoneNumber(
          phoneNumber?.replaceAll("+1", "")
        )}</a></p>`
      : ""
  }${
    Array.isArray(patients) && Array.isArray(selectedPatients)
      ? allPatients
      : ""
  }
  ${reason ? `<p><b>Reason:</b> ${reason.label}</p>` : ""}${
    requestedDateTime?.date
      ? `<p><b>Requested Date:</b> ${requestedDateTime.date}</p>`
      : ""
  }${
    requestedDateTime?.time
      ? `<p><b>Requested Time:</b> ${requestedDateTime.time}</p>`
      : ""
  }${
    location
      ? `<p><b>Requested Location:</b> ${location} ${
          address ? `- ${address?.full} (${address?.info})` : ""
        }</p>`
      : ""
  }${
    selectedStaff
      ? `<p><b>Requested Expert:</b> ${selectedStaff?.title} ${selectedStaff?.firstName} ${selectedStaff?.lastName}</p>`
      : ""
  }<p><a href="https://us.provetcloud.com/4285/client/${
    client?.uid
  }/tabs" style="border-radius: 40px; border: 2px solid rgb(255, 255, 255); display: inline-block; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; font-size: 16px; font-weight: bold; font-style: normal; padding: 18px; text-decoration: none; min-width: 30px; background-color: #E76159; color: rgb(255, 255, 255); --darkreader-inline-border-top:#D1CCBD; --darkreader-inline-border-right:#D1CCBD; --darkreader-inline-border-bottom:#D1CCBD; --darkreader-inline-border-left:#D1CCBD; --darkreader-inline-bgcolor:#E76159; --darkreader-inline-color:#e8e6e3;">Book Appointment</a></p>`;

  sendNotification({
    type: "email",
    payload: {
      to: "info@movetcare.com",
      replyTo: email,
      subject: `${
        displayName ? displayName : email ? email : ""
      } has submitted a new appointment request`,
      message,
    },
  });
};