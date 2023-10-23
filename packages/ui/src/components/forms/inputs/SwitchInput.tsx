import { Switch } from "@headlessui/react";
import { Controller } from "react-hook-form";
import { classNames } from "utilities";
import { ErrorMessage } from "../../elements";

const SwitchInput = ({
  label,
  title,
  control,
  errors,
  name,
  centered = false,
  autoFocus = false,
  disabled = false,
  defaultValue = null,
  required = false,
}: {
  label: any;
  title?: string;
  control: any;
  errors: any;
  name: string;
  defaultValue?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  centered?: boolean;
}) => {
  return (
    <>
      <div
        className={`flex items-center justify-center ${
          centered ? "flex-col" : "flex-row"
        }`}
      >
        {title && (
          <label
            htmlFor={name || "form-input-element"}
            className="block text-sm font-medium text-movet-black font-abside mb-4"
          >
            {title} {required && <span className="text-movet-red">*</span>}
          </label>
        )}
        <div className="flex flex-row items-center text-center">
          <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field: { onChange, onBlur, value } }: any) => (
              <Switch
                name={name}
                autoFocus={autoFocus}
                disabled={disabled}
                onBlur={onBlur}
                checked={value}
                onChange={onChange}
                className={classNames(
                  value ? "bg-movet-brown" : "bg-movet-black",
                  disabled
                    ? "bg-opacity-50"
                    : "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-brown",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 switch-input",
                )}
              >
                <span className="sr-only">{label}</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    value ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                  )}
                />
              </Switch>
            )}
          />
        </div>
        <div className="ml-3">{label}</div>
        <ErrorMessage errorMessage={errors[name]?.message} />
      </div>
    </>
  );
};

export default SwitchInput;
