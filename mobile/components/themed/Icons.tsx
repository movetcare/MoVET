import TelehealthIcon from "assets/icons/svgs/custom/telehealth.svg";
import BoutiqueIcon from "assets/icons/svgs/custom/boutique.svg";
import PharmacyIcon from "assets/icons/svgs/custom/pharmacy.svg";
import MobileIcon from "assets/icons/svgs/custom/mobile.svg";
import DogWashIcon from "assets/icons/svgs/custom/dog-wash.svg";
import ClinicIcon from "assets/icons/svgs/custom/clinic.svg";
import ClinicAltIcon from "assets/icons/svgs/custom/clinic-alt.svg";
import TelehealthIconDark from "assets/icons/svgs/custom/telehealth.svg";
import BoutiqueIconDark from "assets/icons/svgs/custom/boutique-dark.svg";
import PharmacyIconDark from "assets/icons/svgs/custom/pharmacy-dark.svg";
import MobileIconDark from "assets/icons/svgs/custom/mobile-dark.svg";
import DogWashIconDark from "assets/icons/svgs/custom/dog-wash-dark.svg";
import ClinicIconDark from "assets/icons/svgs/custom/clinic-dark.svg";
import ClinicAltIconDark from "assets/icons/svgs/custom/clinic-alt-dark.svg";
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
import ExclamationCircleIcon from "assets/icons/svgs/font-awesome/circle-exclamation.svg";
import ExclamationCircleIconDark from "assets/icons/svgs/font-awesome/circle-exclamation-dark.svg";
import BellIcon from "assets/icons/svgs/font-awesome/bell.svg";
import BellIconDark from "assets/icons/svgs/font-awesome/bell-dark.svg";
import StarIcon from "assets/icons/svgs/font-awesome/star.svg";
import StarIconDark from "assets/icons/svgs/font-awesome/star-dark.svg";
import InfoCircleIcon from "assets/icons/svgs/font-awesome/circle-info.svg";
import InfoCircleIconDark from "assets/icons/svgs/font-awesome/circle-info-dark.svg";
import PawIcon from "assets/icons/svgs/font-awesome/paw.svg";
import PawIconDark from "assets/icons/svgs/font-awesome/paw-dark.svg";
import CalendarPlusIcon from "assets/icons/svgs/font-awesome/calendar-plus.svg";
import CalendarPlusIconDark from "assets/icons/svgs/font-awesome/calendar-plus-dark.svg";
import CatIcon from "assets/icons/svgs/font-awesome/cat.svg";
import CatIconDark from "assets/icons/svgs/font-awesome/cat-dark.svg";
import DogIcon from "assets/icons/svgs/font-awesome/dog.svg";
import DogIconDark from "assets/icons/svgs/font-awesome/dog-dark.svg";
import PlusIcon from "assets/icons/svgs/font-awesome/plus.svg";
import PlusIconDark from "assets/icons/svgs/font-awesome/plus-dark.svg";
import ListIcon from "assets/icons/svgs/font-awesome/list.svg";
import ListIconDark from "assets/icons/svgs/font-awesome/list-dark.svg";
import QuestionIcon from "assets/icons/svgs/font-awesome/question.svg";
import QuestionIconDark from "assets/icons/svgs/font-awesome/question-dark.svg";
import RightFromBracketIcon from "assets/icons/svgs/font-awesome/right-from-bracket.svg";
import RightFromBracketIconDark from "assets/icons/svgs/font-awesome/right-from-bracket-dark.svg";
import UserEditIcon from "assets/icons/svgs/font-awesome/user-edit.svg";
import UserEditIconDark from "assets/icons/svgs/font-awesome/user-edit-dark.svg";
import CreditCardIcon from "assets/icons/svgs/font-awesome/credit-card.svg";
import CreditCardIconDark from "assets/icons/svgs/font-awesome/credit-card-dark.svg";
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
  | "gear"
  | "calendar-plus"
  | "info-circle"
  | "exclamation-circle"
  | "bell"
  | "star"
  | "cat"
  | "dog"
  | "question"
  | "plus"
  | "list"
  | "right-from-bracket"
  | "user-edit"
  | "credit-card";

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
        iconHeight = 20;
        iconWidth = 20;
        break;
    }

  switch (name) {
    case "telehealth":
      return showWhiteIcon ? (
        <TelehealthIconDark
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      ) : (
        <TelehealthIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "boutique":
      return showWhiteIcon ? (
        <BoutiqueIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <BoutiqueIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "pharmacy":
      return showWhiteIcon ? (
        <PharmacyIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <PharmacyIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "mobile":
      return showWhiteIcon ? (
        <MobileIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <MobileIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "dog-wash":
      return showWhiteIcon ? (
        <DogWashIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <DogWashIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "clinic":
      return showWhiteIcon ? (
        <ClinicIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <ClinicIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "clinic-alt":
      return showWhiteIcon ? (
        <ClinicAltIconDark
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      ) : (
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
    case "calendar-plus":
      return showWhiteIcon ? (
        <CalendarPlusIconDark
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      ) : (
        <CalendarPlusIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "info-circle":
      return showWhiteIcon ? (
        <InfoCircleIconDark
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      ) : (
        <InfoCircleIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "exclamation-circle":
      return showWhiteIcon ? (
        <ExclamationCircleIconDark
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      ) : (
        <ExclamationCircleIcon
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      );
    case "bell":
      return showWhiteIcon ? (
        <BellIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <BellIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "star":
      return showWhiteIcon ? (
        <StarIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <StarIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "cat":
      return showWhiteIcon ? (
        <CatIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <CatIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "dog":
      return showWhiteIcon ? (
        <DogIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <DogIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "question":
      return showWhiteIcon ? (
        <QuestionIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <QuestionIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "plus":
      return showWhiteIcon ? (
        <PlusIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <PlusIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "user-edit":
      return showWhiteIcon ? (
        <UserEditIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <UserEditIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "list":
      return showWhiteIcon ? (
        <ListIconDark height={iconHeight} width={iconWidth} style={style} />
      ) : (
        <ListIcon height={iconHeight} width={iconWidth} style={style} />
      );
    case "right-from-bracket":
      return showWhiteIcon ? (
        <RightFromBracketIconDark
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      ) : (
        <RightFromBracketIcon
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      );
    case "credit-card":
      return showWhiteIcon ? (
        <CreditCardIconDark
          height={iconHeight}
          width={iconWidth}
          style={style}
        />
      ) : (
        <CreditCardIcon height={iconHeight} width={iconWidth} style={style} />
      );
    default:
      return showWhiteIcon ? (
        <PooIconDark height={20} width={20} style={style} />
      ) : (
        <PooIcon height={20} width={20} style={style} />
      );
  }
};
