import type { NextApiResponse } from "next";
import type { ServerResponse } from "types";

export const sendResponse = ({
  status,
  error,
  res,
}: {
  status: ServerResponse["status"];
  error?: ServerResponse["error"];
  res: NextApiResponse<ServerResponse>;
}) => res.status(status).send(error ? { status, error } : { status });
