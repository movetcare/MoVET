import React from "react";
import { Controller } from "react-hook-form";
import tw from "tailwind";
import { RadioGroup } from "./RadioGroup";
import { FormFieldError } from "./InputFieldError";
import { View } from "../View";

export const RadioInput = ({
  control,
  error,
  data,
  groupStyle,
  buttonStyle,
  buttonTextStyle,
  name,
  editable = true,
  required = true,
}: {
  control: any;
  error: any;
  data: any;
  groupStyle: any;
  buttonStyle: any;
  buttonTextStyle: any;
  name: string;
  editable?: boolean;
  required?: boolean;
}) => {
  return (
    <View style={tw`w-full bg-transparent`}>
      <Controller
        name={name}
        rules={
          required
            ? { required: "A Selection is Required" }
            : {
                validate: (value: any) => {
                  if (value === undefined) {
                    return "Please select one of the options above";
                  } else {
                    return true;
                  }
                },
              }
        }
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <RadioGroup
            onBlur={onBlur}
            editable={editable}
            values={data}
            onPress={(value: any) => onChange(value)}
            groupStyle={groupStyle}
            buttonStyle={buttonStyle}
            buttonTextStyle={buttonTextStyle}
            selectedValue={value}
          />
        )}
      />
      {error && <FormFieldError>{error}</FormFieldError>}
    </View>
  );
};
