import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import ErrorMessage from './ErrorMessage';

export const NumberInput = ({
  control,
  errors,
  name,
  defaultValue = undefined,
  required = false,
  label,
  suffix,
  placeholder = undefined,
}: {
  control: any;
  errors: any;
  name: string;
  defaultValue?: string;
  required?: boolean;
  label?: string;
  suffix?: string;
  placeholder?: string | undefined;
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
            placeholder={placeholder}
            name={`${name}-number`}
            type="text"
            suffix={suffix}
            onBlur={onBlur}
            value={value}
            onValueChange={(target: any) => onChange(target.value)}
            required={required}
            className="mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-full"
          />
        )}
      />
      <ErrorMessage errorMessage={errors[name]?.message} />
    </div>
  </div>
);
