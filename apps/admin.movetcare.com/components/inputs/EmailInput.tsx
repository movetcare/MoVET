import { Controller } from 'react-hook-form';
import { classNames } from 'utils/classNames';
import ErrorMessage from './ErrorMessage';

const EmailInput = ({
  label,
  control,
  errors,
  name,
  placeholder,
  autoFocus = false,
  required = false,
  disabled = false,
  readOnly = false,
  autoComplete = 'email',
}: {
  label?: string;
  control: any;
  errors: any;
  name: string;
  placeholder: string;
  autoFocus?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: 'on' | 'off' | 'email';
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
      <div className="mt-1">
        <Controller
          name={name}
          control={control}
          rules={
            required
              ? {
                  required: 'Field is required',
                  pattern: {
                    value:
                      /* eslint-disable */
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Email is not formatted correctly',
                  },
                }
              : {
                  pattern: {
                    value:
                      /* eslint-disable */
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Email is not formatted correctly',
                  },
                }
          }
          render={({ field: { onChange, onBlur, value } }) => (
            <input
              placeholder={placeholder || ''}
              disabled={disabled}
              readOnly={readOnly}
              autoFocus={autoFocus}
              required={required}
              id={name}
              name={name}
              type="email"
              autoComplete={autoComplete}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className={classNames(
                disabled
                  ? 'border-movet-gray text-movet-gray'
                  : 'focus:ring-movet-brown focus:border-movet-brown',
                'py-3 px-4 block w-full rounded-lg font-abside-smooth'
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

export default EmailInput;
