import TelehealthIcon from "assets/icons/svgs/custom/telehealth.svg";
import BoutiqueIcon from "assets/icons/svgs/custom/boutique.svg";
import PharmacyIcon from "assets/icons/svgs/custom/pharmacy.svg";
import MobileIcon from "assets/icons/svgs/custom/mobile.svg";
import DogWashIcon from "assets/icons/svgs/custom/dog-wash.svg";
import ClinicIcon from "assets/icons/svgs/custom/clinic.svg";
import ClinicAltIcon from "assets/icons/svgs/custom/clinic-alt.svg";
import PooIcon from "assets/icons/svgs/font-awesome/poo.svg";
import PooIconDark from "assets/icons/svgs/font-awesome/poo-dark.svg";
import BullhornIcon from "assets/icons/svgs/font-awesome/bullhorn.svg";
import BullhornIconDark from "assets/icons/svgs/font-awesome/bullhorn-dark.svg";
import SpinnerIcon from "assets/icons/svgs/font-awesome/spinner.svg";
import SpinnerIconDark from "assets/icons/svgs/font-awesome/spinner-dark.svg";
import ArrowRightIcon from "assets/icons/svgs/font-awesome/arrow-right.svg";
import ArrowRightIconDark from "assets/icons/svgs/font-awesome/arrow-right-dark.svg";
import LockIcon from "assets/icons/svgs/font-awesome/lock.svg";
import LockIconDark from "assets/icons/svgs/font-awesome/lock-dark.svg";
import LockOpenIcon from "assets/icons/svgs/font-awesome/lock-open.svg";
import LockOpenIconDark from "assets/icons/svgs/font-awesome/lock-open-dark.svg";
import PlaneIcon from "assets/icons/svgs/font-awesome/plane.svg";
import PlaneIconDark from "assets/icons/svgs/font-awesome/plane-dark.svg";
import CloseIcon from "assets/icons/svgs/font-awesome/close.svg";
import CloseIconDark from "assets/icons/svgs/font-awesome/close-dark.svg";
import RedoIcon from "assets/icons/svgs/font-awesome/redo.svg";
import RedoIconDark from "assets/icons/svgs/font-awesome/redo-dark.svg";
import HospitalIcon from "assets/icons/svgs/font-awesome/hospital.svg";
import HospitalIconDark from "assets/icons/svgs/font-awesome/hospital-dark.svg";
import GearIcon from "assets/icons/svgs/font-awesome/gear.svg";
import GearIconDark from "assets/icons/svgs/font-awesome/gear-dark.svg";
import HouseMedicalIcon from "assets/icons/svgs/font-awesome/house-medical.svg";
import HouseMedicalIconDark from "assets/icons/svgs/font-awesome/house-medical-dark.svg";
import ClipboardMedicalIcon from "assets/icons/svgs/font-awesome/clipboard-medical.svg";
import ClipboardMedicalIconDark from "assets/icons/svgs/font-awesome/clipboard-medical-dark.svg";
import UserMedicalMessageIcon from "assets/icons/svgs/font-awesome/user-doctor-message.svg";
import UserMedicalMessageIconDark from "assets/icons/svgs/font-awesome/user-doctor-message-dark.svg";
import PawIcon from "assets/icons/svgs/font-awesome/paw.svg";
import PawIconDark from "assets/icons/svgs/font-awesome/paw-dark.svg";
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
  | "plane"
  | "close"
  | "redo"
  | "house-medical"
  | "clipboard-medical"
  | "paw"
  | "user-medical-message"
  | "hospital"
  | "gear";

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
  console.log({ name, color });
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
    case "close":
      return showWhiteIcon ? (
        <CloseIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <CloseIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "redo":
      return showWhiteIcon ? (
        <RedoIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <RedoIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "house-medical":
      return showWhiteIcon ? (
        <HouseMedicalIconDark
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      ) : (
        <HouseMedicalIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "clipboard-medical":
      return showWhiteIcon ? (
        <ClipboardMedicalIconDark
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      ) : (
        <ClipboardMedicalIcon
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      );
    case "paw":
      return showWhiteIcon ? (
        <PawIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <PawIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "user-medical-message":
      return showWhiteIcon ? (
        <UserMedicalMessageIconDark
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      ) : (
        <UserMedicalMessageIcon
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      );
    case "hospital":
      return showWhiteIcon ? (
        <HospitalIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <HospitalIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "gear":
      return showWhiteIcon ? (
        <GearIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <GearIcon height={iconHeight} width={iconWidth} style={style} />
      );
    default:
      return showWhiteIcon ? (
        <PooIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <PooIcon height={iconHeight} width={iconWidth} style={style} />
      );
  }
};
