import type { NextApiRequest, NextApiResponse } from "next";
import { processK9SmilesRequest } from "server";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return processK9SmilesRequest(req, res, "movetcare.com/k9-smiles/");
}
