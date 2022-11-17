import {configureShifts} from "../integrations/provet/entities/shift/configureShifts";
import {functions, defaultRuntimeOptions} from "../config/config";

export const refreshShifts: Promise<void> = functions
  .runWith(defaultRuntimeOptions)
  .pubsub.schedule("every 60 minutes")
  .onRun(() => configureShifts());
