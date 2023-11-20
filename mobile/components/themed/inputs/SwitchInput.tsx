import React from "react";
import { Controller } from "react-hook-form";
import { Switch, useColorScheme } from "react-native";
import tw from "tailwind";

export const SwitchInput = ({
  control,
  name,
  defaultValue,
}: {
  control: any;
  name: string;
  defaultValue?: boolean;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    <Controller
      control={control}
      render={({ field: { onChange, value } }) => (
        <Switch
          trackColor={{
            false: isDarkMode
              ? tw.color("movet-white")
              : tw.color("movet-black"),
            true: tw.color("movet-red"),
          }}
          thumbColor={
            isDarkMode ? tw.color("movet-black") : tw.color("movet-white")
          }
          ios_backgroundColor={
            isDarkMode ? tw.color("movet-white") : tw.color("movet-black")
          }
          onValueChange={onChange}
          value={value}
        />
      )}
      name={name}
      defaultValue={defaultValue || null}
    />
  );
};
