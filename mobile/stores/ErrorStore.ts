import { Store, registerInDevtools } from "pullstate";

export const ErrorStore = new Store({
  currentError: null as any,
  pastErrors: null as Array<any> | null,
});

registerInDevtools({ ErrorStore });
