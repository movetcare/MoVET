import { Controller } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { classNames } from 'utils/classNames';
import ErrorMessage from './ErrorMessage';

const PhoneInput = ({
  label,
  control,
  errors,
  name,
  autoFocus = false,
  required = false,
  disabled = false,
  readOnly = false,
}: {
  label: string;
  control: any;
  errors: any;
  autoFocus?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name: string;
}) => {
  return (
    <>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-movet-black font-abside mb-2"
        >
          {label} {required && <span className="text-movet-red">*</span>}
        </label>
      )}
      <div className="mt-1 relative rounded-lg font-abside-smooth">
        <Controller
          name={name}
          control={control}
          rules={
            required
              ? {
                  required: 'Field is required',
                  minLength: {
                    value: 10,
                    message: 'Must be a 10 digit US phone number',
                  },
                  maxLength: {
                    value: 10,
                    message: 'Must be a 10 digit US phone number',
                  },
                }
              : {
                  minLength: {
                    value: 10,
                    message: 'Must be a 10 digit US phone number',
                  },
                  maxLength: {
                    value: 10,
                    message: 'Must be a 10 digit US phone number',
                  },
                }
          }
          render={({ field: { onChange, onBlur, value } }) => (
            <PatternFormat
              name={`${'test'}-number`}
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
                  ? 'border-movet-gray text-movet-gray'
                  : 'focus:ring-movet-brown focus:border-movet-brown',
                'py-3 px-4 block w-full rounded-lg placeholder-movet-gray font-abside-smooth'
              )}
            />
          )}
        />
        {errors[name]?.message && (
          <ErrorMessage errorMessage={errors[name].message} />
        )}
      </div>
    </>
  );
};

export default PhoneInput;
