import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller } from "react-hook-form";
import { capitalizeFirstLetter } from "utilities";
import { classNames } from "utilities";
import { ErrorMessage } from "../../elements";

export const ToggleInput = ({
  label = "",
  control,
  errors,
  name,
  required = false,
  options,
  defaultValue = null,
}: {
  label?: any;
  control: any;
  errors: any;
  required?: boolean;
  name: string;
  defaultValue?: string | null;
  disabled?: boolean;
  options: Array<{ name: string; icon: any }>;
}) => (
  <div className="flex flex-col items-center justify-center">
    {label && (
      <label
        htmlFor={name || "form-input-element"}
        className="block text-sm font-medium text-movet-black font-abside mb-4"
      >
        {label} {required && <span className="text-movet-red">*</span>}
      </label>
    )}
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      render={({ field: { onChange, onBlur, value } }: any) => (
        <div className="flex flex-col sm:flex-row justify-center items-center w-full px-4 sm:px-0">
          {options.map((option: { name: string; icon: any }, index: number) => (
            <div
              id={option.name}
              className={`bg-movet-black rounded-full text-movet-white px-10 py-4 my-2 sm:my-0 mx-2 cursor-pointer hover:bg-movet-brown w-full flex justify-center items-center shadow-xl hover:shadow-2xl ease-in-out duration-500 ${classNames(
                value !== option.name ? "bg-movet-black" : "bg-movet-brown",
              )}`}
              onBlur={onBlur}
              key={index}
              onClick={() => onChange(option.name)}
            >
              {Object.prototype.toString.call(option.icon) ===
              "[object String]" ? (
                option.icon
              ) : (
                <FontAwesomeIcon icon={option.icon} size="lg" />
              )}
              <span className="ml-2">{capitalizeFirstLetter(option.name)}</span>
            </div>
          ))}
        </div>
      )}
    />
    <ErrorMessage errorMessage={errors[name]?.message} />
  </div>
);
