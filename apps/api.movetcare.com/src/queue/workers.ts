import { sendBookingRecoveryNotification } from "../notifications/templates/sendBookingRecoveryNotification";
import { processConfiguration } from "../config/processConfiguration";
import { createNewClientTask } from "../integrations/provet/entities/client/createNewClientTask";
import { processItemsConfiguration } from "../integrations/provet/entities/item/processItemsConfiguration";
import { processBreedConfiguration } from "../integrations/provet/entities/patient/breeds/processBreedConfiguration";
import { sendAppointmentReminderNotification } from "../notifications/templates/sendAppointmentReminderNotification";
import { environment } from "../config/config";
import { processHoursStatusAutomationUpdate } from "../utils/processHoursStatusAutomationUpdate";
import { sendClinicBookingRecoveryNotification } from "../notifications/templates/sendClinicBookingRecoveryNotification";
import { expirePatientVcpr } from "../integrations/provet/entities/patient/expirePatientVcpr";
// import { updateAppointmentToInProgress } from "../integrations/provet/entities/appointment/updateAppointmentToInProgress";
interface Workers {
  [key: string]: (options: any) => Promise<any>;
}

export const workers: Workers = {
  configure_app: async (options: any) => await processConfiguration(options),
  configure_breeds: async (options: any) =>
    await processBreedConfiguration(options),
  configure_items: async (options: any) =>
    await processItemsConfiguration(options),
  create_new_client: async (options: any) =>
    environment.type === "production"
      ? await createNewClientTask(options)
      : true,
  "30_min_appointment_notification": async (options: any) =>
    await sendAppointmentReminderNotification(options),
  "24_hour_appointment_notification": async (options: any) =>
    await sendAppointmentReminderNotification(options),
  clinic_booking_abandonment_notification_1_hour: async (options: any) =>
    await sendClinicBookingRecoveryNotification({ ...options, type: "1_HOUR" }),
  booking_abandonment_notification_1_hour: async (options: any) =>
    await sendBookingRecoveryNotification({ ...options, type: "1_HOUR" }),
  booking_abandonment_notification_24_hour: async (options: any) =>
    await sendBookingRecoveryNotification({ ...options, type: "24_HOUR" }),
  booking_abandonment_notification_3_day: async (options: any) =>
    await sendBookingRecoveryNotification({ ...options, type: "72_HOUR" }),
  hours_status_automation: async (options: any) =>
    await processHoursStatusAutomationUpdate(options),
  expire_patient_vcpr: async (options: any) => await expirePatientVcpr(options),
};
