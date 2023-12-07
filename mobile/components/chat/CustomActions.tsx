import { useCallback } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useActionSheet } from "@expo/react-native-action-sheet";
import { pickImageAsync, takePictureAsync } from "./mediaUtils";
import tw from "tailwind";

interface Props {
  renderIcon?: () => React.ReactNode;
  wrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  iconTextStyle?: StyleProp<TextStyle>;
  onSend: (messages: any) => void;
}

const CustomActions = ({
  renderIcon,
  iconTextStyle,
  containerStyle,
  wrapperStyle,
  onSend,
}: Props) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const onActionsPress = useCallback(() => {
    const options = ["Choose From Library", "Take Picture", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImageAsync(onSend);
            return;
          case 1:
            takePictureAsync(onSend);
            return;
        }
      },
    );
  }, [showActionSheetWithOptions, onSend]);

  const renderIconComponent = useCallback(() => {
    if (renderIcon) {
      return renderIcon();
    }
    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    );
  }, [iconTextStyle, renderIcon, wrapperStyle]);

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onActionsPress}
    >
      <>{renderIconComponent()}</>
    </TouchableOpacity>
  );
};

export default CustomActions;

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: tw.color("movet-gray"),
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: tw.color("movet-gray"),
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});
