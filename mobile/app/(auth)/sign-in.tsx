import { ImageBackground, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { signIn, signInWithLink } from "services/Auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DeviceDimensions from "utils/DeviceDimensions";
//import { sendEmailVerification } from "firebase/auth";
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
import { router, useLocalSearchParams } from "expo-router";
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

  const { mode, oobCode, continueUrl, lang, apiKey } = useLocalSearchParams();

  useEffect(() => {
    alert(
      "useLocalSearchParams() = " +
        JSON.stringify({ mode, oobCode, continueUrl, lang, apiKey }),
    );
    alert("user: " + user?.email);
    alert(
      "LINK: " +
        getPlatformUrl() +
        `?mode=${mode}&oobCode=${oobCode}&continueUrl=${continueUrl}&lang=${lang}&apiKey=${apiKey}`,
    );

    if (mode && oobCode && continueUrl && lang && apiKey && user?.email)
      signInUserWithLink(
        user.email,
        getPlatformUrl() +
          `?mode=${mode}&oobCode=${oobCode}&continueUrl=${continueUrl}&lang=${lang}&apiKey=${apiKey}`,
      );
    console.log({ mode, oobCode, continueUrl, lang, apiKey });
  }, [mode, oobCode, continueUrl, lang, apiKey, user?.email]);

  const signInUserWithLink = async (email: string, link: string) =>
    await signInWithLink(email, link)
      .then((user: any) => {
        alert("SIGN IN SUCCESS! " + JSON.stringify(user));
      })
      .catch((error: any) => alert(JSON.stringify(error)));

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await signIn(data?.email, data?.password).finally(() => {
      setIsLoading(false);
      setShowVerificationButton(true);
    });
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

            {showVerificationButton && (
              <View
                style={tw`flex-row bg-movet-white dark:bg-movet-black rounded-xl mt-2 p-2 opacity-75`}
              >
                <TextButton
                  title="RESEND ACCOUNT VERIFICATION EMAIL"
                  style={tw`text-xs text-center`}
                  onPress={() => onSubmit({ email: user?.email })}
                />
              </View>
            )}
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
