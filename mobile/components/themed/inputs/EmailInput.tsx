import { isDarkMode } from "constants/isDarkMode";
import React from "react";
import { Controller } from "react-hook-form";
import { TextInput } from "react-native";
import tw from "tailwind";
import { FormFieldError } from "./InputFieldError";

export const EmailInput = ({
  control,
  error,
  defaultValue = null,
  textContentType = "emailAddress",
  autoFocus = false,
  placeholder = "Email Address",
  editable = true,
}: {
  control: any;
  error: any;
  defaultValue?: string | null;
  textContentType?: "emailAddress" | "username";
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
}) => {
  return (
    <>
      <Controller
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "Email is not formatted correctly",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            editable={editable}
            autoCapitalize="none"
            textContentType={textContentType}
            keyboardType="email-address"
            autoCorrect={false}
            autoCompleteType="email"
            autoFocus={autoFocus}
            style={[
              tw`w-full border-2 py-4 px-5 m-2 bg-movet-white dark:bg-movet-black dark:border-movet-white dark:text-movet-white rounded-xl
              `,
              error
                ? tw`border-movet-red`
                : tw`border-movet-black dark:border-movet-white`,
              !editable && tw`opacity-50`,
            ]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={
              isDarkMode ? tw.color("movet-white") : tw.color("movet-black")
            }
          />
        )}
        name="email"
        defaultValue={defaultValue}
      />
      {error && <FormFieldError>{error}</FormFieldError>}
    </>
  );
};
