import { Controller } from "react-hook-form";
import { TextInput, useColorScheme } from "react-native";
import { FormFieldError } from "./InputFieldError";
import tw from "tailwind";
export const NameInput = ({
  control,
  error,
  name,
  placeholder,
  textContentType,
  defaultValue = null,
  autoFocus = false,
  style,
  editable = true,
  required = false,
}: {
  control: any;
  error: any;
  name: string;
  placeholder: string;
  defaultValue?: string | null;
  textContentType?: "name" | "givenName" | "familyName";
  autoFocus?: boolean;
  style?: any;
  editable?: boolean;
  required: boolean;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    <>
      <Controller
        control={control}
        rules={
          required
            ? {
                required: "Name is required",
                minLength: {
                  message: "Names are usually more than 2 characters",
                  value: 2,
                },
              }
            : {
                minLength: {
                  message: "Names are usually more than 2 characters",
                  value: 2,
                },
              }
        }
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            editable={editable}
            autoCapitalize="words"
            textContentType={textContentType}
            keyboardType="default"
            autoCorrect={false}
            autoComplete="name"
            autoFocus={autoFocus}
            style={[
              style,
              tw`border-2 py-4 px-5 bg-movet-white dark:bg-movet-black dark:border-movet-white dark:text-movet-white rounded-xl`,
              error ? tw`border-movet-red` : tw`dark:border-movet-white`,
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
        name={name}
        defaultValue={defaultValue}
      />
      {error && <FormFieldError>{error}</FormFieldError>}
    </>
  );
};
