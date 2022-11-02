import { Switch } from '@headlessui/react';
import { Controller } from 'react-hook-form';
import { classNames } from 'utils/classNames';
import ErrorMessage from './ErrorMessage';

const SwitchInput = ({
  label,
  control,
  errors,
  name,
  autoFocus = false,
  required = false,
  disabled = false,
  defaultValue = null,
}: {
  label: any;
  control: any;
  errors: any;
  required?: boolean;
  name: string;
  defaultValue?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex-shrink-0">
        <Controller
          control={control}
          rules={
            required
              ? {
                  required: 'Field is required',
                }
              : undefined
          }
          render={({ field: { onChange, onBlur, value } }: any) => (
            <Switch
              autoFocus={autoFocus}
              disabled={disabled}
              onBlur={onBlur}
              checked={value}
              onChange={onChange}
              className={classNames(
                value ? 'bg-movet-red' : 'bg-movet-black',
                disabled
                  ? 'bg-opacity-50'
                  : 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-brown',
                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200'
              )}
            >
              <span className="sr-only">Agree to policies</span>
              <span
                aria-hidden="true"
                className={classNames(
                  value ? 'translate-x-5' : 'translate-x-0',
                  'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                )}
              />
            </Switch>
          )}
          name={name}
          defaultValue={defaultValue}
        />
      </div>
      <div className="ml-3">{label}</div>
      {errors[name]?.message && (
        <ErrorMessage errorMessage={errors[name].message} />
      )}
    </div>
  );
};

export default SwitchInput;
