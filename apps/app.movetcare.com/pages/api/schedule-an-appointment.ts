import type { NextApiRequest, NextApiResponse } from "next";
import { processAppointmentBookingRequest } from "server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return processAppointmentBookingRequest(req, res);
}
