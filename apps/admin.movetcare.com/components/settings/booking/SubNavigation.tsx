import {
  faHospitalAlt,
  faHouse,
  faHeadset,
  faCalendarCheck,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";

export const subNavigation = [
  {
    name: "Services",
    href: "/settings/booking/",
    icon: faCalendarCheck,
  },
  {
    name: "Clinic",
    href: "/settings/booking/clinic",
    icon: faHospitalAlt,
  },
  {
    name: "Housecalls",
    href: "/settings/booking/housecall",
    icon: faHouse,
  },
  {
    name: "Telehealth",
    href: "/settings/booking/telehealth",
    icon: faHeadset,
  },
  {
    name: "Pop-Up Clinics",
    href: "/settings/booking/pop-up-clinics",
    icon: faFlag,
  },
];
