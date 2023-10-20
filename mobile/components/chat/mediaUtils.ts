import * as Linking from "expo-linking";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import { Alert } from "react-native";

export default async function getPermissionAsync(
  permission: "mediaLibrary" | "camera" = "mediaLibrary",
) {
  const { status } =
    permission === "mediaLibrary"
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await Camera.requestCameraPermissionsAsync();
  alert("STATUS = " + status);
  if (status === "denied") {
    const permissionName = permission.toLowerCase().replace("_", " ");
    Alert.alert(
      "Cannot be done 😞",
      `If you would like to use this feature, you'll need to enable the ${
        permissionName === "mediaLibrary" ? "Photo Library" : "Camera"
      } permission in your phone settings.`,
      [
        {
          text: "Let's go!",
          onPress: () => Linking.openURL("app-settings:"),
        },
        { text: "Nevermind", onPress: () => {}, style: "cancel" },
      ],
      { cancelable: true },
    );

    return false;
  }
  return true;
}

export async function pickImageAsync(
  onSend: (
    images: {
      image: string;
      _id: string;
      user: {
        _id: string;
        name: string;
        avatar: string;
      };
    }[],
  ) => void,
) {
  const mediaLibraryPermission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  alert("mediaLibraryPermission: " + JSON.stringify(mediaLibraryPermission));
  if (mediaLibraryPermission.status !== "denied") {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    delete (result as any).cancelled;
    alert("launchImageLibraryAsync RESULT: " + JSON.stringify(result));
    if (!result.canceled) {
      onSend([
        {
          image: result.assets[0]?.uri,
          _id: `${Math.round(Math.random() * 1000000)}`,
          user: {
            _id: `0`,
            name: "",
            avatar: "",
          },
        },
      ]);
      return result.assets[0]?.uri;
    }
  } else if (mediaLibraryPermission.status === "denied")
    await getPermissionAsync("mediaLibrary");
}

export async function takePictureAsync(
  onSend: (
    images: {
      image: string;
      _id: string;
      user: {
        _id: string;
        name: string;
        avatar: string;
      };
    }[],
  ) => void,
) {
  const cameraPermission = await Camera.requestCameraPermissionsAsync();
  alert("cameraPermission = " + JSON.stringify(cameraPermission));
  if (cameraPermission.status !== "denied") {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    alert("launchCameraAsync RESULT: " + JSON.stringify(result));
    if (!result.canceled) {
      onSend([
        {
          image: result.assets[0]?.uri,
          _id: `${Math.round(Math.random() * 1000000)}`,
          user: {
            _id: `0`,
            name: "",
            avatar: "",
          },
        },
      ]);
      return result.assets[0]?.uri;
    }
  } else if (cameraPermission.status === "denied")
    await getPermissionAsync("camera");
}
