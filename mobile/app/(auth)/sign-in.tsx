import { ImageBackground, Pressable, useColorScheme } from "react-native";
import { useEffect, useState } from "react";
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
  SubHeadingText,
  HeadingText,
  BodyText,
} from "components/themed";
import { SplashScreen, router, useLocalSearchParams } from "expo-router";
import { AuthStore, ErrorStore } from "stores";
import { getPlatformUrl } from "utils/getPlatformUrl";
import { openUrlInWebBrowser } from "utils/openUrlInWebBrowser";
import { getRandomInt } from "utils/getRandomInt";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import { isTablet } from "utils/isTablet";
import LogRocket from "@logrocket/react-native";

const getRandomBackgroundImage = () => {
  const randomNumber = getRandomInt(1, 5);
  let backgroundImage = null;
  switch (randomNumber) {
    case 1:
      backgroundImage = require("assets/images/backgrounds/sign-in-background-0.jpg");
      break;
    case 2:
      backgroundImage = require("assets/images/backgrounds/sign-in-background-1.jpg");
      break;
    case 3:
      backgroundImage = require("assets/images/backgrounds/sign-in-background-2.jpg");
      break;
    case 4:
      backgroundImage = require("assets/images/backgrounds/sign-in-background-3.jpg");
      break;
    case 5:
      backgroundImage = require("assets/images/backgrounds/sign-in-background-4.jpg");
      break;
    default:
      backgroundImage = require("assets/images/backgrounds/sign-in-background-3.jpg");
  }
  return backgroundImage;
};

const backgroundImage = getRandomBackgroundImage();

