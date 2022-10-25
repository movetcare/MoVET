import { Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { classNames } from "utilities";
import ErrorMessage from "./ErrorMessage";

const PhoneInput = ({
  label = null,
  control,
  errors,
  name,
  autoFocus = false,
  required = false,
  disabled = false,
  readOnly = false,
}: {
  label: string | null;
  control: any;
  errors: any;
  autoFocus?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name: string;
}) => (
  <label htmlFor={name || "phone"}>
    <p className="block text-sm font-medium text-movet-black font-abside m-0  mb-2">
      {label} {required && <span className="text-movet-red">*</span>}
    </p>
    <div className="mt-1 relative rounded-xl font-abside-smooth">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <PatternFormat
            name={`${name}-number`}
            type="tel"
            allowEmptyFormatting
            valueIsNumericString
            patternChar="#"
            format="+1 (###) ###-####"
            mask="_"
            onBlur={onBlur}
            value={value}
            onValueChange={(target: any) => {
              onChange(target.value);
            }}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            required={required}
            className={classNames(
              disabled
                ? "border-movet-gray text-movet-gray"
                : "focus:ring-movet-brown focus:border-movet-brown",
              "py-3 px-4 block w-full rounded-xl placeholder-movet-gray font-abside-smooth"
            )}
          />
        )}
      />
      <ErrorMessage errorMessage={errors[name]?.message} />
    </div>
  </label>
);

export default PhoneInput;
