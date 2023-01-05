import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import React from "react";
import { PatternFormat } from "react-number-format";

export const TimeInput = ({
  onChange,
  value,
  defaultValue,
  required = false,
  label,
}: {
  onChange: any;
  value: any;
  defaultValue?: string;
  required?: boolean;
  label?: string;
}) => {
  return (
    <div className="flex-col flex-1 bg-transparent text-center justify-center items-center">
      {label && (
        <label className="block text-sm font-medium text-movet-black font-abside mb-2">
          {label} {required && <span className="text-movet-red">*</span>}
        </label>
      )}
      <div className="flex flex-row justify-center items-center">
        <PatternFormat
          displayType="input"
          allowEmptyFormatting
          className="time-input border-movet-black focus:outline-none focus:ring-1 focus:ring-movet-brown focus:border-movet-brown relative border w-full sm:w-20 bg-white rounded-xl py-3 text-left cursor-pointer sm:text-sm placeholder:text-gray font-abside-smooth"
          patternChar="#"
          format={`##:##`}
          placeholder="HH:MM"
          mask={["H", "H", "M", "M"]}
          onValueChange={(values: any) => onChange(values.formattedValue)}
          isAllowed={(values) => {
            const hours = values?.formattedValue.split(":")[0];
            if (!hours.includes("H") && Number(hours) < 9) return false;
            const minutes = values?.formattedValue.split(":")[1];
            if (!minutes.includes("M") && Number(minutes) >= 60) return false;
            return Number(values?.floatValue) <= 1630;
          }}
          defaultValue={defaultValue}
          value={value}
        />
        <Transition
          show={value !== "HH:MM"}
          enter="transition ease-in duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="text-movet-brown mx-2"
            onClick={() => onChange("HH:MM")}
          />
        </Transition>
      </div>
    </div>
  );
};
