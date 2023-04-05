import { Controller } from "react-hook-form";
import { classNames } from "utils/classNames";
import ErrorMessage from "./ErrorMessage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = ({
  label,
  control,
  errors,
  name,
  required = false,
  disabled = false,
  className = null,
}: {
  label?: string;
  control: any;
  errors: any;
  name: string;
  required?: boolean;
  disabled?: boolean;
  className?: string | null;
}) => {
  return (
    <div className={className ? className : ""}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-movet-black font-abside mb-2"
        >
          {label} {required && <span className="text-movet-red">*</span>}
        </label>
      )}
      <div className="mt-1">
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              required={required}
              name={name}
              selected={value || new Date()}
              disabled={disabled}
              onChange={(date: any) => onChange(date)}
              className={classNames(
                disabled
                  ? "border-movet-gray text-movet-gray"
                  : "focus:ring-movet-brown focus:border-movet-brown",
                "py-3 px-4 block w-full rounded-lg font-abside-smooth"
              )}
            />
          )}
        />
        {errors[name]?.message && (
          <ErrorMessage errorMessage={errors[name].message} />
        )}
      </div>
    </div>
  );
};

export default DateInput;
