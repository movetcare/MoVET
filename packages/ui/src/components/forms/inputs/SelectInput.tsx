import { Controller } from "react-hook-form";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faList } from "@fortawesome/free-solid-svg-icons";
import { classNames } from "../../../utils";
import { ErrorMessage } from "../../elements";

export const SelectInput = ({
  label,
  required = false,
  control,
  errors,
  name,
  values,
  disabled = false,
}: {
  label: string;
  required?: boolean;
  control: any;
  errors: any;
  name: string;
  values: any;
  disabled?: boolean;
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Listbox disabled={disabled} value={value} onChange={onChange}>
            {({ open }) => (
              <div>
                {label && (
                  <Listbox.Label
                    htmlFor={label}
                    className="block text-sm font-medium text-movet-black font-abside mb-2"
                  >
                    {label}{" "}
                    {required && <span className="text-movet-red">*</span>}
                  </Listbox.Label>
                )}
                <div className="mt-1 relative bg-transparent">
                  <Listbox.Button
                    onBlur={onBlur}
                    className={classNames(
                      disabled
                        ? "border-movet-gray bg-transparent"
                        : "border-movet-black focus:outline-none focus:ring-1 focus:ring-movet-brown focus:border-movet-brown",
                      "relative border w-full bg-white rounded-xl pl-3 pr-10 py-2 text-left cursor-pointer sm:text-sm"
                    )}
                  >
                    <span
                      className={classNames(
                        disabled ? "text-movet-gray" : "text-movet-black",
                        "block truncate font-abside-smooth text-base h-7 mt-1 ml-1"
                      )}
                    >
                      {value.name}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      {!disabled && (
                        <FontAwesomeIcon
                          icon={faList}
                          className="h-4 w-4 mr-2"
                          size="sm"
                        />
                      )}
                    </span>
                  </Listbox.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Listbox.Options className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-movet-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {values.map((item: { id: string; name: string }) => (
                        <Listbox.Option
                          key={item.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "text-movet-white bg-movet-brown"
                                : "text-movet-black",
                              "text-left cursor-default select-none relative py-2 pl-4 pr-4"
                            )
                          }
                          value={item}
                        >
                          {({ active, selected }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {item.name}
                              </span>
                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-movet-black",
                                    "absolute inset-y-0 left-0 flex items-center pl-1.5"
                                  )}
                                >
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    className="h-4 w-4"
                                    size="sm"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </div>
            )}
          </Listbox>
        )}
      />
      <ErrorMessage errorMessage={errors[name]?.message} />
    </>
  );
};
