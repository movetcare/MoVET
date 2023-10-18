import { ImageBackground, useColorScheme } from "react-native";
import React, { useState } from "react";
import { signIn } from "services/Auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DeviceDimensions from "utils/DeviceDimensions";
import { sendEmailVerification } from "firebase/auth";
import tw from "tailwind";
import { MoVETLogo } from "components/MoVETLogo";
import { useForm } from "react-hook-form";
import {
  EmailInput,
  View,
  PasswordInput,
  TextButton,
  ActionButton,
  SubmitButton,
} from "components/themed";
import { router } from "expo-router";
import { AuthStore } from "stores/AuthStore";
import { getPlatformUrl } from "utils/getPlatformUrl";

const backgroundLight = require("assets/images/backgrounds/sign-in-background.png");
const backgroundDark = require("assets/images/backgrounds/sign-in-background.png");

export default function LogIn() {
  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
    getValues,
  } = useForm<FormData>({
    mode: "onSubmit",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showVerificationButton, setShowVerificationButton] =
    useState<boolean>(false);

  const { user } = AuthStore.useState();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await signIn(data?.email, data?.password)
      .then((user: any) => {
        if (user?.emailVerified) router.push("/home");
        else setShowVerificationButton(true);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={tw`flex-1`}
      contentContainerStyle={tw`flex-grow`}
    >
      <ImageBackground
        source={useColorScheme() === "light" ? backgroundLight : backgroundDark}
        resizeMode="cover"
        style={tw`flex-1 px-6`}
      >
        <View
          style={tw`w-full bg-transparent flex-1 justify-center items-center`}
        >
          <View
            style={tw`
              w-full rounded-t-xl flex justify-center items-center bg-transparent
            `}
          >
            <MoVETLogo
              type="default"
              override="default"
              height={160}
              width={260}
            />
          </View>
          <View
            style={[
              tw`w-full pb-12 px-8 bg-transparent items-center rounded-b-xl`,
              DeviceDimensions.window.height > 640 ? tw`mt-12` : tw`mt-4`,
            ]}
          >
            <EmailInput
              control={control}
              error={((errors as any)["email"] as any)?.message as string}
              textContentType="username"
              editable={!isLoading}
            />
            <PasswordInput
              control={control}
              error={((errors as any)["password"] as any)?.message as string}
              textContentType="password"
              editable={!isLoading}
            />
            <View
              style={tw`flex-row bg-movet-white dark:bg-movet-black rounded-xl mt-2 p-2 opacity-75`}
            >
              {showVerificationButton ? (
                <TextButton
                  title="RESEND ACCOUNT VERIFICATION EMAIL"
                  style={tw`text-xs text-center`}
                  onPress={() =>
                    sendEmailVerification(user, {
                      url: getPlatformUrl("mobile") + "/sign-in-success",
                      iOS: {
                        bundleId: "com.movet.inc",
                      },
                      android: {
                        packageName: "com.movet",
                        installApp: true,
                        minimumVersion: "12",
                      },
                      handleCodeInApp: true,
                    })
                  }
                />
              ) : (
                <TextButton
                  title="Forgot Password?"
                  style={tw`text-xs`}
                  onPress={() =>
                    router.push({
                      pathname: "/forgot-password",
                      params: {
                        email: getValues("email" as any)?.toLowerCase(),
                      },
                    })
                  }
                />
              )}
            </View>
          </View>
          <View style={tw`w-full pb-12 px-8 bg-transparent items-center`}>
            <SubmitButton
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              disabled={!isDirty}
              loading={false}
              title={isLoading ? "Signing In..." : "Sign In"}
            />
            <ActionButton
              title="Join MoVET"
              onPress={() =>
                router.push({
                  pathname: "/sign-up",
                  params: {
                    email: getValues("email" as any)?.toLowerCase(),
                  },
                })
              }
            />
          </View>
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
}
