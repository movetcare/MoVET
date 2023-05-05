import MultiPatientClinicSettings from "./MultiPatientClinicSettings";
import VcprReasonClinicSettings from "./VcprReasonClinicSettings";
import StandardLunchClinicSettings from "./StandardLunchClinicSettings";
import StandardOperatingHoursClinicSettings from "./StandardOperatingHoursClinicSettings";
import { ClosuresClinicSettings } from "./ClosuresClinicSettings";
import { SchedulePreview } from "../SchedulePreview";
import { SameDayAppointmentClinicSettings } from "./SameDayAppointmentClinicSettings";
import StandardBufferClinicSettings from "./StandardBufferClinicSettings";
import { ResourcesClinicSettings } from "./ResourcesClinicSettings";

const ClinicSettings = () => (
  <form className="divide-y divide-movet-gray lg:col-span-9">
    <div className="divide-y divide-movet-gray">
      <div className="px-4 sm:px-6">
        <div>
          <h2 className="text-2xl mb-2 leading-6 font-medium text-movet-black">
            CLINIC OPTIONS
          </h2>
          <p className="text-sm text-movet-black -mt-1 mb-8">
            Use the options below to configure how clients can book appointments
            at the Clinic.
          </p>
        </div>
        <SchedulePreview schedule="clinic" />
        <ul role="list" className="mt-4 mb-8 divide-y divide-movet-gray">
          <ClosuresClinicSettings />
          <StandardOperatingHoursClinicSettings />
          <ResourcesClinicSettings />
          <StandardBufferClinicSettings />
          <StandardLunchClinicSettings />
          <MultiPatientClinicSettings />
          <SameDayAppointmentClinicSettings />
          <VcprReasonClinicSettings />
        </ul>
      </div>
    </div>
  </form>
);

export default ClinicSettings;
