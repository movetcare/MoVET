import React from "react";
import { Controller } from "react-hook-form";
import { TextInput, useColorScheme } from "react-native";
import tw from "tailwind";
import { FormFieldError } from "./InputFieldError";

export const PasswordInput = ({
  control,
  error,
  placeholder,
  defaultValue = null,
  textContentType = "password",
  autoFocus = false,
  editable = true,
  required = true,
}: {
  control: any;
  error: any;
  placeholder?: string;
  defaultValue?: string | null;
  textContentType?: "password" | "newPassword";
  autoFocus?: boolean;
  editable?: boolean;
  required?: boolean;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    <>
      <Controller
        control={control}
        rules={
          required
            ? {
                required: "Password is required",
                minLength: {
                  message: "Password requires at least 6 characters",
                  value: 6,
                },
              }
            : {
                minLength: {
                  message: "Password requires at least 6 characters",
                  value: 6,
                },
              }
        }
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            editable={editable}
            secureTextEntry={true}
            autoCapitalize="none"
            textContentType={textContentType}
            keyboardType="default"
            autoCorrect={false}
            autoComplete="password"
            autoFocus={autoFocus}
            style={[
              tw`w-full border-2 py-4 px-5 m-2 bg-movet-white rounded-xl dark:bg-movet-black dark:border-movet-white dark:text-movet-white`,

              error
                ? tw`border-movet-red`
                : tw`border-movet-black dark:border-movet-white`,
              !editable && tw`opacity-50`,
            ]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder || "Password"}
            placeholderTextColor={
              isDarkMode ? tw.color("movet-white") : tw.color("movet-black")
            }
          />
        )}
        name="password"
        defaultValue={defaultValue || null}
      />
      {error && <FormFieldError>{error}</FormFieldError>}
    </>
  );
};
