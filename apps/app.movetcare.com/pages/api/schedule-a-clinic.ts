import type { NextApiRequest, NextApiResponse } from "next";
import { processClinicAppointmentBookingRequest } from "server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return processClinicAppointmentBookingRequest(req, res);
}
