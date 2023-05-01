import MultiPatientClinicSettings from "./MultiPatientClinicSettings";
import VcprReasonClinicSettings from "./VcprReasonClinicSettings";
import StandardLunchClinicSettings from "./StandardLunchClinicSettings";
import StandardOperatingHoursClinicSettings from "./StandardOperatingHoursClinicSettings";
import { ClosuresClinicSettings } from "./ClosuresClinicSettings";
import { SchedulePreview } from "../SchedulePreview";
import { SameDayAppointmentClinicSettings } from "./SameDayAppointmentClinicSettings";
import StandardBufferClinicSettings from "./StandardBufferClinicSettings";
import { Button } from "ui";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ResourcesClinicSettings } from "./ResourcesClinicSettings";

const ClinicSettings = () => {
  const [showSchedulePreview, setShowSchedulePreview] =
    useState<boolean>(false);
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
          <Button
            color={showSchedulePreview ? "red" : "black"}
            text={showSchedulePreview ? "Hide Schedule" : "Show Schedule"}
            className="my-8"
            icon={faMagnifyingGlass}
            onClick={() => setShowSchedulePreview(!showSchedulePreview)}
          />
          <Transition
            show={showSchedulePreview}
            enter="transition ease-in duration-500"
            leave="transition ease-out duration-64"
            leaveTo="opacity-10"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
          >
            <SchedulePreview schedule="clinic" />
          </Transition>
          <ul role="list" className="mt-4 mb-8 divide-y divide-movet-gray">
            <ClosuresClinicSettings />
            <StandardOperatingHoursClinicSettings />
            <StandardBufferClinicSettings />
            <StandardLunchClinicSettings />
            <MultiPatientClinicSettings />
            <SameDayAppointmentClinicSettings />
            <ResourcesClinicSettings />
            <VcprReasonClinicSettings />
          </ul>
        </div>
      </div>
    </form>
  );
};

export default ClinicSettings;
