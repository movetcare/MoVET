import { sendBookingRecoveryNotification } from "../notifications/templates/sendBookingRecoveryNotification";
import { processConfiguration } from "../config/processConfiguration";
import { createNewClientTask } from "../integrations/provet/entities/client/createNewClientTask";
import { processItemsConfiguration } from "../integrations/provet/entities/item/processItemsConfiguration";
import { processBreedConfiguration } from "../integrations/provet/entities/patient/breeds/processBreedConfiguration";
import { sendAppointmentReminderNotification } from "../notifications/templates/sendAppointmentReminderNotification";

interface Workers {
  [key: string]: (options: any) => Promise<any>;
}

export const workers: Workers = {
  configure_app: async (options: any) => await processConfiguration(options),
  configure_breeds: async (options: any) =>
    await processBreedConfiguration(options),
  configure_items: async (options: any) =>
    await processItemsConfiguration(options),
  create_new_client: async (options: any) => await createNewClientTask(options),
  "30_min_appointment_notification": async (options: any) =>
    await sendAppointmentReminderNotification({
      ...options,
    }),
  "24_hour_appointment_notification": async (options: any) =>
    await sendAppointmentReminderNotification({
      ...options,
    }),
  booking_abandonment_notification_1_hour: async (options: any) =>
    await sendBookingRecoveryNotification({ ...options, type: "1_HOUR" }),
  booking_abandonment_notification_24_hour: async (options: any) =>
    await sendBookingRecoveryNotification({ ...options, type: "24_HOUR" }),
  booking_abandonment_notification_3_day: async (options: any) =>
    await sendBookingRecoveryNotification({ ...options, type: "72_HOUR" }),
};
