import {functions, defaultRuntimeOptions} from "../config/config";
import {processTaskQueue} from "../queue/processTaskQueue";

export const taskRunner: Promise<any> = functions
  .runWith(defaultRuntimeOptions)
  .pubsub.schedule("every minute")
  .onRun(async () => await processTaskQueue());
