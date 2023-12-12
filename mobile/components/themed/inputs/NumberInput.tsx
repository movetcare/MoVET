import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { TextInput, useColorScheme } from "react-native";
import { View } from "../View";
import tw from "tailwind";
import { FormFieldError } from "./InputFieldError";
import { MaskedTextInput } from "react-native-mask-text";

export const NumberInput = ({
  control,
  error,
  name,
  minDigits,
  maxDigits,
  plural,
  placeholder,
  defaultValue = null,
  textContentType = "none",
  autoFocus = false,
  keyboardType = "numeric",
  editable = true,
  errorLabel = name,
}: {
  control: any;
  error: any;
  name: string;
  minDigits: number;
  maxDigits: number;
  plural: boolean;
  defaultValue?: string | null;
  placeholder?: string;
  textContentType?: "none";
  autoFocus?: boolean;
  keyboardType: "numeric" | "numbers-and-punctuation" | "number-pad";
  style?: any;
  editable?: boolean;
  errorLabel?: string;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  const [numberFocus, setNumberFocus] = useState<boolean>(false);
  const nameCap = errorLabel.charAt(0).toUpperCase() + errorLabel.slice(1);
  return (
    <View style={tw`flex-col flex-1 bg-transparent`}>
      <Controller
        control={control}
        rules={{
          required: nameCap + "(s) is required",
          pattern: {
            value:
              /* eslint-disable */
              /^[0-9\b]+$/,
            message: `${nameCap}${
              plural ? `(s)` : ``
            } should only contain digits`,
          },
          minLength: {
            message: `${nameCap}${
              plural ? `(s)` : ``
            } should be at least ${minDigits} digit(s)`,
            value: minDigits,
          },
          maxLength: {
            message: `${nameCap}${
              plural ? `(s)` : ``
            } must be less than ${maxDigits} digit(s)`,
            value: maxDigits,
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <MaskedTextInput
            editable={editable}
            onFocus={() => {
              setNumberFocus(true);
            }}
            style={[
              tw`border-2 py-4 px-3 mt-4 bg-movet-white dark:bg-movet-black dark:border-movet-white dark:text-movet-white rounded-xl
              `,
              numberFocus
                ? error
                  ? tw`border-movet-red`
                  : tw`border-movet-black dark:border-movet-white`
                : error
                  ? tw`border-movet-red`
                  : tw`border-movet-black dark:border-movet-white`,
              !editable && tw`opacity-50`,
            ]}
            textContentType={textContentType}
            keyboardType={keyboardType}
            autoCorrect={false}
            autoFocus={autoFocus}
            onBlur={() => {
              onBlur();
              setNumberFocus(false);
            }}
            onChangeText={(formatted) => onChange(formatted)}
            mask={"999"}
            value={value}
            placeholder={placeholder || `${nameCap}${plural ? `(s)` : ``}`}
            placeholderTextColor={
              isDarkMode ? tw.color("movet-white") : tw.color("movet-black")
            }
          />
        )}
        name={name}
        defaultValue={defaultValue || null}
      />
      {error && <FormFieldError>{error}</FormFieldError>}
    </View>
  );
};
