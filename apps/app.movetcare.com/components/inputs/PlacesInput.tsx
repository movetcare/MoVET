import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { Controller } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

export const PlacesInput = ({
  control,
  errors,
  name,
  required = false,
  placeholder = "Search for an Option...",
  setLatLon = null,
  setExternalZipcodeValidation = null,
  label,
  types = null,
  className = null,
  defaultValue = null,
  setValue = null,
}: {
  control: any;
  errors: any;
  name: string;
  required: boolean;
  label?: string;
  placeholder?: string;
  types?: Array<"veterinary_care" | "street_address" | "street_number"> | null;
  setLatLon?: null | any;
  setExternalZipcodeValidation?: null | any;
  className?: string | null;
  defaultValue?: string | null;
  setValue?: any | null;
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
            <GooglePlacesAutocomplete
              apiKey="AIzaSyD-8-Mxe05Y1ySHD7XoDcumWt3vjA-URF0"
              autocompletionRequest={
                types
                  ? {
                      bounds: [
                        { lat: 19.50139, lng: -161.75583 },
                        { lat: 64.85694, lng: -68.01197 },
                      ],
                      componentRestrictions: {
                        country: ["us"],
                      },
                      types,
                    }
                  : {
                      bounds: [
                        { lat: 19.50139, lng: -161.75583 },
                        { lat: 64.85694, lng: -68.01197 },
                      ],
                      componentRestrictions: {
                        country: ["us"],
                      },
                    }
              }
              minLengthAutocomplete={6}
              selectProps={
                {
                  defaultOptions:
                    defaultValue !== null
                      ? [
                          {
                            value: defaultValue,
                            label: `${defaultValue} (Default Address)`,
                          },
                        ]
                      : null,
                  value,
                  onChange: (value: any) => {
                    const fetchLatLon = (address: string, setLatLon: any) =>
                      geocodeByAddress(address)
                        .then((results) => {
                          let zipcode: string | null = null;
                          results[0]?.address_components.forEach(
                            (
                              component: {
                                long_name: string;
                                short_name: string;
                                types: Array<string>;
                              },
                              index: number
                            ) =>
                              component?.types.forEach((type: string) =>
                                type === "postal_code"
                                  ? (zipcode =
                                      results[0]?.address_components[index]
                                        ?.long_name)
                                  : null
                              )
                          );
                          if (setExternalZipcodeValidation)
                            setExternalZipcodeValidation(zipcode);
                          if (setValue)
                            setValue(
                              name,
                              {
                                label: results[0]?.formatted_address,
                                value: {
                                  description: results[0]?.formatted_address,
                                  terms: results[0]?.address_components,
                                  place_id: results[0]?.place_id,
                                },
                              } as any,
                              {
                                shouldValidate: false,
                                shouldDirty: false,
                                shouldTouch: false,
                              }
                            );
                          return getLatLng(results[0]);
                        })
                        .then(({ lat, lng }) =>
                          setLatLon({
                            lat,
                            lng,
                          })
                        );
                    if (
                      typeof value?.value === "string" &&
                      setLatLon !== null
                    ) {
                      fetchLatLon(value?.value, setLatLon);
                    } else if (value?.value?.description && setLatLon !== null)
                      fetchLatLon(value?.value?.description, setLatLon);
                    return onChange(value);
                  },
                  onBlur,
                  placeholder,
                  styles: {
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
                      backgroundColor: state.isSelected
                        ? "#6c382b"
                        : "transparent",
                    }),
                    singleValue: (base: any, state: any) => ({
                      ...base,
                      borderWidth: 0,
                      borderColor: "transparent",
                      fontFamily: "Abside Smooth",
                      color: state.data.color,
                    }),
                    indicatorSeparator: () => ({
                      borderWidth: 0,
                      display: "none",
                    }),
                    dropdownIndicator: () => ({
                      borderWidth: 0,
                      display: "none",
                    }),
                  },
                  theme: (theme: any) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      danger: "#E76159",
                      primary50: "#A15643",
                      primary: "#232127",
                    },
                  }),
                  className: `places-search border-movet-black relative border w-full bg-white rounded-xl py-2 text-left cursor-pointer sm:text-sm${
                    errors[name]?.message
                      ? " border-movet-red border-2 text-movet-red"
                      : ""
                  }${className !== null ? className : ""}`,
                } as any
              }
            />
          </>
        )}
      />
      {errors[name]?.message && (
        <ErrorMessage errorMessage={errors[name]?.message} />
      )}
    </div>
  );
};
