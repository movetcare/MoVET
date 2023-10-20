/* eslint-disable import/no-anonymous-default-export */
import { ExpoConfig, ConfigContext } from "@expo/config";

const versions = require("./version.json");
const isProduction = process.env.APP_ENVIRONMENT === "production";
const themeColor = {
  red: "#E76159",
  white: "#f6f2f0",
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const sharedConfig: any = {
    name: "MoVET",
    owner: "movetcaredev",
    slug: "movet",
    version: versions.appVersion,
    orientation: "portrait",
    scheme: "movet",
    userInterfaceStyle: "automatic",
    privacy: "hidden",
    backgroundColor: themeColor.white,
    primaryColor: themeColor.red,
    notification: {
      icon: "./assets/images/icons/app-icon.png",
      color: themeColor.red,
    },
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "cover",
      backgroundColor: themeColor.white,
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      associatedDomains: ["applinks:app.movetcare.com"],
      supportsTablet: true,
      bundleIdentifier: "com.movet.inc",
      buildNumber: JSON.stringify(versions.buildVersion),
      backgroundColor: themeColor.white,
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        // NSCameraUsageDescription:
        //   "Used for sharing photos of your pets with MoVET.",
        // NSPhotoLibraryUsageDescription:
        //   "Used for uploading photos/videos to MoVET.",
        // NSMicrophoneUsageDescription:
        //   "Used for uploading audio and videos to MoVET.",
        UIBackgroundModes: ["remote-notification"],
        // NSRemindersUsageDescription:
        //   "Used for adding MoVET appointments to your calendar.",
        // NSLocationWhenInUseUsageDescription:
        //   "Used for making address recommendations while booking services with MoVET.",
      },
    },
    android: {
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "app.movetcare.com",
              pathPrefix: "/",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/images/icons/app-icon.png",
        backgroundColor: themeColor.red,
      },
      package: "com.movet",
      versionCode: versions.buildVersion,
      permissions: ["CAMERA", "READ_CALENDAR", "WRITE_CALENDAR"],
      googleServicesFile: "./google-services.json",
    },
    plugins: [
      "expo-router",
      [
        "expo-image-picker",
        {
          photosPermission:
            "(image-picker) Allow $(PRODUCT_NAME) to access your photos. Sharing photos with MoVET is not required, but it can help us expedite care for your pets.",
          cameraPermission:
            "(image-picker) Allow $(PRODUCT_NAME) to access your camera. Sharing photos with MoVET is not required, but it can help us expedite care for your pets.",
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/icons/app-icon.png",
          color: themeColor.red,
          mode: isProduction ? "production" : "development",
        },
      ],
    ],
    extra: {
      environment: process.env.APP_ENVIRONMENT || "development",
      eas: {
        projectId:
          process.env.EXPO_PROJECT_ID || "e338e0ce-a592-44f3-b700-e69d46390080",
      },
    },
  };
  return isProduction
    ? ({
        ...config,
        ...sharedConfig,
        description: "Production Build of MoVET Mobile Application",
        icon: "./assets/images/icons/app-icon.png",
        splash: {
          image: "./assets/images/backgrounds/splash-screen.png",
        },
      } as any)
    : ({
        ...config,
        ...sharedConfig,
        description: "BETA build of MoVET Mobile Application",
        icon: "./assets/images/icons/app-icon-beta.png",
        splash: {
          image: "./assets/images/backgrounds/splash-screen-beta.png",
        },
      } as any);
};
