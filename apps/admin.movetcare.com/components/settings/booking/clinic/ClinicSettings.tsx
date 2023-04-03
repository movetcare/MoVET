import MultiPatientClinicSettings from "./MultiPatientClinicSettings";
import VcprReasonClinicSettings from "./VcprReasonClinicSettings";
import StandardHoursClinicSettings from "./StandardHoursClinicSettings";
import StandardLunchClinicSettings from "./StandardLunchClinicSettings";
import StandardDaysClinicSettings from "./StandardDaysClinicSettings";

const ClinicSettings = () => {
  return (
    <form className="divide-y divide-movet-gray lg:col-span-9">
      <div className="divide-y divide-movet-gray">
        <div className="px-4 sm:px-6">
          <div>
            <h2 className="text-2xl mb-2 leading-6 font-medium text-movet-black">
              CLINIC OPTIONS
            </h2>
            <p className="text-sm text-movet-black -mt-1">
              Use the options below to configure how clients can book
              appointments at the Clinic.
            </p>
          </div>
          <ul role="list" className="mt-4 mb-8 divide-y divide-movet-gray">
            <StandardDaysClinicSettings />
            <StandardHoursClinicSettings />
            <StandardLunchClinicSettings />
            <MultiPatientClinicSettings />
            <VcprReasonClinicSettings />
          </ul>
        </div>
      </div>
    </form>
  );
};

export default ClinicSettings;