export default function SignIn() {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty, errors },
  } = useForm<FormData>({
    mode: "onSubmit",
  });
  const email = watch("email" as any);
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
  const [signInLinkSent, setSignInLinkSent] = useState<boolean>(false);
  const [disableEmailInput, setDisableEmailInput] = useState<boolean>(false);
  const [signInLinkResent, setSignInLinkResent] = useState<boolean>(false);
  const fadeInOpacity = useSharedValue(0);

  const fadeIn = () => {
    fadeInOpacity.value = withTiming(1, {
      duration: 2000,
      easing: Easing.linear,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInOpacity.value,
    };
  });

  useEffect(() => {
    SplashScreen.hideAsync();
    fadeIn();
  });

  useEffect(() => {
    if (tapCount === 5) setShowPasswordInput(true);
    else if (tapCount > 5) setShowPasswordInput(false);
  }, [tapCount]);

  useEffect(() => {
    if (mode && oobCode && continueUrl && lang && apiKey && user?.email) {
      const signInUserWithLink = async (email: string, link: string) => {
        setIsLoading(true);
        await signInWithLink(email, link)
          .then((signInError: any) => {
            if (signInError)
              setError({ message: signInError, source: "signInWithLink" });
          })
          .catch((error: any) =>
            setError({ ...error, source: "signInWithLink" }),
          )
          .finally(() => {
            setIsLoading(false);
            setShowVerificationButton(true);
          });
      };
      signInUserWithLink(
        user?.email,
        getPlatformUrl() +
          `?mode=${mode}&oobCode=${oobCode}&continueUrl=${continueUrl}&lang=${lang}&apiKey=${apiKey}`,
      );
    }
  }, [mode, oobCode, continueUrl, lang, apiKey, user?.email]);

  useEffect(() => {
    if (isLoggedIn) router.replace((redirectPath as string) || "/(app)/home");
  }, [isLoggedIn, redirectPath]);

  const onSubmit = async (data: { email: string; password?: string }) => {
    setIsLoading(true);
    if (!__DEV__) LogRocket.identify(email, { status: "signed-out" });
    await signIn(data?.email, data?.password)
      .then((signInError: string) => {
        if (signInError) setError({ message: signInError, source: "signIn" });
        else if (!data?.password) setSignInLinkSent(true);
      })
      .catch((error: any) => setError({ ...error, source: "signIn" }))
      .finally(() => {
        setIsLoading(false);
        setShowVerificationButton(true);
      });
  };

  const setError = (error: any) =>
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={tw`flex-1`}
      contentContainerStyle={tw`flex-grow`}
    >
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={tw`flex-1`}
      >
        <Animated.View style={[tw`flex-grow`, animatedStyle]}>
          <View
            style={[
              isTablet ? tw`px-16` : tw`px-0`,
              tw`w-full bg-transparent flex-1 justify-center items-center`,
            ]}
            noDarkMode
          >
            <View
              style={tw`
              w-full rounded-t-xl flex justify-center items-center bg-transparent
            `}
              noDarkMode
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
              noDarkMode
            >
              {signInLinkSent ? (
                <View
                  style={[
                    tw`p-2 rounded-xl bg-movet-white/75 dark:bg-movet-black/75 border-movet-black border-2`,
                    signInLinkSent && tw`border-movet-yellow`,
                    signInLinkResent && tw`border-movet-red`,
                  ]}
                  noDarkMode
                >
                  {signInLinkResent && (
                    <ItalicText style={tw`text-lg text-center`}>
                      Sign-In Link Resent!
                    </ItalicText>
                  )}
                  <BodyText style={tw`text-center text-base my-2`}>
                    Check your email &quot;
                    <ItalicText
                      style={tw`text-movet-black dark:text-movet-white`}
                      noDarkMode
                    >
                      {email}
                    </ItalicText>
                    &quot; for a sign in link.
                  </BodyText>
                </View>
              ) : (
                <EmailInput
                  control={control}
                  error={((errors as any)["email"] as any)?.message as string}
                  textContentType="username"
                  editable={!isLoading && !disableEmailInput}
                />
              )}
              {(withPassword || showPasswordInput) && (
                <PasswordInput
                  control={control}
                  error={
                    ((errors as any)["password"] as any)?.message as string
                  }
                  textContentType="password"
                  editable={!isLoading}
                />
              )}
              {!showVerificationButton &&
                !withPassword &&
                !showPasswordInput && (
                  <View
                    style={[
                      errors && tw`mt-4`,
                      tw`flex-row bg-movet-white/80 dark:bg-movet-black/75 rounded-xl p-2`,
                    ]}
                    noDarkMode
                  >
                    <ItalicText style={tw`text-sm normal-case text-center`}>
                      Please provide your email address to sign in or create a
                      new account.
                    </ItalicText>
                  </View>
                )}
            </View>
            <View
              style={tw`w-full pb-12 px-8 bg-transparent items-center`}
              noDarkMode
            >
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
                <>
                  <ActionButton
                    title="Resend Sign-In Link"
                    iconName="plane"
                    onPress={() => {
                      setSignInLinkResent(false);
                      setTimeout(() => {
                        setSignInLinkResent(true);
                      }, 1000);
                      onSubmit({ email: user?.email });
                    }}
                  />

                  <ActionButton
                    title="Use a Different Email"
                    iconName="redo"
                    color="black"
                    onPress={() => {
                      reset();
                      setShowVerificationButton(false);
                      setDisableEmailInput(false);
                      setIsLoading(false);
                      setSignInLinkSent(false);
                    }}
                  />
                  <ActionButton
                    color="brown"
                    title="Contact Support"
                    iconName="house-medical"
                    onPress={() =>
                      openUrlInWebBrowser(
                        "https://movetcare.com/contact/?mode=app&email=" +
                          email,
                        isDarkMode,
                        {
                          dismissButtonStyle: "cancel",
                          enableBarCollapsing: true,
                          enableDefaultShareMenuItem: false,
                          readerMode: false,
                          showTitle: false,
                        },
                      )
                    }
                  />
                </>
              ) : (
                <SubmitButton
                  iconName={
                    !withPassword && !showPasswordInput
                      ? "arrow-right"
                      : isDirty
                        ? "lock-open"
                        : "lock"
                  }
                  color="red"
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  disabled={!isDirty}
                  loading={isLoading}
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
        </Animated.View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
}
