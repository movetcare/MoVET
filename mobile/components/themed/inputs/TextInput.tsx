import { useState } from "react";
import { Controller } from "react-hook-form";
import { TextInput as RNTextInput, useColorScheme } from "react-native";
import { FormFieldError } from "./InputFieldError";
import tw from "tailwind";

export const TextInput = ({
  control,
  error,
  name,
  placeholder,
  textContentType,
  defaultValue = null,
  autoFocus = false,
  multiline = false,
  numberOfLines,
  style,
  editable = true,
  errorLabel = name,
  required = true,
}: {
  control: any;
  error: any;
  name: string;
  placeholder: string;
  defaultValue?: string | null;
  textContentType?: "none";
  autoFocus?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
  editable?: boolean;
  errorLabel?: string;
  required?: boolean;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  const [textFocus, setTextFocus] = useState<boolean>(false);
  const capitalizedName =
    errorLabel.charAt(0).toUpperCase() + errorLabel.slice(1);
  return (
    <>
      <Controller
        control={control}
        rules={
          required
            ? {
                required: `${capitalizedName} is required`,
                minLength: {
                  message: `${capitalizedName} should be more than more than 2 characters`,
                  value: 2,
                },
              }
            : {
                minLength: {
                  message: `${capitalizedName} should be more than more than 2 characters`,
                  value: 2,
                },
              }
        }
        render={({ field: { onChange, onBlur, value } }) => (
          <RNTextInput
            editable={editable}
            multiline={multiline}
            numberOfLines={numberOfLines}
            autoCapitalize="none"
            textContentType={textContentType}
            keyboardType="default"
            autoCorrect={false}
            autoFocus={autoFocus}
            onFocus={() => {
              setTextFocus(true);
            }}
            style={[
              style,
              tw`
                border-2 py-4 px-5 bg-movet-white dark:bg-movet-black dark:border-movet-white dark:text-movet-white rounded-xl`,
              textFocus
                ? error
                  ? tw`border-movet-red`
                  : tw`border-movet-black dark:border-movet-white`
                : error
                  ? tw`border-movet-red`
                  : tw`border-movet-black dark:border-movet-white`,
            ]}
            onBlur={() => {
              onBlur();
              setTextFocus(false);
            }}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={
              isDarkMode ? tw.color("movet-white") : tw.color("movet-black")
            }
          />
        )}
        name={name}
        defaultValue={defaultValue}
      />
      {error && <FormFieldError>{error}</FormFieldError>}
    </>
  );
};
