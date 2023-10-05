import React from "react";
import { Text, View } from "react-native";
import tw from "tailwind";

export const FormFieldError = ({ children }: any) => (
  <View
    style={tw`
        flex-row justify-center items-center bg-movet-white dark:bg-movet-black rounded-xl mt-2
      `}
  >
    <Text style={tw`p-2 text-movet-red font-bold text-center`}>{children}</Text>
  </View>
);
