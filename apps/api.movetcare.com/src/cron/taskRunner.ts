import {
  functions,
  defaultRuntimeOptions,
  environment,
} from "../config/config";
import { processTaskQueue } from "../queue/processTaskQueue";

export const taskRunner: Promise<any> = functions
  .runWith({ ...defaultRuntimeOptions, memory: "2GB" })
  .pubsub.schedule("every 5 minutes")
  .onRun(() => environment?.type === "production" && processTaskQueue());
