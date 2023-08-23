import { Store, registerInDevtools } from "pullstate";

export const AuthStore = new Store({
  isLoggedIn: false,
  initialized: false,
  user: null,
} as any);

registerInDevtools({ AuthStore });
