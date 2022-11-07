import React from "react";
import { Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import ErrorMessage from "./ErrorMessage";

export const DateInput = ({
  control,
  errors,
  name,
  defaultValue,
  required = false,
  label,
}: {
  control: any;
  errors: any;
  name: string;
  defaultValue?: string;
  required?: boolean;
  label?: string;
}) => {
  return (
    <div className="flex-col flex-1 bg-transparent">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            {label && (
              <label
                htmlFor={name || "form-input-element"}
                className="block text-sm font-medium text-movet-black font-abside mb-2"
              >
                {label} {required && <span className="text-movet-red">*</span>}
              </label>
            )}
            <PatternFormat
              allowEmptyFormatting
              className="border-movet-black focus:outline-none focus:ring-1 focus:ring-movet-brown focus:border-movet-brown relative border w-full bg-white rounded-xl pl-3 pr-10 py-3 text-left cursor-pointer sm:text-sm placeholder:text-gray font-abside-smooth"
              patternChar="#"
              format="##-##-####"
              placeholder="MM-DD-YYYY"
              mask={["M", "M", "D", "D", "Y", "Y", "Y", "Y"]}
              onValueChange={(values: any) => onChange(values.formattedValue)}
              onBlur={onBlur}
              defaultValue={defaultValue}
              value={value}
            />
            {value !== "" && errors[name]?.message && (
              <ErrorMessage errorMessage={errors[name]?.message} />
            )}
          </>
        )}
      />
    </div>
  );
};
