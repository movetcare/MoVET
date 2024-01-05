import { Store, registerInDevtools } from "pullstate";

export interface Client {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}
export const AuthStore = new Store({
  isLoggedIn: false,
  initialized: true,
  client: null as Client | null,
  user: null,
} as any);

registerInDevtools({ AuthStore });
