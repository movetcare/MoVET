import * as Linking from "expo-linking";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import { Alert } from "react-native";

export default async function getPermissionAsync(
  permission: Permissions.PermissionType
) {
  const { status } = await Permissions.askAsync(permission);
  if (status !== "granted") {
    const permissionName = permission.toLowerCase().replace("_", " ");
    Alert.alert(
      "Cannot be done 😞",
      `If you would like to use this feature, you'll need to enable the ${permissionName} permission in your phone settings.`,
      [
        {
          text: "Let's go!",
          onPress: () => Linking.openURL("app-settings:"),
        },
        { text: "Nevermind", onPress: () => {}, style: "cancel" },
      ],
      { cancelable: true }
    );

    return false;
  }
  return true;
}

export async function pickImageAsync(
  onSend: (images: { image: string }[]) => void
) {
  if (await ImagePicker.requestMediaLibraryPermissionsAsync()) {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      onSend([{ image: result.assets[0]?.uri }]);
      return result.assets[0]?.uri;
    }
  }
}

export async function takePictureAsync(
  onSend: (images: { image: string }[]) => void
) {
  if (await Camera.requestCameraPermissionsAsync()) {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      onSend([{ image: result.assets[0]?.uri }]);
      return result.assets[0]?.uri;
    }
  }
}
