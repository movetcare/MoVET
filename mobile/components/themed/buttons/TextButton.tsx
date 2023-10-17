import React from "react";
import { TouchableOpacity } from "react-native";
import { ButtonText } from "../Text";

export const TextButton = ({
  title,
  onPress,
  style,
}: {
  title: string;
  onPress: any;
  style?: any;
}) => (
  <TouchableOpacity onPress={() => onPress()}>
    <ButtonText style={style}>{title}</ButtonText>
  </TouchableOpacity>
);
