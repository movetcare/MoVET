import type { NextApiRequest, NextApiResponse } from "next";
import { processContactRequest } from "server";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return processContactRequest(req, res);
}
