import { RadioGroup } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage } from "ui";
import { Controller } from "react-hook-form";

export const RadioInput = ({
  label = "",
  description,
  control,
  errors,
  name,
  required = false,
  items,
}: {
  label?: any;
  control: any;
  errors: any;
  required?: boolean;
  name: string;
  description?: string;
  items: Array<{ name: string }>;
}) => {
  return (
    <div className="w-full py-4">
      <div className="mx-auto w-full max-w-md">
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }: any) => (
            <RadioGroup value={value} onChange={onChange}>
              {label && (
                <RadioGroup.Label className="block text-sm font-medium text-movet-black font-abside mb-2">
                  {label}{" "}
                  {required && <span className="text-movet-red">*</span>}
                </RadioGroup.Label>
              )}
              {description && <p className="mb-4">{description}</p>}
              {items && (
                <div className="space-y-2 px-4">
                  {items.map((item: { name: string }) => (
                    <RadioGroup.Option
                      key={item.name}
                      value={item}
                      className={() =>
                        `${
                          item.name === value.name
                            ? "ring-2 ring-movet-white ring-opacity-60 ring-offset-2 ring-offset-movet-white"
                            : ""
                        }
                  ${
                    item.name === value.name
                      ? "bg-movet-brown bg-opacity-75 text-movet-white"
                      : "bg-movet-white"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none my-4 ease-in-out duration-300`
                      }
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <RadioGroup.Label
                              as="p"
                              className={`font-abside ${
                                item.name === value.name
                                  ? "text-movet-white italic"
                                  : "text-movet-black"
                              }`}
                            >
                              {item.name}
                            </RadioGroup.Label>
                          </div>
                        </div>
                        {item.name === value.name && (
                          <div className="shrink-0 text-movet-white">
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              size="2x"
                              className="mx-2"
                            />
                          </div>
                        )}
                      </div>
                    </RadioGroup.Option>
                  ))}
                </div>
              )}
            </RadioGroup>
          )}
        />
      </div>
      <ErrorMessage errorMessage={errors[name]?.message} />
    </div>
  );
};
