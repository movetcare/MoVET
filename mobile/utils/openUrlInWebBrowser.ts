import * as WebBrowser from "expo-web-browser";
import tw from "tailwind";
export const openUrlInWebBrowser = async (
  url: string,
  isDarkMode: boolean,
  options?: {
    dismissButtonStyle?: "done" | "cancel" | "close";
    enableBarCollapsing?: boolean;
    enableDefaultShareMenuItem?: boolean;
    readerMode?: boolean;
    showTitle?: boolean;
  },
) =>
  WebBrowser.openBrowserAsync(encodeURI(url), {
    enableBarCollapsing: options?.enableBarCollapsing || true,
    enableDefaultShareMenuItem: options?.enableDefaultShareMenuItem || false,
    readerMode: options?.readerMode || false,
    showTitle: options?.showTitle || false,
    dismissButtonStyle: options?.dismissButtonStyle || "done",
    controlsColor: isDarkMode
      ? tw.color("movet-white")
      : tw.color("movet-brown"),
    toolbarColor: isDarkMode
      ? tw.color("movet-black")
      : tw.color("movet-white"),
    secondaryToolbarColor: isDarkMode
      ? tw.color("movet-black")
      : tw.color("movet-white"),
  });
