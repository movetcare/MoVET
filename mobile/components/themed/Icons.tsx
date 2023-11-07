import TelehealthIcon from "assets/images/svgs/telehealth.svg";
import BoutiqueIcon from "assets/images/svgs/boutique.svg";
import PharmacyIcon from "assets/images/svgs/pharmacy.svg";
import MobileIcon from "assets/images/svgs/mobile.svg";
import DogWashIcon from "assets/images/svgs/dog-wash.svg";
import ClinicIcon from "assets/images/svgs/clinic.svg";
import ClinicAltIcon from "assets/images/svgs/clinic-alt.svg";
import PooIcon from "assets/images/svgs/poo.svg";
import PooIconDark from "assets/images/svgs/poo-dark.svg";
import BullhornIcon from "assets/images/svgs/bullhorn.svg";
import BullhornIconDark from "assets/images/svgs/bullhorn-dark.svg";
import SpinnerIcon from "assets/images/svgs/spinner.svg";
import SpinnerIconDark from "assets/images/svgs/spinner-dark.svg";
import ArrowRightIcon from "assets/images/svgs/arrow-right.svg";
import ArrowRightIconDark from "assets/images/svgs/arrow-right-dark.svg";
import LockIcon from "assets/images/svgs/lock.svg";
import LockIconDark from "assets/images/svgs/lock-dark.svg";
import LockOpenIcon from "assets/images/svgs/lock-open.svg";
import LockOpenIconDark from "assets/images/svgs/lock-open-dark.svg";
import PlaneIcon from "assets/images/svgs/plane.svg";
import PlaneIconDark from "assets/images/svgs/plane-dark.svg";
import { ReactNode } from "react";
import { useColorScheme } from "react-native";

export type SupportedIcons =
  | "telehealth"
  | "boutique"
  | "pharmacy"
  | "mobile"
  | "dog-wash"
  | "clinic"
  | "clinic-alt"
  | "bullhorn"
  | "poo"
  | "spinner"
  | "arrow-right"
  | "lock"
  | "lock-open"
  | "plane";

export const Icon = ({
  name = "poo",
  size = "xs",
  style,
  height,
  width,
  noDarkMode = false,
  color = null,
}: {
  name: SupportedIcons;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  style?: any;
  height?: number;
  width?: number;
  noDarkMode?: boolean;
  color?: null | "black" | "white";
}): ReactNode => {
  const showWhiteIcon =
    (useColorScheme() !== "light" && !noDarkMode) || color === "white";
  let iconHeight, iconWidth;
  if (height || width) {
    if (height) iconHeight = height;
    if (width) iconWidth = width;
  } else
    switch (size) {
      case "xs":
        iconHeight = 20;
        iconWidth = 20;
        break;
      case "sm":
        iconHeight = 40;
        iconWidth = 40;
        break;
      case "md":
        iconHeight = 50;
        iconWidth = 50;
        break;
      case "lg":
        iconHeight = 60;
        iconWidth = 60;
        break;
      case "xl":
        iconHeight = 70;
        iconWidth = 70;
        break;
      default:
        iconHeight = 80;
        iconWidth = 80;
        break;
    }

  switch (name) {
    case "telehealth":
      return (
        <TelehealthIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "boutique":
      return (
        <BoutiqueIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "pharmacy":
      return (
        <PharmacyIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "mobile":
      return <MobileIcon height={iconHeight} width={iconWidth} style={style} />;
    case "dog-wash":
      return (
        <DogWashIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "clinic":
      return <ClinicIcon height={iconHeight} width={iconWidth} style={style} />;
    case "clinic-alt":
      return (
        <ClinicAltIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "bullhorn":
      return showWhiteIcon ? (
        <BullhornIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <BullhornIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "spinner":
      return showWhiteIcon ? (
        <SpinnerIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <SpinnerIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "arrow-right":
      return showWhiteIcon ? (
        <ArrowRightIconDark
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      ) : (
        <ArrowRightIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "lock":
      return showWhiteIcon ? (
        <LockIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <LockIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "lock-open":
      return showWhiteIcon ? (
        <LockOpenIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <LockOpenIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "plane":
      return showWhiteIcon ? (
        <PlaneIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <PlaneIcon height={iconHeight} width={iconWidth} style={style} />
      );
    default:
      return showWhiteIcon ? (
        <PooIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <PooIcon height={iconHeight} width={iconWidth} style={style} />
      );
  }
};
