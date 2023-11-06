/* eslint-disable import/no-anonymous-default-export */
import tw from "tailwind";

export default {
  light: {
    text: tw.color("movet-black") as string,
    background: tw.color("movet-white") as string,
    tabBarActiveTintColor: tw.color("movet-black") as string,
    tabBarActiveBackgroundColor: tw.color("movet-white") as string,
    tabBarInactiveBackgroundColor: tw.color("white") as string,
    tabBarInactiveTintColor: tw.color("movet-black") as string,
  },
  dark: {
    text: tw.color("movet-white") as string,
    background: tw.color("movet-black") as string,
    tabBarActiveTintColor: tw.color("movet-black") as string,
    tabBarActiveBackgroundColor: tw.color("movet-white") as string,
    tabBarInactiveBackgroundColor: tw.color("movet-black") as string,
    tabBarInactiveTintColor: tw.color("movet-white") as string,
  },
};
