import { ImageBackground, Pressable, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { signIn, signInWithLink } from "services/Auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DeviceDimensions from "utils/DeviceDimensions";
import tw from "tailwind";
import { MoVETLogo } from "components/MoVETLogo";
import { useForm } from "react-hook-form";
import {
  EmailInput,
  View,
  PasswordInput,
  SubmitButton,
  ItalicText,
  LinkText,
  ActionButton,
} from "components/themed";
import { router, useLocalSearchParams } from "expo-router";
import { AuthStore } from "stores/AuthStore";
import { getPlatformUrl } from "utils/getPlatformUrl";
// import { isProductionEnvironment } from "utils/isProductionEnvironment";
import { openUrlInWebBrowser } from "utils/openUrlInWebBrowser";

export default function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormData>({
    mode: "onSubmit",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showVerificationButton, setShowVerificationButton] =
    useState<boolean>(false);
  const { user, isLoggedIn } = AuthStore.useState();
  const {
    mode,
    oobCode,
    continueUrl,
    lang,
    apiKey,
    withPassword,
    redirectPath,
  } = useLocalSearchParams();
  const isDarkMode = useColorScheme() !== "light";
  const [tapCount, setTapCount] = useState<number>(0);
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
  useEffect(() => {
    if (tapCount === 15) setShowPasswordInput(true);
    else if (tapCount > 15) setShowPasswordInput(false);
  }, [tapCount]);

  useEffect(() => {
    if (mode && oobCode && continueUrl && lang && apiKey && user?.email)
      signInUserWithLink(
        user?.email,
        getPlatformUrl() +
          `?mode=${mode}&oobCode=${oobCode}&continueUrl=${continueUrl}&lang=${lang}&apiKey=${apiKey}`,
      );
  }, [mode, oobCode, continueUrl, lang, apiKey, user?.email]);

  useEffect(() => {
    if (isLoggedIn) router.replace((redirectPath as string) || "/(app)/home");
  }, [isLoggedIn, redirectPath]);

  const signInUserWithLink = async (email: string, link: string) => {
    setIsLoading(true);
    await signInWithLink(email, link)
      .then((user: any) => (user ? router.replace("/(app)/home") : null))
      .catch((error: any) => alert(JSON.stringify(error)))
      .finally(() => {
        setIsLoading(false);
        setShowVerificationButton(true);
      });
  };
  const onSubmit = async (data: { email: string; password?: string }) => {
    setIsLoading(true);
    await signIn(data?.email, data?.password)
      .then(
        () =>
          !data?.password &&
          alert(`Check your email - ${data?.email} for a sign in link.`),
      )
      .catch((error: any) => alert(JSON.stringify(error)))
      .finally(() => {
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
        source={require("assets/images/backgrounds/sign-in-background.png")}
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
            <Pressable onPress={() => setTapCount(tapCount + 1)}>
              <MoVETLogo
                type="default"
                override="default"
                height={160}
                width={260}
              />
            </Pressable>
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
            {(withPassword || showPasswordInput) && (
              <PasswordInput
                control={control}
                error={((errors as any)["password"] as any)?.message as string}
                textContentType="password"
                editable={!isLoading}
              />
            )}
            {!showVerificationButton && !withPassword && !showPasswordInput && (
              <View
                style={tw`flex-row bg-movet-white/80 dark:bg-movet-black/75 rounded-xl p-2`}
              >
                <ItalicText style={tw`text-sm normal-case text-center`}>
                  Please provide your email address to sign in or create a new
                  account.
                </ItalicText>
              </View>
            )}
          </View>
          <View style={tw`w-full pb-12 px-8 bg-transparent items-center`}>
            {isDirty && !showVerificationButton && (
              <View
                style={tw`flex-row bg-movet-white dark:bg-movet-black rounded-xl mt-4 p-2 opacity-75`}
              >
                <ItalicText style={tw`flex flex-wrap text-center text-xs`}>
                  By continuing you agree to our&nbsp;
                </ItalicText>
                <LinkText
                  style={tw`flex flex-wrap text-xs`}
                  text="terms of use"
                  onPress={() =>
                    openUrlInWebBrowser(
                      "https://movetcare.com/terms-and-conditions/?mode=app",
                      isDarkMode,
                      {
                        dismissButtonStyle: "close",
                        enableBarCollapsing: true,
                        enableDefaultShareMenuItem: false,
                        readerMode: true,
                        showTitle: false,
                      },
                    )
                  }
                />
                <ItalicText style={tw`flex flex-wrap text-center text-xs`}>
                  &nbsp;and&nbsp;
                </ItalicText>
                <LinkText
                  style={tw`flex flex-wrap text-xs`}
                  text="privacy policy"
                  onPress={() =>
                    openUrlInWebBrowser(
                      "https://movetcare.com/privacy-policy/?mode=app",
                      isDarkMode,
                      {
                        dismissButtonStyle: "close",
                        enableBarCollapsing: true,
                        enableDefaultShareMenuItem: false,
                        readerMode: true,
                        showTitle: false,
                      },
                    )
                  }
                />
              </View>
            )}
            {showVerificationButton && !withPassword && !showPasswordInput ? (
              <ActionButton
                title="Resend Sign In Link"
                iconName="envelope"
                onPress={() => onSubmit({ email: user?.email })}
              />
            ) : (
              <SubmitButton
                iconName={
                  isLoading
                    ? "spinner"
                    : !withPassword && !showPasswordInput
                    ? "arrow-right"
                    : isDirty
                    ? "lock-open"
                    : "lock"
                }
                color="red"
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                disabled={!isDirty}
                loading={false}
                title={
                  isLoading
                    ? "Processing..."
                    : !withPassword && !showPasswordInput
                    ? "Continue"
                    : "Sign In"
                }
              />
            )}
          </View>
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
}
