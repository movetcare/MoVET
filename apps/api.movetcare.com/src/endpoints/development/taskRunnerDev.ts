import {Response} from "express";
import {functions, defaultRuntimeOptions} from "../../config/config";
import {processTaskQueue} from "../../queue/processTaskQueue";

export const taskRunnerDev: Promise<Response> = functions
  .runWith(defaultRuntimeOptions)
  .https.onRequest((request: any, response: any) => {
    if (request.headers.host === "localhost:5001") {
      processTaskQueue();
      return response.status(200).send();
    }
    return response.status(400).send();
  });
