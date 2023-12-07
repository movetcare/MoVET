import { Controller } from "react-hook-form";
import Select from "react-select";
import ErrorMessage from "./ErrorMessage";

export const SearchInput = ({
  control,
  errors,
  name,
  label,
  options,
  required = false,
  defaultValue = undefined,
  placeholder = "Select an Option...",
}: {
  control: any;
  errors: any;
  name: string;
  defaultValue?: any;
  required?: boolean;
  label?: string;
  placeholder?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
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
            <Select
              defaultValue={defaultValue}
              placeholder={placeholder}
              options={options}
              onChange={onChange}
              value={value}
              onBlur={onBlur}
              styles={{
                input: (base: any) => ({
                  ...base,
                  fontFamily: "Abside Smooth",
                  borderWidth: 0,
                  borderColor: "transparent",
                  boxShadow: "none",
                  "input:focus": {
                    boxShadow: "none",
                    borderWidth: 0,
                    borderColor: "transparent",
                  },
                  "input:hover": {
                    boxShadow: "none",
                    borderWidth: 0,
                    borderColor: "transparent",
                  },
                }),
                control: (base: any) => ({
                  ...base,
                  boxShadow: "none",
                  borderWidth: 0,
                  borderColor: "transparent",
                  fontFamily: "Abside Smooth",
                }),
                option: (base: any, state: any) => ({
                  ...base,
                  boxShadow: "none",
                  fontWeight: state.isSelected ? "bold" : "normal",
                  fontFamily: "Abside Smooth",
                  color: state.isSelected ? "#f6f2f0" : "#232127",
                  backgroundColor: state.isSelected ? "#6c382b" : "transparent",
                }),
                singleValue: (base, state) =>
                  ({
                    ...base,
                    borderWidth: 0,
                    borderColor: "transparent",
                    fontFamily: "Abside Smooth",
                    color: state.data.color,
                  }) as any,
                indicatorSeparator: (base: any) => ({
                  ...base,
                  backgroundColor: "#232127",
                }),
                dropdownIndicator: (base: any) => ({
                  ...base,
                  color: "#232127",
                  ":hover": {
                    color: "#232127",
                  },
                }),
              }}
              theme={(theme: any) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  danger: "#E76159",
                  primary50: "#A15643",
                  primary: "#232127",
                },
              })}
              className="search-input border-movet-black relative border w-full bg-white rounded-xl py-2 text-left cursor-pointer sm:text-sm"
            />
          </>
        )}
      />
      <ErrorMessage errorMessage={errors[name]?.message} />
    </div>
  );
};
