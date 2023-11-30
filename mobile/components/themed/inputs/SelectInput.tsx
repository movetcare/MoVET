import React from "react";
import { Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import tw from "tailwind";
import { useColorScheme } from "react-native";
import { FormFieldError } from "./InputFieldError";

export const SelectInput = ({
  control,
  error,
  name,
  values,
  defaultValue,
  editable = true,
}: {
  control: any;
  error: any;
  name: string;
  values: any;
  defaultValue: { id: string; title: string };
  editable?: boolean;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <Picker
            enabled={editable}
            onBlur={onBlur}
            style={[
              tw`border-2 w-full rounded-xl bg-movet-white dark:bg-movet-black text-movet-black dark:text-movet-white -mr-8`,
              error
                ? tw`border-movet-re`
                : tw`border-movet-black dark:border-movet-white`,
              !editable && tw`opacity-50`,
            ]}
            itemStyle={tw`text-movet-black dark:text-movet-white`}
            dropdownIconColor={
              isDarkMode ? tw.color("movet-white") : tw.color("movet-black")
            }
            selectedValue={value}
            onValueChange={(itemValue: any) => onChange(itemValue)}
          >
            {defaultValue && (
              <Picker.Item
                label={defaultValue.title || ""}
                value={defaultValue.id || ""}
              />
            )}
            {values &&
              values
                .sort()
                .map(
                  (listItem: any, index: number) =>
                    defaultValue.id !== listItem.id && (
                      <Picker.Item
                        key={`${index}`}
                        label={listItem.title || ""}
                        value={listItem.id || ""}
                      />
                    ),
                )}
          </Picker>
        )}
        rules={{
          required: "A Breed is Required",
        }}
        name={name}
      />
      {error && <FormFieldError>{error}</FormFieldError>}
    </>
  );
};
