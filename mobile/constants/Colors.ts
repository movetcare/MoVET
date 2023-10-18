/* eslint-disable import/no-anonymous-default-export */
import tw from "tailwind";

export default {
  light: {
    text: tw.color("movet-black"),
    background: tw.color("movet-white"),
    tint: tw.color("movet-red"),
    tabIconDefault: "#ccc",
    tabIconSelected: tw.color("movet-red"),
  },
  dark: {
    text: tw.color("movet-white"),
    background: tw.color("movet-black"),
    tint: tw.color("movet-white"),
    tabIconDefault: "#ccc",
    tabIconSelected: tw.color("movet-white"),
  },
};
