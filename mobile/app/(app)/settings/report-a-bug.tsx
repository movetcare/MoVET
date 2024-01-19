import * as Linking from "expo-linking";
import * as Device from "expo-device";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActionButton,
  BodyText,
  HeadingText,
  SubHeadingText,
  SubmitButton,
  View,
  TextInput,
  Container,
} from "components/themed";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator, Alert, useColorScheme } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { v4 as uuid } from "uuid";
import { Loader } from "components/Loader";
import tw from "tailwind";
import { AuthStore, ErrorStore } from "stores";
import { uploadBytes, ref } from "firebase/storage";
import { functions, storage } from "firebase-config";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { httpsCallable } from "firebase/functions";
import { router } from "expo-router";
const versions = require("../../../version.json");

const {
  isDevice,
  brand,
  manufacturer,
  modelName,
  modelId,
  designName,
  productName,
  deviceYearClass,
  totalMemory,
  supportedCpuArchitectures,
  osName,
  osVersion,
  osBuildId,
  osInternalBuildId,
  osBuildFingerprint,
  platformApiLevel,
  deviceName,
} = Device;

const ReportABug = () => {
  const { showActionSheetWithOptions } = useActionSheet();
  const { user } = AuthStore.useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [images, setImage] = useState<any>([]);
  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      issue: "",
    },
  });

  const uploadMedia = () => {
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
            pickImageAsync();
            return;
          case 1:
            takePictureAsync();
            return;
        }
      },
    );
  };

  const getPermissionAsync = async (
    permission: "mediaLibrary" | "camera" = "mediaLibrary",
  ) => {
    const { status } =
      permission === "mediaLibrary"
        ? await ImagePicker.requestMediaLibraryPermissionsAsync()
        : await ImagePicker.requestCameraPermissionsAsync();
    if (status === "denied") {
      Alert.alert(
        "Cannot be done 😞",
        `If you would like to use this feature, you'll need to enable the ${
          permission === "mediaLibrary" ? "Photo Library" : "Camera"
        } permission in your phone settings.`,
        [
          {
            text: "Let's go!",
            onPress: () => Linking.openURL("app-settings:"),
          },
          {
            text: "Nevermind",
            style: "cancel",
          },
        ],
        { cancelable: true },
      );
      return false;
    }
    return true;
  };

  const pickImageAsync = async () => {
    try {
      await getPermissionAsync("mediaLibrary");
      const mediaLibraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaLibraryPermission.status !== "denied") {
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
        delete (result as any).cancelled;
        if (!result.canceled) {
          setImage((images: []) => [...images, result.assets[0]?.uri]);
          return result.assets[0]?.uri;
        }
      } else if (mediaLibraryPermission.status === "denied")
        await getPermissionAsync("mediaLibrary");
    } catch (error: any) {
      setError({ ...error, source: "pickImageAsync" });
    }
  };

  const takePictureAsync = async () => {
    try {
      await getPermissionAsync("camera");
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== "denied") {
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
        if (!result.canceled) {
          setImage(result.assets[0]?.uri);
          return result.assets[0]?.uri;
        }
      } else if (cameraPermission.status === "denied")
        await getPermissionAsync("camera");
    } catch (error: any) {
      setError({ ...error, source: "takePictureAsync" });
    }
  };

  const uploadImageAsync = async (uri: any) => {
    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = (error: any) => {
        setError({ ...error, source: "uploadImageAsync XMLHttpRequest" });
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const fileRef = ref(storage, `report_a_bug/${user?.uid}/${uuid()}`);
    await uploadBytes(fileRef, blob).catch((error) =>
      setError({ ...error, source: "uploadImageAsync uploadBytes" }),
    );
    blob.close();
    return true;
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const payload = {
      ...data,
      isDevice,
      brand,
      manufacturer,
      modelName,
      modelId,
      designName,
      productName,
      deviceYearClass,
      totalMemory,
      supportedCpuArchitectures,
      osName,
      osVersion,
      osBuildId,
      osInternalBuildId,
      osBuildFingerprint,
      platformApiLevel,
      deviceName,
      uid: user?.uid,
      displayName: user?.displayName,
      email: user?.email,
      emailVerified: user?.emailVerified,
      isAnonymous: user?.isAnonymous,
      phoneNumber: user?.phoneNumber,
      photoURL: user?.photoURL,
      providerData: user?.providerData,
    };
    if (images?.length > 0)
      await Promise.all(
        images.map(async (uri: string) => await uploadImageAsync(uri)),
      );
    const reportABug = httpsCallable(functions, "reportABug");
    await reportABug(payload)
      .then((result: any) => {
        if (!result.data)
          setError({
            message: "Failed to Submit Bug Report",
            source: "onSubmit reportABug",
          });
        else
          Alert.alert(
            "Success!",
            "Your bug report has been submitted.\n\nThe team will review ASAP and reach out to you with any follow up questions.\n\nThank you for helping us create a better MoVET experience!",
            [
              {
                text: "OKAY",
                onPress: () => router.back(),
              },
            ],
          );
      })
      .catch((error: any) => setError(error))
      .finally(() => setIsLoading(false));
  };

  const setError = (error: any) => {
    setIsLoading(false);
    setImage(null);
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });
  };
  return isLoading ? (
    <Loader />
  ) : (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={"handled"}
      style={tw`flex-1`}
      contentContainerStyle={tw`flex-grow px-6 bg-movet-white dark:bg-movet-black`}
      showsVerticalScrollIndicator={false}
    >
      <View style={tw`flex-grow items-center justify-start mt-4`}>
        <View style={tw`w-full`}>
          <SubHeadingText style={tw`mt-4`}>
            What Issue(s) are you having?
          </SubHeadingText>
          <TextInput
            editable={!isLoading}
            control={control}
            error={(errors["issue"] as any)?.message as string}
            name="issue"
            multiline
            numberOfLines={4}
            placeholder="Provide as much detail as possible..."
            style={tw`mt-4`}
          />
          <SubHeadingText style={tw`mt-8`}>
            Screenshot(s) / Recording(s)
          </SubHeadingText>
          <View style={tw`flex justify-center items-center`}>
            {images?.length > 0 &&
              images.map((uri: string, index: number) => (
                <View
                  key={`image-${index}`}
                  style={{
                    marginTop: 30,
                    width: 250,
                    borderRadius: 3,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      borderTopRightRadius: 3,
                      borderTopLeftRadius: 3,
                      shadowColor: "rgba(0,0,0,1)",
                      shadowOpacity: 0.2,
                      shadowOffset: { width: 4, height: 4 },
                      shadowRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={{ uri }}
                      style={{ width: 250, height: 250 }}
                      alt="photo-preview"
                    />
                  </View>
                </View>
              ))}
            <View style={tw`my-2`} />
            <ActionButton
              title={
                images?.length > 0
                  ? images?.length >= 5
                    ? "Max Files Attached"
                    : "Attach Another File"
                  : "Attach a File"
              }
              onPress={async () => {
                if (images?.length <= 5) uploadMedia();
              }}
              iconName={images?.length >= 5 ? "cancel" : "plus"}
              disabled={isLoading || images?.length >= 5}
              color="black"
            />
            {images?.length > 0 && (
              <ActionButton
                title="Reset All Attachments"
                color="brown"
                iconName="redo"
                onPress={() => {
                  Alert.alert(
                    "Are you sure?",
                    "You will have to reselect any attachments that you want to report with this bug.",
                    [
                      {
                        text: "No",
                        style: "cancel",
                      },
                      {
                        text: "Yes",
                        onPress: async () => setImage([]),
                      },
                    ],
                  );
                }}
                style={tw`text-xs italic`}
              />
            )}
          </View>
          <View style={tw`my-4`} />
          <SubmitButton
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            disabled={!isDirty || isLoading}
            loading={isLoading}
            title={isLoading ? "REPORTING BUG..." : "REPORT BUG"}
            color="red"
            iconName="bug"
            style={tw`mx-auto mb-8`}
          />
          {__DEV__ && (
            <>
              <HeadingText style={tw`mt-8 mb-2 text-lg text-center uppercase`}>
                Debug Information
              </HeadingText>
              <SubHeadingText style={tw`mt-4 mb-2`}>User ID</SubHeadingText>
              <BodyText>{user?.uid}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>Email</SubHeadingText>
              <BodyText> {user?.email}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                Email Verified
              </SubHeadingText>
              <BodyText>{user?.emailVerified.toString()}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                Is Anonymous
              </SubHeadingText>
              <BodyText>{user?.isAnonymous.toString()}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                Phone Number
              </SubHeadingText>
              <BodyText>{user?.phoneNumber}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>Photo URL</SubHeadingText>
              <BodyText> {user?.photoURL}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>App Version</SubHeadingText>
              <BodyText>v{versions.appVersion.toString()}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                Using Simulator
              </SubHeadingText>
              <BodyText>{!isDevice ? "TRUE" : "FALSE"}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>Device Name</SubHeadingText>
              <BodyText>{deviceName}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                Operating System
              </SubHeadingText>
              <BodyText>{osName}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>Brand</SubHeadingText>
              <BodyText>{brand}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                ; Manufacturer
              </SubHeadingText>
              <BodyText>{manufacturer}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>model Name</SubHeadingText>
              <BodyText>{modelName}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>model Id</SubHeadingText>
              <BodyText> {modelId}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                device Year Class
              </SubHeadingText>
              <BodyText>{deviceYearClass}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                total Memory
              </SubHeadingText>
              <BodyText>{totalMemory}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                supported Cpu Architectures
              </SubHeadingText>
              <BodyText>{supportedCpuArchitectures}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>os Version</SubHeadingText>
              <BodyText>{osVersion}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>os Build Id</SubHeadingText>
              <BodyText>{osBuildId}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                os Internal Build Id
              </SubHeadingText>
              <BodyText>{osInternalBuildId}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                OS Build Fingerprint (Android)
              </SubHeadingText>
              <BodyText>{osBuildFingerprint}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                Platform API Level(Android)
              </SubHeadingText>
              <BodyText>{platformApiLevel}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                design name (android)
              </SubHeadingText>
              <BodyText>{designName}</BodyText>
              <SubHeadingText style={tw`mt-4 mb-2`}>
                product Name(android)
              </SubHeadingText>
              <BodyText>{productName}</BodyText>
            </>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ReportABug;
