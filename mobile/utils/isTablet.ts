import * as Device from "expo-device";
import { DeviceType } from "expo-device";

export const isTablet = Device?.deviceType === (2 as DeviceType.TABLET);
