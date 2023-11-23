import React from "react";
import { View } from "react-native";
import { RadioButton } from "../buttons/RadioButton";

export const RadioGroup = ({
  values,
  onPress,
  groupStyle,
  buttonStyle,
  buttonTextStyle,
  selectedValue,
  editable = true,
  onBlur,
}: {
  values: any;
  onPress: any;
  groupStyle: any;
  buttonStyle: any;
  buttonTextStyle: any;
  selectedValue: any;
  editable?: boolean;
  onBlur: any;
}) => {
  const onGroupPress = (value: any) => onPress(value);
  const renderRadioButtons = () => {
    const length = values.length;
    return (values || []).map((listItem: any, index: any) => {
      return (
        <RadioButton
          onBlur={onBlur}
          editable={editable}
          onRadioButtonPress={() => onGroupPress(listItem.value)}
          isChecked={selectedValue === listItem.value}
          listItem={listItem}
          buttonStyle={buttonStyle}
          buttonTextStyle={buttonTextStyle}
          objectLength={length}
          currentIndex={index}
          key={index}
        />
      );
    });
  };

  return <View style={groupStyle}>{renderRadioButtons()}</View>;
};
