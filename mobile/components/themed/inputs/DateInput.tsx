import { Controller } from "react-hook-form";
import { MaskedTextInput } from "react-native-mask-text";
import { useColorScheme } from "react-native";
import tw from "tailwind";
import { FormFieldError } from "./InputFieldError";
import { View } from "../View";

export const DateInput = ({
  control,
  error,
  name,
  autoFocus = false,
  editable = true,
  defaultValue,
  rules,
}: {
  control: any;
  error: any;
  name: string;
  autoFocus?: boolean;
  editable?: boolean;
  defaultValue?: string;
  rules?: any;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    <View style={tw`flex-col flex-1 bg-transparent`}>
      <Controller
        control={control}
        rules={
          rules
            ? rules
            : {
                required:
                  name.charAt(0).toUpperCase() + name.slice(1) + " is required",
                minLength: {
                  message:
                    "Birthday should be at least 8 digits. Please use MM-DD-YYYY format.",
                  value: 10,
                },
                validate: (value: any) => {
                  if (value) {
                    const today = new Date();
                    const date = value.split("-");
                    const month = date[0];
                    const day = date[1];
                    const year = date[2];
                    const valueAsDate = new Date(year, month - 1, day);
                    if (today < valueAsDate) {
                      return "Please enter a date that is before tomorrow";
                    } else if (day > 31 || day < 1) {
                      return "Please enter a day that exists within the Gregorian calendar";
                    } else if (month > 12 || month < 1) {
                      return "Please enter a month that exists within the Gregorian calendar";
                    } else {
                      return true;
                    }
                  } else {
                    return false;
                  }
                },
              }
        }
        render={({ field: { onChange, onBlur, value } }) => (
          <MaskedTextInput
            editable={editable}
            style={[
              tw`border-2 py-4 px-3 mt-4 bg-movet-white dark:bg-movet-black dark:text-movet-white rounded-xl`,
              error
                ? tw`border-movet-red`
                : tw`border-movet-black dark:border-movet-white`,
              !editable && tw`opacity-50`,
            ]}
            textContentType={"none"}
            keyboardType={"number-pad"}
            autoCorrect={false}
            autoFocus={autoFocus}
            onBlur={onBlur}
            onChangeText={(formatted) => onChange(formatted)}
            mask={"99-99-9999"}
            value={value}
            placeholder="MM-DD-YYYY"
            defaultValue={defaultValue}
            placeholderTextColor={
              isDarkMode ? tw.color("movet-white") : tw.color("movet-black")
            }
          />
        )}
        name={name}
      />
      {error && <FormFieldError>{error}</FormFieldError>}
    </View>
  );
};
