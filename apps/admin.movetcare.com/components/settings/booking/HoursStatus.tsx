import {
  faCheck,
  faCheckCircle,
  faCircleExclamation,
  faEdit,
  faHospital,
  faMagnifyingGlass,
  faPowerOff,
  faRobot,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "components/Divider";
import { onSnapshot, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { firestore } from "services/firebase";
import { Button, Hours, Loader } from "ui";
import Error from "../../Error";
import { Switch, Transition } from "@headlessui/react";
import { classNames } from "utilities";
import toast from "react-hot-toast";
import { PatternFormat } from "react-number-format";
import { UserContext } from "contexts/UserContext";

export const HoursStatus = () => {
  const { user }: any = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [error, setError] = useState<any>(null);
  const [showAutomationSchedule, setShowAutomationSchedule] =
    useState<boolean>(false);
  const [editAutomationSchedule, setEditAutomationSchedule] = useState<
    string | null
  >(null);
  const [winterMode, setWinterMode] = useState<any>(null);
  const [hours, setHours] = useState<any>(null);
  const [didEditField, setDidEditField] = useState<boolean>(false);
  const [boutiqueStatus, setBoutiqueStatus] = useState<boolean>(false);
  const [clinicStatus, setClinicStatus] = useState<boolean>(false);
  const [housecallStatus, setHousecallStatus] = useState<boolean>(false);
  const [walkinsStatus, setWalkinsStatus] = useState<boolean>(false);
  const [isOpenMondayClinicAutomation, setIsOpenClinicMonday] =
    useState<boolean>(false);
  const [isOpenTuesdayClinicAutomation, setIsOpenClinicTuesday] =
    useState<boolean>(false);
  const [isOpenWednesdayClinicAutomation, setIsOpenClinicWednesday] =
    useState<boolean>(false);
  const [isOpenThursdayClinicAutomation, setIsOpenClinicThursday] =
    useState<boolean>(false);
  const [isOpenFridayClinicAutomation, setIsOpenClinicFriday] =
    useState<boolean>(false);
  const [isOpenSaturdayClinicAutomation, setIsOpenClinicSaturday] =
    useState<boolean>(false);
  const [isOpenSundayClinicAutomation, setIsOpenClinicSunday] =
    useState<boolean>(false);
  const [selectedClinicStartTimeTuesday, setSelectedClinicStartTimeTuesday] =
    useState<string | null>(null);
  const [selectedClinicEndTimeTuesday, setSelectedClinicEndTimeTuesday] =
    useState<string | null>(null);
  const [
    selectedClinicStartTimeWednesday,
    setSelectedClinicStartTimeWednesday,
  ] = useState<string | null>(null);
  const [selectedClinicEndTimeWednesday, setSelectedClinicEndTimeWednesday] =
    useState<string | null>(null);
  const [selectedClinicStartTimeThursday, setSelectedClinicStartTimeThursday] =
    useState<string | null>(null);
  const [selectedClinicEndTimeThursday, setSelectedClinicEndTimeThursday] =
    useState<string | null>(null);
  const [selectedClinicStartTimeFriday, setSelectedClinicStartTimeFriday] =
    useState<string | null>(null);
  const [selectedClinicEndTimeFriday, setSelectedClinicEndTimeFriday] =
    useState<string | null>(null);
  const [selectedClinicStartTimeSaturday, setSelectedClinicStartTimeSaturday] =
    useState<string | null>(null);
  const [selectedClinicEndTimeSaturday, setSelectedClinicEndTimeSaturday] =
    useState<string | null>(null);
  const [selectedClinicStartTimeSunday, setSelectedClinicStartTimeSunday] =
    useState<string | null>(null);
  const [selectedClinicEndTimeSunday, setSelectedClinicEndTimeSunday] =
    useState<string | null>(null);
  const [selectedClinicStartTimeMonday, setSelectedClinicStartTimeMonday] =
    useState<string | null>(null);
  const [selectedClinicEndTimeMonday, setSelectedClinicEndTimeMonday] =
    useState<string | null>(null);
  const [isOpenMondayBoutiqueAutomation, setIsOpenBoutiqueMonday] =
    useState<boolean>(false);
  const [isOpenTuesdayBoutiqueAutomation, setIsOpenBoutiqueTuesday] =
    useState<boolean>(false);
  const [isOpenWednesdayBoutiqueAutomation, setIsOpenBoutiqueWednesday] =
    useState<boolean>(false);
  const [isOpenThursdayBoutiqueAutomation, setIsOpenBoutiqueThursday] =
    useState<boolean>(false);
  const [isOpenFridayBoutiqueAutomation, setIsOpenBoutiqueFriday] =
    useState<boolean>(false);
  const [isOpenSaturdayBoutiqueAutomation, setIsOpenBoutiqueSaturday] =
    useState<boolean>(false);
  const [isOpenSundayBoutiqueAutomation, setIsOpenBoutiqueSunday] =
    useState<boolean>(false);
  const [
    selectedBoutiqueStartTimeTuesday,
    setSelectedBoutiqueStartTimeTuesday,
  ] = useState<string | null>(null);
  const [selectedBoutiqueEndTimeTuesday, setSelectedBoutiqueEndTimeTuesday] =
    useState<string | null>(null);
  const [
    selectedBoutiqueStartTimeWednesday,
    setSelectedBoutiqueStartTimeWednesday,
  ] = useState<string | null>(null);
  const [
    selectedBoutiqueEndTimeWednesday,
    setSelectedBoutiqueEndTimeWednesday,
  ] = useState<string | null>(null);
  const [
    selectedBoutiqueStartTimeThursday,
    setSelectedBoutiqueStartTimeThursday,
  ] = useState<string | null>(null);
  const [selectedBoutiqueEndTimeThursday, setSelectedBoutiqueEndTimeThursday] =
    useState<string | null>(null);
  const [selectedBoutiqueStartTimeFriday, setSelectedBoutiqueStartTimeFriday] =
    useState<string | null>(null);
  const [selectedBoutiqueEndTimeFriday, setSelectedBoutiqueEndTimeFriday] =
    useState<string | null>(null);
  const [
    selectedBoutiqueStartTimeSaturday,
    setSelectedBoutiqueStartTimeSaturday,
  ] = useState<string | null>(null);
  const [selectedBoutiqueEndTimeSaturday, setSelectedBoutiqueEndTimeSaturday] =
    useState<string | null>(null);
  const [selectedBoutiqueStartTimeSunday, setSelectedBoutiqueStartTimeSunday] =
    useState<string | null>(null);
  const [selectedBoutiqueEndTimeSunday, setSelectedBoutiqueEndTimeSunday] =
    useState<string | null>(null);
  const [selectedBoutiqueStartTimeMonday, setSelectedBoutiqueStartTimeMonday] =
    useState<string | null>(null);
  const [selectedBoutiqueEndTimeMonday, setSelectedBoutiqueEndTimeMonday] =
    useState<string | null>(null);
  const [isOpenMondayWalkInAutomation, setIsOpenWalkInMonday] =
    useState<boolean>(false);
  const [isOpenTuesdayWalkInAutomation, setIsOpenWalkInTuesday] =
    useState<boolean>(false);
  const [isOpenWednesdayWalkInAutomation, setIsOpenWalkInWednesday] =
    useState<boolean>(false);
  const [isOpenThursdayWalkInAutomation, setIsOpenWalkInThursday] =
    useState<boolean>(false);
  const [isOpenFridayWalkInAutomation, setIsOpenWalkInFriday] =
    useState<boolean>(false);
  const [isOpenSaturdayWalkInAutomation, setIsOpenWalkInSaturday] =
    useState<boolean>(false);
  const [isOpenSundayWalkInAutomation, setIsOpenWalkInSunday] =
    useState<boolean>(false);
  const [selectedWalkInStartTimeTuesday, setSelectedWalkInStartTimeTuesday] =
    useState<string | null>(null);
  const [selectedWalkInEndTimeTuesday, setSelectedWalkInEndTimeTuesday] =
    useState<string | null>(null);
  const [
    selectedWalkInStartTimeWednesday,
    setSelectedWalkInStartTimeWednesday,
  ] = useState<string | null>(null);
  const [selectedWalkInEndTimeWednesday, setSelectedWalkInEndTimeWednesday] =
    useState<string | null>(null);
  const [selectedWalkInStartTimeThursday, setSelectedWalkInStartTimeThursday] =
    useState<string | null>(null);
  const [selectedWalkInEndTimeThursday, setSelectedWalkInEndTimeThursday] =
    useState<string | null>(null);
  const [selectedWalkInStartTimeFriday, setSelectedWalkInStartTimeFriday] =
    useState<string | null>(null);
  const [selectedWalkInEndTimeFriday, setSelectedWalkInEndTimeFriday] =
    useState<string | null>(null);
  const [selectedWalkInStartTimeSaturday, setSelectedWalkInStartTimeSaturday] =
    useState<string | null>(null);
  const [selectedWalkInEndTimeSaturday, setSelectedWalkInEndTimeSaturday] =
    useState<string | null>(null);
  const [selectedWalkInStartTimeSunday, setSelectedWalkInStartTimeSunday] =
    useState<string | null>(null);
  const [selectedWalkInEndTimeSunday, setSelectedWalkInEndTimeSunday] =
    useState<string | null>(null);
  const [selectedWalkInStartTimeMonday, setSelectedWalkInStartTimeMonday] =
    useState<string | null>(null);
  const [selectedWalkInEndTimeMonday, setSelectedWalkInEndTimeMonday] =
    useState<string | null>(null);
  const [isOpenMondayHousecallAutomation, setIsOpenHousecallMonday] =
    useState<boolean>(false);
  const [isOpenTuesdayHousecallAutomation, setIsOpenHousecallTuesday] =
    useState<boolean>(false);
  const [isOpenWednesdayHousecallAutomation, setIsOpenHousecallWednesday] =
    useState<boolean>(false);
  const [isOpenThursdayHousecallAutomation, setIsOpenHousecallThursday] =
    useState<boolean>(false);
  const [isOpenFridayHousecallAutomation, setIsOpenHousecallFriday] =
    useState<boolean>(false);
  const [isOpenSaturdayHousecallAutomation, setIsOpenHousecallSaturday] =
    useState<boolean>(false);
  const [isOpenSundayHousecallAutomation, setIsOpenHousecallSunday] =
    useState<boolean>(false);
  const [
    selectedHousecallStartTimeTuesday,
    setSelectedHousecallStartTimeTuesday,
  ] = useState<string | null>(null);
  const [selectedHousecallEndTimeTuesday, setSelectedHousecallEndTimeTuesday] =
    useState<string | null>(null);
  const [
    selectedHousecallStartTimeWednesday,
    setSelectedHousecallStartTimeWednesday,
  ] = useState<string | null>(null);
  const [
    selectedHousecallEndTimeWednesday,
    setSelectedHousecallEndTimeWednesday,
  ] = useState<string | null>(null);
  const [
    selectedHousecallStartTimeThursday,
    setSelectedHousecallStartTimeThursday,
  ] = useState<string | null>(null);
  const [
    selectedHousecallEndTimeThursday,
    setSelectedHousecallEndTimeThursday,
  ] = useState<string | null>(null);
  const [
    selectedHousecallStartTimeFriday,
    setSelectedHousecallStartTimeFriday,
  ] = useState<string | null>(null);
  const [selectedHousecallEndTimeFriday, setSelectedHousecallEndTimeFriday] =
    useState<string | null>(null);
  const [
    selectedHousecallStartTimeSaturday,
    setSelectedHousecallStartTimeSaturday,
  ] = useState<string | null>(null);
  const [
    selectedHousecallEndTimeSaturday,
    setSelectedHousecallEndTimeSaturday,
  ] = useState<string | null>(null);
  const [
    selectedHousecallStartTimeSunday,
    setSelectedHousecallStartTimeSunday,
  ] = useState<string | null>(null);
  const [selectedHousecallEndTimeSunday, setSelectedHousecallEndTimeSunday] =
    useState<string | null>(null);
  const [
    selectedHousecallStartTimeMonday,
    setSelectedHousecallStartTimeMonday,
  ] = useState<string | null>(null);
  const [selectedHousecallEndTimeMonday, setSelectedHousecallEndTimeMonday] =
    useState<string | null>(null);
  const [didTouchBoutiqueStatus, setDidTouchBoutiqueStatus] =
    useState<boolean>(false);
  const [didTouchClinicStatus, setDidTouchClinicStatus] =
    useState<boolean>(false);
  const [didTouchWalkInsStatus, setDidTouchWalkInsStatus] =
    useState<boolean>(false);
  const [didTouchHousecallStatus, setDidTouchHousecallStatus] =
    useState<boolean>(false);
  const [clinicAutomationStatus, setClinicAutomationStatus] =
    useState<boolean>(false);
  const [housecallAutomationStatus, setHousecallAutomationStatus] =
    useState<boolean>(false);
  const [boutiqueAutomationStatus, setBoutiqueAutomationStatus] =
    useState<boolean>(false);
  const [walkinsAutomationStatus, setWalkinsAutomationStatus] =
    useState<boolean>(false);
  const [didTouchClinicAutomationStatus, setDidTouchClinicAutomationStatus] =
    useState<boolean>(false);
  const [didTouchWalkInsAutomationStatus, setDidTouchWalkInsAutomationStatus] =
    useState<boolean>(false);
  const [lastUpdatedBy, setLastUpdatedBy] = useState<string | null>(null);
  const [lastAutomationUpdatedBy, setLastAutomationUpdatedBy] = useState<
    string | null
  >(null);
  const [lastUpdatedOn, setLastUpdatedOn] = useState<string | null>(null);
  const [lastAutomationUpdatedOn, setLastAutomationUpdatedOn] = useState<
    string | null
  >(null);
  const [
    didTouchHousecallAutomationStatus,
    setDidTouchHousecallAutomationStatus,
  ] = useState<boolean>(false);
  const [
    didTouchBoutiqueAutomationStatus,
    setDidTouchBoutiqueAutomationStatus,
  ] = useState<boolean>(false);
  useEffect(() => {
    const unsubscribeWinterModeConfiguration = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => {
        setWinterMode(doc.data()?.winterMode || null);
        setIsLoadingStatus(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoadingStatus(false);
      },
    );
    const unsubscribeHoursConfiguration = onSnapshot(
      doc(firestore, "configuration", "openings"),
      (doc: any) => {
        setHours(doc.data()?.openingDates || null);
        setIsLoadingStatus(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoadingStatus(false);
      },
    );
    const unsubscribeHoursStatusConfiguration = onSnapshot(
      doc(firestore, "configuration", "hours_status"),
      (doc: any) => {
        setBoutiqueStatus(doc.data()?.boutiqueStatus || false);
        setClinicStatus(doc.data()?.clinicStatus || false);
        setHousecallStatus(doc.data()?.housecallStatus || false);
        setWalkinsStatus(doc.data()?.walkinsStatus || false);
        setLastUpdatedBy(doc.data()?.user || null);
        setLastUpdatedOn(
          doc.data()?.updatedOn?.toDate()?.toLocaleString("en-US", {
            timeZone: "America/Denver",
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        );
        setIsLoadingStatus(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoadingStatus(false);
      },
    );
    const unsubscribeBookingConfiguration = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => {
        const formatTime = (time: string) =>
          time?.toString()?.length === 3 ? `0${time}` : `${time}`;
        setLastAutomationUpdatedBy(doc.data()?.user || null);
        setLastAutomationUpdatedOn(
          doc.data()?.updatedOn?.toDate()?.toLocaleString("en-US", {
            timeZone: "America/Denver",
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        );
        setIsOpenClinicMonday(
          doc.data()?.isOpenMondayClinicAutomation || false,
        );
        setIsOpenClinicTuesday(
          doc.data()?.isOpenTuesdayClinicAutomation || false,
        );
        setIsOpenClinicWednesday(
          doc.data()?.isOpenWednesdayClinicAutomation || false,
        );
        setIsOpenClinicThursday(
          doc.data()?.isOpenThursdayClinicAutomation || false,
        );
        setIsOpenClinicFriday(
          doc.data()?.isOpenFridayClinicAutomation || false,
        );
        setIsOpenClinicSaturday(
          doc.data()?.isOpenSaturdayClinicAutomation || false,
        );
        setIsOpenClinicSunday(
          doc.data()?.isOpenSundayClinicAutomation || false,
        );
        setClinicAutomationStatus(doc.data()?.clinicAutomationStatus || false);
        setHousecallAutomationStatus(
          doc.data()?.housecallAutomationStatus || false,
        );
        setBoutiqueAutomationStatus(
          doc.data()?.boutiqueAutomationStatus || false,
        );
        setWalkinsAutomationStatus(
          doc.data()?.walkinsAutomationStatus || false,
        );
        setSelectedClinicStartTimeMonday(
          formatTime(doc.data()?.automatedClinicOpenTimeMonday),
        );
        setSelectedClinicEndTimeMonday(
          formatTime(doc.data()?.automatedClinicCloseTimeMonday),
        );
        setSelectedClinicStartTimeTuesday(
          formatTime(doc.data()?.automatedClinicOpenTimeTuesday),
        );
        setSelectedClinicEndTimeTuesday(
          formatTime(doc.data()?.automatedClinicCloseTimeTuesday),
        );
        setSelectedClinicStartTimeWednesday(
          formatTime(doc.data()?.automatedClinicOpenTimeWednesday),
        );
        setSelectedClinicEndTimeWednesday(
          formatTime(doc.data()?.automatedClinicCloseTimeWednesday),
        );
        setSelectedClinicStartTimeThursday(
          formatTime(doc.data()?.automatedClinicOpenTimeThursday),
        );
        setSelectedClinicEndTimeThursday(
          formatTime(doc.data()?.automatedClinicCloseTimeThursday),
        );
        setSelectedClinicStartTimeFriday(
          formatTime(doc.data()?.automatedClinicOpenTimeFriday),
        );
        setSelectedClinicEndTimeFriday(
          formatTime(doc.data()?.automatedClinicCloseTimeFriday),
        );
        setSelectedClinicStartTimeSaturday(
          formatTime(doc.data()?.automatedClinicOpenTimeSaturday),
        );
        setSelectedClinicEndTimeSaturday(
          formatTime(doc.data()?.automatedClinicCloseTimeSaturday),
        );
        setSelectedClinicStartTimeSunday(
          formatTime(doc.data()?.automatedClinicOpenTimeSunday),
        );
        setSelectedClinicEndTimeSunday(
          formatTime(doc.data()?.automatedClinicCloseTimeSunday),
        );
        setIsOpenHousecallMonday(
          doc.data()?.isOpenMondayHousecallAutomation || false,
        );
        setIsOpenHousecallTuesday(
          doc.data()?.isOpenTuesdayHousecallAutomation || false,
        );
        setIsOpenHousecallWednesday(
          doc.data()?.isOpenWednesdayHousecallAutomation || false,
        );
        setIsOpenHousecallThursday(
          doc.data()?.isOpenThursdayHousecallAutomation || false,
        );
        setIsOpenHousecallFriday(
          doc.data()?.isOpenFridayHousecallAutomation || false,
        );
        setIsOpenHousecallSaturday(
          doc.data()?.isOpenSaturdayHousecallAutomation || false,
        );
        setIsOpenHousecallSunday(
          doc.data()?.isOpenSundayHousecallAutomation || false,
        );
        setSelectedHousecallStartTimeMonday(
          formatTime(doc.data()?.automatedHousecallOpenTimeMonday),
        );
        setSelectedHousecallEndTimeMonday(
          formatTime(doc.data()?.automatedHousecallCloseTimeMonday),
        );
        setSelectedHousecallStartTimeTuesday(
          formatTime(doc.data()?.automatedHousecallOpenTimeTuesday),
        );
        setSelectedHousecallEndTimeTuesday(
          formatTime(doc.data()?.automatedHousecallCloseTimeTuesday),
        );
        setSelectedHousecallStartTimeWednesday(
          formatTime(doc.data()?.automatedHousecallOpenTimeWednesday),
        );
        setSelectedHousecallEndTimeWednesday(
          formatTime(doc.data()?.automatedHousecallCloseTimeWednesday),
        );
        setSelectedHousecallStartTimeThursday(
          formatTime(doc.data()?.automatedHousecallOpenTimeThursday),
        );
        setSelectedHousecallEndTimeThursday(
          formatTime(doc.data()?.automatedHousecallCloseTimeThursday),
        );
        setSelectedHousecallStartTimeFriday(
          formatTime(doc.data()?.automatedHousecallOpenTimeFriday),
        );
        setSelectedHousecallEndTimeFriday(
          formatTime(doc.data()?.automatedHousecallCloseTimeFriday),
        );
        setSelectedHousecallStartTimeSaturday(
          formatTime(doc.data()?.automatedHousecallOpenTimeSaturday),
        );
        setSelectedHousecallEndTimeSaturday(
          formatTime(doc.data()?.automatedHousecallCloseTimeSaturday),
        );
        setSelectedHousecallStartTimeSunday(
          formatTime(doc.data()?.automatedHousecallOpenTimeSunday),
        );
        setSelectedHousecallEndTimeSunday(
          formatTime(doc.data()?.automatedHousecallCloseTimeSunday),
        );
        setIsOpenBoutiqueMonday(
          doc.data()?.isOpenMondayBoutiqueAutomation || false,
        );
        setIsOpenBoutiqueTuesday(
          doc.data()?.isOpenTuesdayBoutiqueAutomation || false,
        );
        setIsOpenBoutiqueWednesday(
          doc.data()?.isOpenWednesdayBoutiqueAutomation || false,
        );
        setIsOpenBoutiqueThursday(
          doc.data()?.isOpenThursdayBoutiqueAutomation || false,
        );
        setIsOpenBoutiqueFriday(
          doc.data()?.isOpenFridayBoutiqueAutomation || false,
        );
        setIsOpenBoutiqueSaturday(
          doc.data()?.isOpenSaturdayBoutiqueAutomation || false,
        );
        setIsOpenBoutiqueSunday(
          doc.data()?.isOpenSundayBoutiqueAutomation || false,
        );
        setSelectedBoutiqueStartTimeMonday(
          formatTime(doc.data()?.automatedBoutiqueOpenTimeMonday),
        );
        setSelectedBoutiqueEndTimeMonday(
          formatTime(doc.data()?.automatedBoutiqueCloseTimeMonday),
        );
        setSelectedBoutiqueStartTimeTuesday(
          formatTime(doc.data()?.automatedBoutiqueOpenTimeTuesday),
        );
        setSelectedBoutiqueEndTimeTuesday(
          formatTime(doc.data()?.automatedBoutiqueCloseTimeTuesday),
        );
        setSelectedBoutiqueStartTimeWednesday(
          formatTime(doc.data()?.automatedBoutiqueOpenTimeWednesday),
        );
        setSelectedBoutiqueEndTimeWednesday(
          formatTime(doc.data()?.automatedBoutiqueCloseTimeWednesday),
        );
        setSelectedBoutiqueStartTimeThursday(
          formatTime(doc.data()?.automatedBoutiqueOpenTimeThursday),
        );
        setSelectedBoutiqueEndTimeThursday(
          formatTime(doc.data()?.automatedBoutiqueCloseTimeThursday),
        );
        setSelectedBoutiqueStartTimeFriday(
          formatTime(doc.data()?.automatedBoutiqueOpenTimeFriday),
        );
        setSelectedBoutiqueEndTimeFriday(
          formatTime(doc.data()?.automatedBoutiqueCloseTimeFriday),
        );
        setSelectedBoutiqueStartTimeSaturday(
          formatTime(doc.data()?.automatedBoutiqueOpenTimeSaturday),
        );
        setSelectedBoutiqueEndTimeSaturday(
          formatTime(doc.data()?.automatedBoutiqueCloseTimeSaturday),
        );
        setSelectedBoutiqueStartTimeSunday(
          formatTime(doc.data()?.automatedBoutiqueOpenTimeSunday),
        );
        setSelectedBoutiqueEndTimeSunday(
          formatTime(doc.data()?.automatedBoutiqueCloseTimeSunday),
        );
        setIsOpenWalkInMonday(
          doc.data()?.isOpenMondayWalkInAutomation || false,
        );
        setIsOpenWalkInTuesday(
          doc.data()?.isOpenTuesdayWalkInAutomation || false,
        );
        setIsOpenWalkInWednesday(
          doc.data()?.isOpenWednesdayWalkInAutomation || false,
        );
        setIsOpenWalkInThursday(
          doc.data()?.isOpenThursdayWalkInAutomation || false,
        );
        setIsOpenWalkInFriday(
          doc.data()?.isOpenFridayWalkInAutomation || false,
        );
        setIsOpenWalkInSaturday(
          doc.data()?.isOpenSaturdayWalkInAutomation || false,
        );
        setIsOpenWalkInSunday(
          doc.data()?.isOpenSundayWalkInAutomation || false,
        );
        setSelectedWalkInStartTimeMonday(
          formatTime(doc.data()?.automatedWalkInOpenTimeMonday),
        );
        setSelectedWalkInEndTimeMonday(
          formatTime(doc.data()?.automatedWalkInCloseTimeMonday),
        );
        setSelectedWalkInStartTimeTuesday(
          formatTime(doc.data()?.automatedWalkInOpenTimeTuesday),
        );
        setSelectedWalkInEndTimeTuesday(
          formatTime(doc.data()?.automatedWalkInCloseTimeTuesday),
        );
        setSelectedWalkInStartTimeWednesday(
          formatTime(doc.data()?.automatedWalkInOpenTimeWednesday),
        );
        setSelectedWalkInEndTimeWednesday(
          formatTime(doc.data()?.automatedWalkInCloseTimeWednesday),
        );
        setSelectedWalkInStartTimeThursday(
          formatTime(doc.data()?.automatedWalkInOpenTimeThursday),
        );
        setSelectedWalkInEndTimeThursday(
          formatTime(doc.data()?.automatedWalkInCloseTimeThursday),
        );
        setSelectedWalkInStartTimeFriday(
          formatTime(doc.data()?.automatedWalkInOpenTimeFriday),
        );
        setSelectedWalkInEndTimeFriday(
          formatTime(doc.data()?.automatedWalkInCloseTimeFriday),
        );
        setSelectedWalkInStartTimeSaturday(
          formatTime(doc.data()?.automatedWalkInOpenTimeSaturday),
        );
        setSelectedWalkInEndTimeSaturday(
          formatTime(doc.data()?.automatedWalkInCloseTimeSaturday),
        );
        setSelectedWalkInStartTimeSunday(
          formatTime(doc.data()?.automatedWalkInOpenTimeSunday),
        );
        setSelectedWalkInEndTimeSunday(
          formatTime(doc.data()?.automatedWalkInCloseTimeSunday),
        );
        setIsLoading(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoading(false);
      },
    );
    return () => {
      unsubscribeBookingConfiguration();
      unsubscribeHoursStatusConfiguration();
      unsubscribeHoursConfiguration();
      unsubscribeWinterModeConfiguration();
    };
  }, []);

  const saveHoursOverrideChanges = async () =>
    await setDoc(
      doc(firestore, "configuration/hours_status"),
      {
        boutiqueStatus,
        clinicStatus,
        housecallStatus,
        walkinsStatus,
        user: user?.displayName || user?.email || null,
        updatedOn: serverTimestamp(),
      },
      { merge: true },
    )
      .then(() =>
        toast(`Website Hours Override will Appear in ~ 5 Minutes!`, {
          position: "top-center",
          icon: (
            <FontAwesomeIcon
              icon={faCheckCircle}
              size="sm"
              className="text-movet-green"
            />
          ),
        }),
      )
      .catch((error: any) =>
        toast(`Website Hours Override Update FAILED: ${error?.message}`, {
          duration: 5000,

          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              className="text-movet-red"
            />
          ),
        }),
      )
      .finally(() => {
        setDidEditField(false);
        setDidTouchClinicStatus(false);
        setDidTouchHousecallStatus(false);
        setDidTouchBoutiqueStatus(false);
        setDidTouchWalkInsStatus(false);
      });
  const saveBookingConfigChanges = async () =>
    await setDoc(
      doc(firestore, "configuration/bookings"),
      {
        user: user?.displayName || user?.email || null,
        boutiqueStatus,
        clinicStatus,
        housecallStatus,
        walkinsStatus,
        clinicAutomationStatus,
        housecallAutomationStatus,
        boutiqueAutomationStatus,
        walkinsAutomationStatus,
        automatedClinicOpenTimeSunday: Number(selectedClinicStartTimeSunday),
        automatedClinicCloseTimeSunday: Number(selectedClinicEndTimeSunday),
        automatedClinicOpenTimeMonday: Number(selectedClinicStartTimeMonday),
        automatedClinicCloseTimeMonday: Number(selectedClinicEndTimeMonday),
        automatedClinicOpenTimeTuesday: Number(selectedClinicStartTimeTuesday),
        automatedClinicCloseTimeTuesday: Number(selectedClinicEndTimeTuesday),
        automatedClinicOpenTimeWednesday: Number(
          selectedClinicStartTimeWednesday,
        ),
        automatedClinicCloseTimeWednesday: Number(
          selectedClinicEndTimeWednesday,
        ),
        automatedClinicOpenTimeThursday: Number(
          selectedClinicStartTimeThursday,
        ),
        automatedClinicCloseTimeThursday: Number(selectedClinicEndTimeThursday),
        automatedClinicOpenTimeFriday: Number(selectedClinicStartTimeFriday),
        automatedClinicCloseTimeFriday: Number(selectedClinicEndTimeFriday),
        automatedClinicOpenTimeSaturday: Number(
          selectedClinicStartTimeSaturday,
        ),
        automatedClinicCloseTimeSaturday: Number(selectedClinicEndTimeSaturday),
        isOpenMondayClinicAutomation,
        isOpenTuesdayClinicAutomation,
        isOpenWednesdayClinicAutomation,
        isOpenThursdayClinicAutomation,
        isOpenFridayClinicAutomation,
        isOpenSaturdayClinicAutomation,
        isOpenSundayClinicAutomation,
        automatedBoutiqueOpenTimeSunday: Number(
          selectedBoutiqueStartTimeSunday,
        ),
        automatedBoutiqueCloseTimeSunday: Number(selectedBoutiqueEndTimeSunday),
        automatedBoutiqueOpenTimeMonday: Number(
          selectedBoutiqueStartTimeMonday,
        ),
        automatedBoutiqueCloseTimeMonday: Number(selectedBoutiqueEndTimeMonday),
        automatedBoutiqueOpenTimeTuesday: Number(
          selectedBoutiqueStartTimeTuesday,
        ),
        automatedBoutiqueCloseTimeTuesday: Number(
          selectedBoutiqueEndTimeTuesday,
        ),
        automatedBoutiqueOpenTimeWednesday: Number(
          selectedBoutiqueStartTimeWednesday,
        ),
        automatedBoutiqueCloseTimeWednesday: Number(
          selectedBoutiqueEndTimeWednesday,
        ),
        automatedBoutiqueOpenTimeThursday: Number(
          selectedBoutiqueStartTimeThursday,
        ),
        automatedBoutiqueCloseTimeThursday: Number(
          selectedBoutiqueEndTimeThursday,
        ),
        automatedBoutiqueOpenTimeFriday: Number(
          selectedBoutiqueStartTimeFriday,
        ),
        automatedBoutiqueCloseTimeFriday: Number(selectedBoutiqueEndTimeFriday),
        automatedBoutiqueOpenTimeSaturday: Number(
          selectedBoutiqueStartTimeSaturday,
        ),
        automatedBoutiqueCloseTimeSaturday: Number(
          selectedBoutiqueEndTimeSaturday,
        ),
        isOpenMondayBoutiqueAutomation,
        isOpenTuesdayBoutiqueAutomation,
        isOpenWednesdayBoutiqueAutomation,
        isOpenThursdayBoutiqueAutomation,
        isOpenFridayBoutiqueAutomation,
        isOpenSaturdayBoutiqueAutomation,
        isOpenSundayBoutiqueAutomation,
        automatedWalkInOpenTimeSunday: Number(selectedWalkInStartTimeSunday),
        automatedWalkInCloseTimeSunday: Number(selectedWalkInEndTimeSunday),
        automatedWalkInOpenTimeMonday: Number(selectedWalkInStartTimeMonday),
        automatedWalkInCloseTimeMonday: Number(selectedWalkInEndTimeMonday),
        automatedWalkInOpenTimeTuesday: Number(selectedWalkInStartTimeTuesday),
        automatedWalkInCloseTimeTuesday: Number(selectedWalkInEndTimeTuesday),
        automatedWalkInOpenTimeWednesday: Number(
          selectedWalkInStartTimeWednesday,
        ),
        automatedWalkInCloseTimeWednesday: Number(
          selectedWalkInEndTimeWednesday,
        ),
        automatedWalkInOpenTimeThursday: Number(
          selectedWalkInStartTimeThursday,
        ),
        automatedWalkInCloseTimeThursday: Number(selectedWalkInEndTimeThursday),
        automatedWalkInOpenTimeFriday: Number(selectedWalkInStartTimeFriday),
        automatedWalkInCloseTimeFriday: Number(selectedWalkInEndTimeFriday),
        automatedWalkInOpenTimeSaturday: Number(
          selectedWalkInStartTimeSaturday,
        ),
        automatedWalkInCloseTimeSaturday: Number(selectedWalkInEndTimeSaturday),
        isOpenMondayWalkInAutomation,
        isOpenTuesdayWalkInAutomation,
        isOpenWednesdayWalkInAutomation,
        isOpenThursdayWalkInAutomation,
        isOpenFridayWalkInAutomation,
        isOpenSaturdayWalkInAutomation,
        isOpenSundayWalkInAutomation,
        automatedHousecallOpenTimeSunday: Number(
          selectedHousecallStartTimeSunday,
        ),
        automatedHousecallCloseTimeSunday: Number(
          selectedHousecallEndTimeSunday,
        ),
        automatedHousecallOpenTimeMonday: Number(
          selectedHousecallStartTimeMonday,
        ),
        automatedHousecallCloseTimeMonday: Number(
          selectedHousecallEndTimeMonday,
        ),
        automatedHousecallOpenTimeTuesday: Number(
          selectedHousecallStartTimeTuesday,
        ),
        automatedHousecallCloseTimeTuesday: Number(
          selectedHousecallEndTimeTuesday,
        ),
        automatedHousecallOpenTimeWednesday: Number(
          selectedHousecallStartTimeWednesday,
        ),
        automatedHousecallCloseTimeWednesday: Number(
          selectedHousecallEndTimeWednesday,
        ),
        automatedHousecallOpenTimeThursday: Number(
          selectedHousecallStartTimeThursday,
        ),
        automatedHousecallCloseTimeThursday: Number(
          selectedHousecallEndTimeThursday,
        ),
        automatedHousecallOpenTimeFriday: Number(
          selectedHousecallStartTimeFriday,
        ),
        automatedHousecallCloseTimeFriday: Number(
          selectedHousecallEndTimeFriday,
        ),
        automatedHousecallOpenTimeSaturday: Number(
          selectedHousecallStartTimeSaturday,
        ),
        automatedHousecallCloseTimeSaturday: Number(
          selectedHousecallEndTimeSaturday,
        ),
        isOpenMondayHousecallAutomation,
        isOpenTuesdayHousecallAutomation,
        isOpenWednesdayHousecallAutomation,
        isOpenThursdayHousecallAutomation,
        isOpenFridayHousecallAutomation,
        isOpenSaturdayHousecallAutomation,
        isOpenSundayHousecallAutomation,
        updatedOn: serverTimestamp(),
      },
      { merge: true },
    )
      .then(() =>
        toast(`Website Hours Status Updated will Appear in ~ 5 Minutes!`, {
          position: "top-center",
          icon: (
            <FontAwesomeIcon
              icon={faCheckCircle}
              size="sm"
              className="text-movet-green"
            />
          ),
        }),
      )
      .catch((error: any) =>
        toast(`Website Hours Status Update FAILED: ${error?.message}`, {
          duration: 5000,

          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              className="text-movet-red"
            />
          ),
        }),
      )
      .finally(() => {
        setDidTouchBoutiqueAutomationStatus(false);
        setDidTouchClinicAutomationStatus(false);
        setDidTouchHousecallAutomationStatus(false);
        setDidTouchWalkInsAutomationStatus(false);
        setDidEditField(false);
        setShowAutomationSchedule(false);
      });
  const updateAutomationSchedule = (
    type: "clinic" | "housecall" | "boutique" | "walkins",
  ) => {
    if (type === editAutomationSchedule || editAutomationSchedule === null)
      setShowAutomationSchedule(!showAutomationSchedule);
    setEditAutomationSchedule(type);
  };
  return (
    <div className="py-4 flex-col sm:flex-row items-center justify-center">
      <h3 className="text-center -mb-4">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="mr-2 text-movet-green"
        />
        Website Hours Page Preview
      </h3>
      <Hours
        winterMode={winterMode}
        hours={hours}
        // hoursStatus={{
        //   boutiqueStatus,
        //   clinicStatus,
        //   housecallStatus,
        //   walkinsStatus,
        // }}
        previewMode
      />
      <h3>HOURS STATUS OVERRIDES & AUTOMATION</h3>
      <p className="text-sm">
        Use these settings to override the automated OPEN/CLOSE status on the{" "}
        <a
          href="https://movetcare.com/hours"
          target="_blank"
          className="text-movet-red hover:underline"
        >
          website hours page
        </a>
        .
      </p>
      <Divider />
      {isLoading || isLoadingStatus ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : (
        <>
          <h3 className="text-center">
            <FontAwesomeIcon
              icon={faPowerOff}
              className="mr-2 text-movet-green"
            />
            OPEN / CLOSED Hours Overrides
          </h3>
          {lastUpdatedBy && (
            <p className="text-xs mb-2 text-center italic">
              Last Changed By: {lastUpdatedBy}
            </p>
          )}
          {lastUpdatedOn && (
            <p className="text-xs mb-2 text-center italic">{lastUpdatedOn}</p>
          )}
          <div className="flex flex-row justify-center items-center mb-8">
            <div className="flex flex-col w-full mx-auto justify-center items-center">
              <FontAwesomeIcon
                icon={faHospital}
                size="3x"
                className={`w-full mt-4${
                  clinicStatus ? ` text-movet-green` : ` text-movet-red`
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Clinic Status:{" "}
                  <span
                    className={`italic${
                      clinicStatus ? " text-movet-green" : " text-movet-red"
                    }`}
                  >
                    {clinicStatus ? "OPEN" : "CLOSED"}
                  </span>
                </span>
              </label>
              <Switch
                checked={clinicStatus}
                onChange={() => {
                  setClinicStatus(!clinicStatus);
                  setDidTouchClinicStatus(true);
                }}
                className={classNames(
                  clinicStatus ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    clinicStatus ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                  )}
                />
              </Switch>
              <FontAwesomeIcon
                icon={faShop}
                size="3x"
                className={`w-full mt-8${
                  boutiqueStatus ? " text-movet-green" : " text-movet-red"
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Boutique Status:{" "}
                  <span
                    className={`italic${
                      boutiqueStatus ? " text-movet-green" : " text-movet-red"
                    }`}
                  >
                    {boutiqueStatus ? "OPEN" : "CLOSED"}
                  </span>
                </span>
              </label>
              <Switch
                checked={boutiqueStatus}
                onChange={() => {
                  setBoutiqueStatus(!boutiqueStatus);
                  setDidTouchBoutiqueStatus(true);
                }}
                className={classNames(
                  boutiqueStatus ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    boutiqueStatus ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                  )}
                />
              </Switch>
            </div>
            {/* <div className="flex flex-col w-full mx-auto justify-center items-center">
              <FontAwesomeIcon
                icon={faPersonWalking}
                size="3x"
                className={`w-full mt-4${
                  walkinsStatus ? ` text-movet-green` : ` text-movet-red`
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Walk-Ins Status:{" "}
                  <span
                    className={`italic${
                      walkinsStatus ? " text-movet-green" : " text-movet-red"
                    }`}
                  >
                    {walkinsStatus ? "OPEN" : "CLOSED"}
                  </span>
                </span>
              </label>
              <Switch
                checked={walkinsStatus}
                onChange={() => {
                  setWalkinsStatus(!walkinsStatus);
                  setDidTouchWalkInsStatus(true);
                }}
                className={classNames(
                  walkinsStatus ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    walkinsStatus ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                  )}
                />
              </Switch>
              <FontAwesomeIcon
                icon={faHouseMedical}
                size="3x"
                className={`w-full mt-8${
                  housecallStatus ? ` text-movet-green` : ` text-movet-red`
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Housecalls Status:{" "}
                  <span
                    className={`italic${
                      housecallStatus ? " text-movet-green" : " text-movet-red"
                    }`}
                  >
                    {housecallStatus ? "OPEN" : "CLOSED"}
                  </span>
                </span>
              </label>
              <Switch
                checked={housecallStatus}
                onChange={() => {
                  setHousecallStatus(!housecallStatus);
                  setDidTouchHousecallStatus(true);
                }}
                className={classNames(
                  housecallStatus ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    housecallStatus ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                  )}
                />
              </Switch>
            </div> */}
          </div>
          <Transition
            show={
              didTouchClinicStatus ||
              didTouchBoutiqueStatus ||
              didTouchWalkInsStatus ||
              didTouchHousecallStatus
            }
            enter="transition ease-in duration-500"
            leave="transition ease-out duration-64"
            leaveTo="opacity-10"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
          >
            <Button
              text="SAVE"
              color="red"
              icon={faCheck}
              onClick={() => saveHoursOverrideChanges()}
              className="mt-8"
            />
          </Transition>
          <Divider />
          <h3 className="text-center mt-8">
            <FontAwesomeIcon icon={faRobot} className="mr-2 text-movet-green" />
            Automated OPEN / CLOSED Times
          </h3>
          <p className="text-center text-xs italic mb-4">
            *Be sure to update the &quot;HOURS OF OPERATION DISPLAY&quot;
            section below if you change any of these fields!
          </p>
          {lastAutomationUpdatedBy && (
            <p className="text-xs mb-2 text-center italic">
              Last Changed By: {lastAutomationUpdatedBy}
            </p>
          )}
          {lastAutomationUpdatedOn && (
            <p className="text-xs mb-2 text-center italic">
              Last Automation Run/Edit: {lastAutomationUpdatedOn}
            </p>
          )}
          <div className="flex flex-row justify-center items-center mb-8">
            <div className="flex flex-col w-full mx-auto justify-center items-center">
              <FontAwesomeIcon
                icon={faHospital}
                size="3x"
                className={`w-full mt-4 ${
                  clinicAutomationStatus
                    ? ` text-movet-green`
                    : ` text-movet-red`
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Clinic Automation:{" "}
                  <span
                    className={`italic${
                      clinicAutomationStatus
                        ? " text-movet-green"
                        : " text-movet-red"
                    }`}
                  >
                    {clinicAutomationStatus ? "ON" : "OFF"}
                  </span>
                </span>
              </label>
              <Switch
                checked={clinicAutomationStatus}
                onChange={() => {
                  setClinicAutomationStatus(!clinicAutomationStatus);
                  setDidTouchClinicAutomationStatus(true);
                }}
                className={classNames(
                  clinicAutomationStatus ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    clinicAutomationStatus ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                  )}
                />
              </Switch>
              {clinicAutomationStatus && (
                <p
                  className="text-center text-xs italic my-4 hover:text-movet-red cursor-pointer"
                  onClick={() => updateAutomationSchedule("clinic")}
                >
                  Edit Schedule
                  <FontAwesomeIcon icon={faEdit} className="ml-2" />
                </p>
              )}
              <FontAwesomeIcon
                icon={faShop}
                size="3x"
                className={`w-full mt-8${
                  boutiqueAutomationStatus
                    ? " text-movet-green"
                    : " text-movet-red"
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Boutique Automation:{" "}
                  <span
                    className={`italic${
                      boutiqueAutomationStatus
                        ? " text-movet-green"
                        : " text-movet-red"
                    }`}
                  >
                    {boutiqueAutomationStatus ? "ON" : "OFF"}
                  </span>
                </span>
              </label>
              <Switch
                checked={boutiqueAutomationStatus}
                onChange={() => {
                  setBoutiqueAutomationStatus(!boutiqueAutomationStatus);
                  setDidTouchBoutiqueAutomationStatus(true);
                }}
                className={classNames(
                  boutiqueAutomationStatus ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    boutiqueAutomationStatus
                      ? "translate-x-5"
                      : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                  )}
                />
              </Switch>
              {boutiqueAutomationStatus && (
                <p
                  className="text-center text-xs italic my-4 hover:text-movet-red cursor-pointer"
                  onClick={() => updateAutomationSchedule("boutique")}
                >
                  Edit Schedule
                  <FontAwesomeIcon icon={faEdit} className="ml-2" />
                </p>
              )}
            </div>
            {/* <div className="flex flex-col w-full mx-auto justify-center items-center">
              <FontAwesomeIcon
                icon={faPersonWalking}
                size="3x"
                className={`w-full mt-4 ${
                  walkinsAutomationStatus
                    ? ` text-movet-green`
                    : ` text-movet-red`
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Walk-Ins Automation:{" "}
                  <span
                    className={`italic${
                      walkinsAutomationStatus
                        ? " text-movet-green"
                        : " text-movet-red"
                    }`}
                  >
                    {walkinsAutomationStatus ? "ON" : "OFF"}
                  </span>
                </span>
              </label>
              <Switch
                checked={walkinsAutomationStatus}
                onChange={() => {
                  setWalkinsAutomationStatus(!walkinsAutomationStatus);
                  setDidTouchWalkInsAutomationStatus(true);
                }}
                className={classNames(
                  walkinsAutomationStatus ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    walkinsAutomationStatus ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
              {walkinsAutomationStatus && (
                <p
                  className="text-center text-xs italic my-4 hover:text-movet-red cursor-pointer"
                  onClick={() => updateAutomationSchedule("walkins")}
                >
                  Edit Schedule
                  <FontAwesomeIcon icon={faEdit} className="ml-2" />
                </p>
              )}
              <FontAwesomeIcon
                icon={faHouseMedical}
                size="3x"
                className={`w-full mt-8${
                  housecallAutomationStatus
                    ? ` text-movet-green`
                    : ` text-movet-red`
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Housecalls Automation:{" "}
                  <span
                    className={`italic${
                      housecallAutomationStatus
                        ? " text-movet-green"
                        : " text-movet-red"
                    }`}
                  >
                    {housecallAutomationStatus ? "ON" : "OFF"}
                  </span>
                </span>
              </label>
              <Switch
                checked={housecallAutomationStatus}
                onChange={() => {
                  setHousecallAutomationStatus(!housecallAutomationStatus);
                  setDidTouchHousecallAutomationStatus(true);
                }}
                className={classNames(
                  housecallAutomationStatus ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    housecallAutomationStatus
                      ? "translate-x-5"
                      : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
              {housecallAutomationStatus && (
                <p
                  className="text-center text-xs italic my-4 hover:text-movet-red cursor-pointer"
                  onClick={() => updateAutomationSchedule("housecall")}
                >
                  Edit Schedule
                  <FontAwesomeIcon icon={faEdit} className="ml-2" />
                </p>
              )}
            </div> */}
          </div>
          <Transition
            show={showAutomationSchedule}
            enter="transition ease-in duration-500"
            leave="transition ease-out duration-64"
            leaveTo="opacity-10"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
          >
            <div className="flex flex-col items-center justify-center">
              <hr className="w-2/3 mb-2 text-movet-gray" />
              <h2>
                EDIT{" "}
                <span className="text-extrabold underline text-movet-brown">
                  {editAutomationSchedule?.toUpperCase()}
                </span>{" "}
                AUTOMATION SCHEDULE
              </h2>
              <div className="flex justify-center items-center">
                <div className="flex flex-col justify-center items-center mx-4">
                  <p className="text-center my-2">MONDAY</p>
                  <Switch
                    checked={
                      editAutomationSchedule === "clinic"
                        ? isOpenMondayClinicAutomation
                        : editAutomationSchedule === "boutique"
                          ? isOpenMondayBoutiqueAutomation
                          : editAutomationSchedule === "walkins"
                            ? isOpenMondayWalkInAutomation
                            : editAutomationSchedule === "housecall"
                              ? isOpenMondayHousecallAutomation
                              : false
                    }
                    onChange={() => {
                      switch (editAutomationSchedule) {
                        case "clinic":
                          setIsOpenClinicMonday(!isOpenMondayClinicAutomation);
                          break;
                        case "housecall":
                          setIsOpenHousecallMonday(
                            !isOpenMondayHousecallAutomation,
                          );
                          break;
                        case "boutique":
                          setIsOpenBoutiqueMonday(
                            !isOpenMondayBoutiqueAutomation,
                          );
                          break;
                        case "walkins":
                          setIsOpenWalkInMonday(!isOpenMondayWalkInAutomation);
                          break;
                        default:
                          break;
                      }
                      setDidEditField(true);
                    }}
                    className={classNames(
                      editAutomationSchedule === "clinic"
                        ? isOpenMondayClinicAutomation
                          ? "bg-movet-green"
                          : "bg-movet-red"
                        : editAutomationSchedule === "boutique"
                          ? isOpenMondayBoutiqueAutomation
                            ? "bg-movet-green"
                            : "bg-movet-red"
                          : editAutomationSchedule === "walkins"
                            ? isOpenMondayWalkInAutomation
                              ? "bg-movet-green"
                              : "bg-movet-red"
                            : editAutomationSchedule === "housecall"
                              ? isOpenMondayHousecallAutomation
                                ? "bg-movet-green"
                                : "bg-movet-red"
                              : "",
                      "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        editAutomationSchedule === "clinic"
                          ? isOpenMondayClinicAutomation
                            ? "translate-x-5"
                            : "translate-x-0"
                          : editAutomationSchedule === "boutique"
                            ? isOpenMondayBoutiqueAutomation
                              ? "translate-x-5"
                              : "translate-x-0"
                            : editAutomationSchedule === "walkins"
                              ? isOpenMondayWalkInAutomation
                                ? "translate-x-5"
                                : "translate-x-0"
                              : editAutomationSchedule === "housecall"
                                ? isOpenMondayHousecallAutomation
                                  ? "translate-x-5"
                                  : "translate-x-0"
                                : "",
                        "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                      )}
                    />
                  </Switch>
                </div>
                <div className="flex justify-center items-center my-1">
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">Start Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"start-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicStartTimeMonday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueStartTimeMonday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInStartTimeMonday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallStartTimeMonday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicStartTimeMonday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallStartTimeMonday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueStartTimeMonday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInStartTimeMonday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">End Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"end-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicEndTimeMonday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueEndTimeMonday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInEndTimeMonday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallEndTimeMonday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicEndTimeMonday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallEndTimeMonday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueEndTimeMonday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInEndTimeMonday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center my-1">
                <div className="flex flex-col justify-center items-center mx-4">
                  <p className="text-center my-2">TUESDAY</p>
                  <Switch
                    checked={
                      editAutomationSchedule === "clinic"
                        ? isOpenTuesdayClinicAutomation
                        : editAutomationSchedule === "boutique"
                          ? isOpenTuesdayBoutiqueAutomation
                          : editAutomationSchedule === "walkins"
                            ? isOpenTuesdayWalkInAutomation
                            : editAutomationSchedule === "housecall"
                              ? isOpenTuesdayHousecallAutomation
                              : false
                    }
                    onChange={() => {
                      switch (editAutomationSchedule) {
                        case "clinic":
                          setIsOpenClinicTuesday(
                            !isOpenTuesdayClinicAutomation,
                          );
                          break;
                        case "housecall":
                          setIsOpenHousecallTuesday(
                            !isOpenTuesdayHousecallAutomation,
                          );
                          break;
                        case "boutique":
                          setIsOpenBoutiqueTuesday(
                            !isOpenTuesdayBoutiqueAutomation,
                          );
                          break;
                        case "walkins":
                          setIsOpenWalkInTuesday(
                            !isOpenTuesdayWalkInAutomation,
                          );
                          break;
                        default:
                          break;
                      }
                      setDidEditField(true);
                    }}
                    className={classNames(
                      editAutomationSchedule === "clinic"
                        ? isOpenTuesdayClinicAutomation
                          ? "bg-movet-green"
                          : "bg-movet-red"
                        : editAutomationSchedule === "boutique"
                          ? isOpenTuesdayBoutiqueAutomation
                            ? "bg-movet-green"
                            : "bg-movet-red"
                          : editAutomationSchedule === "walkins"
                            ? isOpenTuesdayWalkInAutomation
                              ? "bg-movet-green"
                              : "bg-movet-red"
                            : editAutomationSchedule === "housecall"
                              ? isOpenTuesdayHousecallAutomation
                                ? "bg-movet-green"
                                : "bg-movet-red"
                              : "",
                      "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        editAutomationSchedule === "clinic"
                          ? isOpenTuesdayClinicAutomation
                            ? "translate-x-5"
                            : "translate-x-0"
                          : editAutomationSchedule === "boutique"
                            ? isOpenTuesdayBoutiqueAutomation
                              ? "translate-x-5"
                              : "translate-x-0"
                            : editAutomationSchedule === "walkins"
                              ? isOpenTuesdayWalkInAutomation
                                ? "translate-x-5"
                                : "translate-x-0"
                              : editAutomationSchedule === "housecall"
                                ? isOpenTuesdayHousecallAutomation
                                  ? "translate-x-5"
                                  : "translate-x-0"
                                : "",
                        "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                      )}
                    />
                  </Switch>
                </div>
                <div className="flex justify-center items-center my-1">
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">Start Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"start-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicStartTimeTuesday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueStartTimeTuesday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInStartTimeTuesday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallStartTimeTuesday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicStartTimeTuesday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallStartTimeTuesday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueStartTimeTuesday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInStartTimeTuesday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">End Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"end-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicEndTimeTuesday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueEndTimeTuesday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInEndTimeTuesday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallEndTimeTuesday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicEndTimeTuesday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallEndTimeTuesday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueEndTimeTuesday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInEndTimeTuesday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center my-1">
                <div className="flex flex-col justify-center items-center mx-4">
                  <p className="text-center my-2">WEDNESDAY</p>
                  <Switch
                    checked={
                      editAutomationSchedule === "clinic"
                        ? isOpenWednesdayClinicAutomation
                        : editAutomationSchedule === "boutique"
                          ? isOpenWednesdayBoutiqueAutomation
                          : editAutomationSchedule === "walkins"
                            ? isOpenWednesdayWalkInAutomation
                            : editAutomationSchedule === "housecall"
                              ? isOpenWednesdayHousecallAutomation
                              : false
                    }
                    onChange={() => {
                      switch (editAutomationSchedule) {
                        case "clinic":
                          setIsOpenClinicWednesday(
                            !isOpenWednesdayClinicAutomation,
                          );
                          break;
                        case "housecall":
                          setIsOpenHousecallWednesday(
                            !isOpenWednesdayHousecallAutomation,
                          );
                          break;
                        case "boutique":
                          setIsOpenBoutiqueWednesday(
                            !isOpenWednesdayBoutiqueAutomation,
                          );
                          break;
                        case "walkins":
                          setIsOpenWalkInWednesday(
                            !isOpenWednesdayWalkInAutomation,
                          );
                          break;
                        default:
                          break;
                      }
                      setDidEditField(true);
                    }}
                    className={classNames(
                      editAutomationSchedule === "clinic"
                        ? isOpenWednesdayClinicAutomation
                          ? "bg-movet-green"
                          : "bg-movet-red"
                        : editAutomationSchedule === "boutique"
                          ? isOpenWednesdayBoutiqueAutomation
                            ? "bg-movet-green"
                            : "bg-movet-red"
                          : editAutomationSchedule === "walkins"
                            ? isOpenWednesdayWalkInAutomation
                              ? "bg-movet-green"
                              : "bg-movet-red"
                            : editAutomationSchedule === "housecall"
                              ? isOpenWednesdayHousecallAutomation
                                ? "bg-movet-green"
                                : "bg-movet-red"
                              : "",
                      "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        editAutomationSchedule === "clinic"
                          ? isOpenWednesdayClinicAutomation
                            ? "translate-x-5"
                            : "translate-x-0"
                          : editAutomationSchedule === "boutique"
                            ? isOpenWednesdayBoutiqueAutomation
                              ? "translate-x-5"
                              : "translate-x-0"
                            : editAutomationSchedule === "walkins"
                              ? isOpenWednesdayWalkInAutomation
                                ? "translate-x-5"
                                : "translate-x-0"
                              : editAutomationSchedule === "housecall"
                                ? isOpenWednesdayHousecallAutomation
                                  ? "translate-x-5"
                                  : "translate-x-0"
                                : "",
                        "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                      )}
                    />
                  </Switch>
                </div>
                <div className="flex justify-center items-center my-1">
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">Start Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"start-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicStartTimeWednesday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueStartTimeWednesday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInStartTimeWednesday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallStartTimeWednesday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicStartTimeWednesday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallStartTimeWednesday(
                              target.value,
                            );
                            break;
                          case "boutique":
                            setSelectedBoutiqueStartTimeWednesday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInStartTimeWednesday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">End Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"end-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicEndTimeWednesday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueEndTimeWednesday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInEndTimeWednesday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallEndTimeWednesday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicEndTimeWednesday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallEndTimeWednesday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueEndTimeWednesday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInEndTimeWednesday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center my-1">
                <div className="flex flex-col justify-center items-center mx-4">
                  <p className="text-center my-2">THURSDAY</p>
                  <Switch
                    checked={
                      editAutomationSchedule === "clinic"
                        ? isOpenThursdayClinicAutomation
                        : editAutomationSchedule === "boutique"
                          ? isOpenThursdayBoutiqueAutomation
                          : editAutomationSchedule === "walkins"
                            ? isOpenThursdayWalkInAutomation
                            : editAutomationSchedule === "housecall"
                              ? isOpenThursdayHousecallAutomation
                              : false
                    }
                    onChange={() => {
                      switch (editAutomationSchedule) {
                        case "clinic":
                          setIsOpenClinicThursday(
                            !isOpenThursdayClinicAutomation,
                          );
                          break;
                        case "housecall":
                          setIsOpenHousecallThursday(
                            !isOpenThursdayHousecallAutomation,
                          );
                          break;
                        case "boutique":
                          setIsOpenBoutiqueThursday(
                            !isOpenThursdayBoutiqueAutomation,
                          );
                          break;
                        case "walkins":
                          setIsOpenWalkInThursday(
                            !isOpenThursdayWalkInAutomation,
                          );
                          break;
                        default:
                          break;
                      }
                      setDidEditField(true);
                    }}
                    className={classNames(
                      editAutomationSchedule === "clinic"
                        ? isOpenThursdayClinicAutomation
                          ? "bg-movet-green"
                          : "bg-movet-red"
                        : editAutomationSchedule === "boutique"
                          ? isOpenThursdayBoutiqueAutomation
                            ? "bg-movet-green"
                            : "bg-movet-red"
                          : editAutomationSchedule === "walkins"
                            ? isOpenThursdayWalkInAutomation
                              ? "bg-movet-green"
                              : "bg-movet-red"
                            : editAutomationSchedule === "housecall"
                              ? isOpenThursdayHousecallAutomation
                                ? "bg-movet-green"
                                : "bg-movet-red"
                              : "",
                      "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        editAutomationSchedule === "clinic"
                          ? isOpenThursdayClinicAutomation
                            ? "translate-x-5"
                            : "translate-x-0"
                          : editAutomationSchedule === "boutique"
                            ? isOpenThursdayBoutiqueAutomation
                              ? "translate-x-5"
                              : "translate-x-0"
                            : editAutomationSchedule === "walkins"
                              ? isOpenThursdayWalkInAutomation
                                ? "translate-x-5"
                                : "translate-x-0"
                              : editAutomationSchedule === "housecall"
                                ? isOpenThursdayHousecallAutomation
                                  ? "translate-x-5"
                                  : "translate-x-0"
                                : "",
                        "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                      )}
                    />
                  </Switch>
                </div>
                <div className="flex justify-center items-center my-1">
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">Start Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"start-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicStartTimeThursday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueStartTimeThursday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInStartTimeThursday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallStartTimeThursday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicStartTimeThursday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallStartTimeThursday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueStartTimeThursday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInStartTimeThursday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">End Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"end-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicEndTimeThursday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueEndTimeThursday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInEndTimeThursday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallEndTimeThursday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicEndTimeThursday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallEndTimeThursday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueEndTimeThursday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInEndTimeThursday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center my-1">
                <div className="flex flex-col justify-center items-center mx-4">
                  <p className="text-center my-2">FRIDAY</p>
                  <Switch
                    checked={
                      editAutomationSchedule === "clinic"
                        ? isOpenFridayClinicAutomation
                        : editAutomationSchedule === "boutique"
                          ? isOpenFridayBoutiqueAutomation
                          : editAutomationSchedule === "walkins"
                            ? isOpenFridayWalkInAutomation
                            : editAutomationSchedule === "housecall"
                              ? isOpenFridayHousecallAutomation
                              : false
                    }
                    onChange={() => {
                      switch (editAutomationSchedule) {
                        case "clinic":
                          setIsOpenClinicFriday(!isOpenFridayClinicAutomation);
                          break;
                        case "housecall":
                          setIsOpenHousecallFriday(
                            !isOpenFridayHousecallAutomation,
                          );
                          break;
                        case "boutique":
                          setIsOpenBoutiqueFriday(
                            !isOpenFridayBoutiqueAutomation,
                          );
                          break;
                        case "walkins":
                          setIsOpenWalkInFriday(!isOpenFridayWalkInAutomation);
                          break;
                        default:
                          break;
                      }
                      setDidEditField(true);
                    }}
                    className={classNames(
                      editAutomationSchedule === "clinic"
                        ? isOpenFridayClinicAutomation
                          ? "bg-movet-green"
                          : "bg-movet-red"
                        : editAutomationSchedule === "boutique"
                          ? isOpenFridayBoutiqueAutomation
                            ? "bg-movet-green"
                            : "bg-movet-red"
                          : editAutomationSchedule === "walkins"
                            ? isOpenFridayWalkInAutomation
                              ? "bg-movet-green"
                              : "bg-movet-red"
                            : editAutomationSchedule === "housecall"
                              ? isOpenFridayHousecallAutomation
                                ? "bg-movet-green"
                                : "bg-movet-red"
                              : "",
                      "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        editAutomationSchedule === "clinic"
                          ? isOpenFridayClinicAutomation
                            ? "translate-x-5"
                            : "translate-x-0"
                          : editAutomationSchedule === "boutique"
                            ? isOpenFridayBoutiqueAutomation
                              ? "translate-x-5"
                              : "translate-x-0"
                            : editAutomationSchedule === "walkins"
                              ? isOpenFridayWalkInAutomation
                                ? "translate-x-5"
                                : "translate-x-0"
                              : editAutomationSchedule === "housecall"
                                ? isOpenFridayHousecallAutomation
                                  ? "translate-x-5"
                                  : "translate-x-0"
                                : "",
                        "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                      )}
                    />
                  </Switch>
                </div>
                <div className="flex justify-center items-center my-1">
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">Start Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"start-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicStartTimeFriday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueStartTimeFriday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInStartTimeFriday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallStartTimeFriday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicStartTimeFriday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallStartTimeFriday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueStartTimeFriday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInStartTimeFriday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">End Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"end-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicEndTimeFriday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueEndTimeFriday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInEndTimeFriday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallEndTimeFriday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicEndTimeFriday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallEndTimeFriday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueEndTimeFriday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInEndTimeFriday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center my-1">
                <div className="flex flex-col justify-center items-center mx-4">
                  <p className="text-center my-2">SATURDAY</p>
                  <Switch
                    checked={
                      editAutomationSchedule === "clinic"
                        ? isOpenSaturdayClinicAutomation
                        : editAutomationSchedule === "boutique"
                          ? isOpenSaturdayBoutiqueAutomation
                          : editAutomationSchedule === "walkins"
                            ? isOpenSaturdayWalkInAutomation
                            : editAutomationSchedule === "housecall"
                              ? isOpenSaturdayHousecallAutomation
                              : false
                    }
                    onChange={() => {
                      switch (editAutomationSchedule) {
                        case "clinic":
                          setIsOpenClinicSaturday(
                            !isOpenSaturdayClinicAutomation,
                          );
                          break;
                        case "housecall":
                          setIsOpenHousecallSaturday(
                            !isOpenSaturdayHousecallAutomation,
                          );
                          break;
                        case "boutique":
                          setIsOpenBoutiqueSaturday(
                            !isOpenSaturdayBoutiqueAutomation,
                          );
                          break;
                        case "walkins":
                          setIsOpenWalkInSaturday(
                            !isOpenSaturdayWalkInAutomation,
                          );
                          break;
                        default:
                          break;
                      }
                      setDidEditField(true);
                    }}
                    className={classNames(
                      editAutomationSchedule === "clinic"
                        ? isOpenSaturdayClinicAutomation
                          ? "bg-movet-green"
                          : "bg-movet-red"
                        : editAutomationSchedule === "boutique"
                          ? isOpenSaturdayBoutiqueAutomation
                            ? "bg-movet-green"
                            : "bg-movet-red"
                          : editAutomationSchedule === "walkins"
                            ? isOpenSaturdayWalkInAutomation
                              ? "bg-movet-green"
                              : "bg-movet-red"
                            : editAutomationSchedule === "housecall"
                              ? isOpenSaturdayHousecallAutomation
                                ? "bg-movet-green"
                                : "bg-movet-red"
                              : "",
                      "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        editAutomationSchedule === "clinic"
                          ? isOpenSaturdayClinicAutomation
                            ? "translate-x-5"
                            : "translate-x-0"
                          : editAutomationSchedule === "boutique"
                            ? isOpenSaturdayBoutiqueAutomation
                              ? "translate-x-5"
                              : "translate-x-0"
                            : editAutomationSchedule === "walkins"
                              ? isOpenSaturdayWalkInAutomation
                                ? "translate-x-5"
                                : "translate-x-0"
                              : editAutomationSchedule === "housecall"
                                ? isOpenSaturdayHousecallAutomation
                                  ? "translate-x-5"
                                  : "translate-x-0"
                                : "",
                        "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                      )}
                    />
                  </Switch>
                </div>
                <div className="flex justify-center items-center my-1">
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">Start Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"start-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicStartTimeSaturday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueStartTimeSaturday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInStartTimeSaturday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallStartTimeSaturday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicStartTimeSaturday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallStartTimeSaturday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueStartTimeSaturday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInStartTimeSaturday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">End Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"end-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicEndTimeSaturday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueEndTimeSaturday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInEndTimeSaturday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallEndTimeSaturday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicEndTimeSaturday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallEndTimeSaturday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueEndTimeSaturday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInEndTimeSaturday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center my-1">
                <div className="flex flex-col justify-center items-center mx-4">
                  <p className="text-center my-2">SUNDAY</p>
                  <Switch
                    checked={
                      editAutomationSchedule === "clinic"
                        ? isOpenSundayClinicAutomation
                        : editAutomationSchedule === "boutique"
                          ? isOpenSundayBoutiqueAutomation
                          : editAutomationSchedule === "walkins"
                            ? isOpenSundayWalkInAutomation
                            : editAutomationSchedule === "housecall"
                              ? isOpenSundayHousecallAutomation
                              : false
                    }
                    onChange={() => {
                      switch (editAutomationSchedule) {
                        case "clinic":
                          setIsOpenClinicSunday(!isOpenSundayClinicAutomation);
                          break;
                        case "housecall":
                          setIsOpenHousecallSunday(
                            !isOpenSundayHousecallAutomation,
                          );
                          break;
                        case "boutique":
                          setIsOpenBoutiqueSunday(
                            !isOpenSundayBoutiqueAutomation,
                          );
                          break;
                        case "walkins":
                          setIsOpenWalkInSunday(!isOpenSundayWalkInAutomation);
                          break;
                        default:
                          break;
                      }
                      setDidEditField(true);
                    }}
                    className={classNames(
                      editAutomationSchedule === "clinic"
                        ? isOpenSundayClinicAutomation
                          ? "bg-movet-green"
                          : "bg-movet-red"
                        : editAutomationSchedule === "boutique"
                          ? isOpenSundayBoutiqueAutomation
                            ? "bg-movet-green"
                            : "bg-movet-red"
                          : editAutomationSchedule === "walkins"
                            ? isOpenSundayWalkInAutomation
                              ? "bg-movet-green"
                              : "bg-movet-red"
                            : editAutomationSchedule === "housecall"
                              ? isOpenSundayHousecallAutomation
                                ? "bg-movet-green"
                                : "bg-movet-red"
                              : "",
                      "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        editAutomationSchedule === "clinic"
                          ? isOpenSundayClinicAutomation
                            ? "translate-x-5"
                            : "translate-x-0"
                          : editAutomationSchedule === "boutique"
                            ? isOpenSundayBoutiqueAutomation
                              ? "translate-x-5"
                              : "translate-x-0"
                            : editAutomationSchedule === "walkins"
                              ? isOpenSundayWalkInAutomation
                                ? "translate-x-5"
                                : "translate-x-0"
                              : editAutomationSchedule === "housecall"
                                ? isOpenSundayHousecallAutomation
                                  ? "translate-x-5"
                                  : "translate-x-0"
                                : "",
                        "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                      )}
                    />
                  </Switch>
                </div>
                <div className="flex justify-center items-center my-1">
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">Start Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"start-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicStartTimeSunday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueStartTimeSunday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInStartTimeSunday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallStartTimeSunday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicStartTimeSunday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallStartTimeSunday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueStartTimeSunday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInStartTimeSunday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                  <div className="flex-col justify-center items-center mx-4">
                    <p className="text-center my-2">End Time</p>
                    <PatternFormat
                      isAllowed={(values: any) => {
                        const { value } = values;
                        return value <= 2400;
                      }}
                      format={"##:##"}
                      mask="_"
                      patternChar="#"
                      name={"end-time"}
                      type="text"
                      valueIsNumericString
                      value={
                        editAutomationSchedule === "clinic"
                          ? selectedClinicEndTimeSunday
                          : editAutomationSchedule === "boutique"
                            ? selectedBoutiqueEndTimeSunday
                            : editAutomationSchedule === "walkins"
                              ? selectedWalkInEndTimeSunday
                              : editAutomationSchedule === "housecall"
                                ? selectedHousecallEndTimeSunday
                                : null
                      }
                      onBlur={() => setDidEditField(true)}
                      onValueChange={(target: any) => {
                        switch (editAutomationSchedule) {
                          case "clinic":
                            setSelectedClinicEndTimeSunday(target.value);
                            break;
                          case "housecall":
                            setSelectedHousecallEndTimeSunday(target.value);
                            break;
                          case "boutique":
                            setSelectedBoutiqueEndTimeSunday(target.value);
                            break;
                          case "walkins":
                            setSelectedWalkInEndTimeSunday(target.value);
                            break;
                          default:
                            break;
                        }
                      }}
                      className={
                        "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                      }
                    />
                    <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </>
      )}
      <Transition
        show={
          didTouchBoutiqueAutomationStatus ||
          didTouchClinicAutomationStatus ||
          didTouchWalkInsAutomationStatus ||
          didTouchHousecallAutomationStatus ||
          didEditField
        }
        enter="transition ease-in duration-500"
        leave="transition ease-out duration-64"
        leaveTo="opacity-10"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leaveFrom="opacity-100"
      >
        <Button
          text="SAVE"
          color="red"
          icon={faCheck}
          onClick={() => saveBookingConfigChanges()}
          className="mt-8"
        />
      </Transition>
    </div>
  );
};
