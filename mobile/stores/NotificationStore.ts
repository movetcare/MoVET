import { Store, registerInDevtools } from "pullstate";

export const NotificationStore = new Store({
  expoPushToken: null,
  notification: null,
} as any);

registerInDevtools({ NotificationStore });
