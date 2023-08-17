import type { NextApiResponse } from "next";
import type { ServerResponse } from "types";

export const sendResponse = ({
  status,
  error,
  res,
  payload,
}: {
  status: ServerResponse["status"];
  error?: ServerResponse["error"];
  res: NextApiResponse<ServerResponse>;
  payload?: any;
}) =>
  res
    .status(status)
    .send(error ? { status, error } : ({ status, payload } as any));
