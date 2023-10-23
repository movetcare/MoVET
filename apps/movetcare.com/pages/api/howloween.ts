import type { NextApiRequest, NextApiResponse } from "next";
import { processHowloweenRequest } from "server";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return processHowloweenRequest(req, res, "movetcare.com/howloween/");
}
