import TelehealthIcon from "assets/images/svgs/telehealth.svg";
import BoutiqueIcon from "assets/images/svgs/boutique.svg";
import PharmacyIcon from "assets/images/svgs/pharmacy.svg";
import MobileIcon from "assets/images/svgs/mobile.svg";
import DogWashIcon from "assets/images/svgs/dog-wash.svg";
import ClinicIcon from "assets/images/svgs/clinic.svg";
import ClinicAltIcon from "assets/images/svgs/clinic-alt.svg";
import { Text } from "./Text";
import { ReactNode } from "react";

type SupportedIcons =
  | "telehealth"
  | "boutique"
  | "pharmacy"
  | "mobile"
  | "dog-wash"
  | "clinic"
  | "clinic-alt";

export const Icon = ({
  name,
  size = "xs",
  style,
  height,
  width,
}: {
  name: SupportedIcons;
  size?: "xs";
  style?: any;
  height?: number;
  width?: number;
}): ReactNode => {
  let iconHeight, iconWidth;
  if (height || width) {
    if (height) iconHeight = height;
    if (width) iconWidth = width;
  } else
    switch (size) {
      case "xs":
        iconHeight = 30;
        iconWidth = 30;
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
    default:
      return <Text>MISSING ICON</Text>;
  }
};
