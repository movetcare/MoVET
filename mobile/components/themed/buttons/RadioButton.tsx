import React from "react";
import { TouchableOpacity, useColorScheme } from "react-native";

import tw from "tailwind";
import { ButtonText } from "../Text";
import { View } from "../View";
import { Icon } from "../Icons";

export const RadioButton = ({
  isChecked,
  listItem,
  onRadioButtonPress,
  buttonStyle,
  buttonTextStyle,
  currentIndex,
  objectLength,
  editable = true,
  onBlur,
}: {
  isChecked: boolean;
  listItem: any;
  onRadioButtonPress: any;
  buttonStyle: any;
  buttonTextStyle: any;
  currentIndex: number;
  objectLength: number;
  editable?: boolean;
  onBlur: any;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    <>
      <TouchableOpacity
        disabled={!editable}
        style={[
          buttonStyle.normal,
          isChecked && buttonStyle.selected,
          !editable && tw`opacity-50`,
          tw`flex-row items-center justify-center`,
        ]}
        onPress={onRadioButtonPress}
        onBlur={onBlur}
      >
        <View style={tw`flex-row bg-transparent`} noDarkMode>
          {listItem.icon && (
            <>
              <Icon
                name={listItem.icon}
                color={isDarkMode ? "white" : isChecked ? "white" : "black"}
              />
            </>
          )}
          <ButtonText
            noDarkMode
            style={[
              buttonTextStyle.normal,
              isChecked && buttonTextStyle.selected,
              !editable && tw`opacity-50`,
              listItem.icon && tw`ml-2`,
            ]}
          >
            {listItem.value}
          </ButtonText>
        </View>
      </TouchableOpacity>
      {currentIndex + 1 !== objectLength && <View style={tw`m-2`} />}
    </>
  );
};
