import {proVetApiUrl, request, DEBUG} from "../../../../config/config";

export const createVirtualAppointment = async (
  id: string,
  start: string,
  end: string,
  request_hash: string
): Promise<string | false> => {
  if (DEBUG)
    console.log("createVirtualAppointment PAYLOAD ->", {
      id,
      start,
      end,
      department: `${proVetApiUrl}/department/${
        2
        // environment?.type === 'production' ? '2' : '1'
      }/`,
      type: 2,
      title: "Virtual Consultation with MoVET",
      request_hash,
    });
  const virtualAppointmentUrl: any = await request
    .post(`/appointment/${id}/create_telemedicine_room/`, {
      id,
      start,
      end,
      department: `${proVetApiUrl}/department/${
        2
        // environment?.type === 'production' ? '2' : '1'
      }/`,
      type: 2,
      title: "Virtual Consultation with MoVET",
      request_hash,
    })
    .then((response: any) => {
      const {data} = response;
      if (DEBUG)
        console.log(
          `API Response: POST /appointment/${id}/create_telemedicine_room/ => `,
          data
        );
      return data?.telemedicine_url;
    })
    .catch(async (error: any) => {
      console.error("ERROR", JSON.stringify(error));
      return true;
    });
  if (DEBUG) console.log("virtualAppointment", virtualAppointmentUrl);
  // TODO: Handle if email_sent and sms_sent are false in provet response and trigger Firebase to handle sending notifications
  return virtualAppointmentUrl || null;
};
