import type { NextApiResponse } from "next";
export interface ServerResponse {
  success: boolean;
  error?: string;
}

export const sendResponse = ({
  statusCode,
  success,
  error = undefined,
  res,
}: {
  statusCode: 200 | 400 | 405 | 500;
  success: boolean;
  error?: string | undefined;
  res: NextApiResponse<ServerResponse>;
}) =>
  res.status(statusCode).send(
    error
      ? {
          success,
          error,
        }
      : { success }
  );
