import { Controller } from "react-hook-form";
import { classNames } from "utils/classNames";
import ErrorMessage from "./ErrorMessage";

const TextInput = ({
  label,
  control,
  errors,
  name,
  placeholder,
  autoFocus = false,
  required = false,
  readOnly = false,
  disabled = false,
  autoComplete = "on",
  defaultValue = null,
  multiline = false,
  numberOfLines = 1,
  type = "text",
}: {
  label: string;
  control: any;
  errors: any;
  required?: boolean;
  name: string;
  placeholder: string;
  defaultValue?: string | null;
  autoComplete?:
    | "on"
    | "off"
    | "name"
    | "honorific-prefix"
    | "given-name"
    | "additional-name"
    | "family-name"
    | "honorific-suffix"
    | "nickname"
    | "organization-title"
    | "organization";
  readOnly?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
  numberOfLines?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  type: "text" | "number";
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name || "form-input-element"}
          className="block text-sm font-medium text-movet-black font-abside mb-2"
        >
          {label} {required && <span className="text-movet-red">*</span>}
        </label>
      )}
      <div className="mt-1">
        <Controller
          control={control}
          rules={
            required
              ? {
                  required: "Field is required",
                  minLength: {
                    message: "Must be more than more than 2 characters",
                    value: 2,
                  },
                  maxLength: {
                    message: "Must be less than more than 260 characters",
                    value: 260,
                  },
                }
              : {
                  minLength: {
                    message: "Must be more than more than 2 characters",
                    value: 2,
                  },
                  maxLength: {
                    message: "Must be less than more than 260 characters",
                    value: 260,
                  },
                }
          }
          render={({ field: { onChange, onBlur, value } }) =>
            multiline ? (
              <textarea
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                name={name}
                id={name}
                rows={numberOfLines || 2}
                cols={1}
                placeholder={placeholder || ""}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={classNames(
                  disabled
                    ? "border-movet-gray text-movet-gray"
                    : "focus:ring-movet-brown focus:border-movet-brown text-movet-black",
                  "py-3 px-4 block w-full rounded-lg font-abside-smooth"
                )}
              />
            ) : (
              <input
                type={type}
                name={name}
                id={name}
                autoFocus={autoFocus}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                autoComplete={autoComplete ? "on" : "off"}
                placeholder={placeholder || ""}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={classNames(
                  disabled
                    ? "border-movet-gray text-movet-gray"
                    : "focus:ring-movet-brown focus:border-movet-brown text-movet-black",
                  "py-3 px-4 block w-full rounded-lg font-abside-smooth"
                )}
              />
            )
          }
          name={name}
          defaultValue={defaultValue}
        />
      </div>
      {errors[name]?.message && (
        <ErrorMessage errorMessage={errors[name].message} />
      )}
    </div>
  );
};

export default TextInput;
