import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import ErrorMessage from "./ErrorMessage";

export const NumberInput = ({
  control,
  errors,
  name,
  defaultValue = undefined,
  required = false,
  label,
  suffix,
}: {
  control: any;
  errors: any;
  name: string;
  defaultValue?: string;
  required?: boolean;
  label?: string;
  suffix?: string;
}) => (
  <div>
    {label && (
      <label
        htmlFor={name}
        className="block text-sm font-medium text-movet-black font-abside mb-2"
      >
        {label} {required && <span className="text-movet-red">*</span>}
      </label>
    )}
    <div className="mt-1 relative rounded-xl font-abside-smooth">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <NumericFormat
            defaultValue={defaultValue}
            valueIsNumericString
            name={`${name}-number`}
            type="text"
            suffix={suffix}
            onBlur={onBlur}
            value={value}
            onValueChange={(target: any) => onChange(target.value)}
            required={required}
            className="focus:ring-movet-brown focus:border-movet-brown py-3 px-4 block w-full rounded-xl placeholder-movet-gray font-abside-smooth"
          />
        )}
      />
      <ErrorMessage errorMessage={errors[name]?.message} />
    </div>
  </div>
);
