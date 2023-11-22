import { Controller } from "react-hook-form";
import { MaskedTextInput } from "react-native-mask-text";
import { View } from "../View";
import { FormFieldError } from "./InputFieldError";
import { useColorScheme } from "react-native";
import tw from "tailwind";

export const PhoneInput = ({
  control,
  error,
  name,
  textContentType = "telephoneNumber",
  autoFocus = false,
  keyboardType = "phone-pad",
  style,
  editable = true,
  defaultValue = undefined,
}: {
  control: any;
  error: any;
  name: string;
  textContentType?: "telephoneNumber" | "none";
  autoFocus?: boolean;
  keyboardType?:
    | "numeric"
    | "numbers-and-punctuation"
    | "number-pad"
    | "phone-pad"
    | "name-phone-pad";
  style?: any;
  editable?: boolean;
  defaultValue?: string | undefined;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    <View style={[tw`flex-col`, style]}>
      <Controller
        control={control}
        rules={{
          required: "Phone number is required",
          pattern: {
            /* eslint-disable */
            value: /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/,
            message: `Please enter a valid phone number`,
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <MaskedTextInput
            editable={editable}
            style={[
              tw`border-2 py-4 px-3 mt-4 bg-movet-white dark:bg-movet-black rounded-xl dark:text-movet-white`,
              error ? tw`border-movet-red` : tw` dark:border-movet-white`,
              !editable && tw`opacity-50`,
            ]}
            textContentType={textContentType}
            keyboardType={keyboardType}
            autoCorrect={false}
            autoFocus={autoFocus}
            onBlur={onBlur}
            onChangeText={(formatted: any) => {
              onChange(formatted);
            }}
            mask={"(999) 999-9999"}
            value={value}
            placeholder="Phone Number"
            placeholderTextColor={
              isDarkMode ? tw.color("movet-white") : tw.color("movet-black")
            }
            defaultValue={defaultValue}
          />
        )}
        name={name}
      />
      {error && <FormFieldError>{error}</FormFieldError>}
    </View>
  );
};
