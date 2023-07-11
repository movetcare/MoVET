import { faCalendarDay, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Hours, Loader } from "ui";
import Error from "components/Error";
import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "services/firebase";
import Link from "next/link";

export const HoursStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [winterMode, setWinterMode] = useState<any>(null);
  const [hours, setHours] = useState<any>(null);
  const [boutiqueStatus, setBoutiqueStatus] = useState<boolean>(false);
  const [clinicStatus, setClinicStatus] = useState<boolean>(false);
  const [housecallStatus, setHousecallStatus] = useState<boolean>(false);
  const [walkinsStatus, setWalkinsStatus] = useState<boolean>(false);
  const [boutiqueStatusOverride, setBoutiqueStatusOverride] =
    useState<boolean>(false);
  const [clinicStatusOverride, setClinicStatusOverride] =
    useState<boolean>(false);
  const [housecallStatusOverride, setHousecallStatusOverride] =
    useState<boolean>(false);
  const [walkinsStatusOverride, setWalkinsStatusOverride] =
    useState<boolean>(false);
  const [clinicAutomationStatus, setClinicAutomationStatus] =
    useState<boolean>(false);
  const [housecallAutomationStatus, setHousecallAutomationStatus] =
    useState<boolean>(false);
  const [boutiqueAutomationStatus, setBoutiqueAutomationStatus] =
    useState<boolean>(false);
  const [walkinsAutomationStatus, setWalkinsAutomationStatus] =
    useState<boolean>(false);
  useEffect(() => {
    const unsubscribeWinterModeConfiguration = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => {
        setWinterMode(doc.data()?.winterMode || null);
        setIsLoading(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoading(false);
      },
    );
    const unsubscribeHoursConfiguration = onSnapshot(
      doc(firestore, "configuration", "openings"),
      (doc: any) => {
        setHours(doc.data()?.openingDates || null);
        setIsLoading(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoading(false);
      },
    );
    const unsubscribeHoursStatusConfiguration = onSnapshot(
      doc(firestore, "configuration", "hours_status"),
      (doc: any) => {
        setBoutiqueStatus(doc.data()?.boutiqueStatus || false);
        setClinicStatus(doc.data()?.clinicStatus || false);
        setHousecallStatus(doc.data()?.housecallStatus || false);
        setWalkinsStatus(doc.data()?.walkinsStatus || false);
        setIsLoading(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoading(false);
      },
    );
    const unsubscribeBookingConfiguration = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => {
        setBoutiqueStatusOverride(doc.data()?.boutiqueStatus || false);
        setClinicStatusOverride(doc.data()?.clinicStatus || false);
        setHousecallStatusOverride(doc.data()?.housecallStatus || false);
        setWalkinsStatusOverride(doc.data()?.walkinsStatus || false);
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

        setIsLoading(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoading(false);
      },
    );
    return () => {
      unsubscribeHoursStatusConfiguration();
      unsubscribeBookingConfiguration();
      unsubscribeHoursConfiguration();
      unsubscribeWinterModeConfiguration();
    };
  }, []);
  return (
    <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
      <div className="flex flex-row items-center justify-center -mb-4">
        <FontAwesomeIcon
          icon={faCalendarDay}
          className="text-movet-green"
          size="lg"
        />
        <h1 className="ml-2 my-4 text-lg">Hours Status</h1>
      </div>
      {isLoading ? (
        <div className="mb-6">
          <Loader height={200} width={200} />
        </div>
      ) : error ? (
        <div className="px-8 pb-8">
          <Error error={error} />
        </div>
      ) : (
        <ul
          role="list"
          className="divide-y divide-movet-gray border-t border-movet-gray mt-4"
        >
          <li>
            <div className="-mb-16">
              <Hours
                winterMode={winterMode}
                hours={hours}
                hoursStatus={{
                  boutiqueStatus,
                  clinicStatus,
                  housecallStatus,
                  walkinsStatus,
                }}
                previewMode
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-y-12 gap-x-8 p-8 rounded-xl bg-white mb-16 max-w-3xl mx-auto">
              <Link href="/settings/booking/manage-hours/">
                <>
                  <h2
                    className={`text-center mt-6${
                      clinicAutomationStatus ||
                      housecallAutomationStatus ||
                      boutiqueAutomationStatus ||
                      walkinsAutomationStatus
                        ? " text-movet-yellow"
                        : ""
                    }`}
                  >
                    {clinicAutomationStatus ||
                    housecallAutomationStatus ||
                    boutiqueAutomationStatus ||
                    walkinsAutomationStatus
                      ? "Active Automations"
                      : "No Automations Active"}
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="ml-2 text-movet-black"
                      size="sm"
                    />
                  </h2>
                  <ul className="italic text-extrabold text-center text-movet-yellow">
                    {boutiqueAutomationStatus && <li>Boutique</li>}
                    {clinicAutomationStatus && <li>Clinic</li>}
                    {walkinsAutomationStatus && <li>Clinic Walk-In</li>}
                    {housecallAutomationStatus && <li>Housecall</li>}
                  </ul>
                </>
              </Link>
              <Link href="/settings/booking/manage-hours/">
                <>
                  <h2
                    className={`text-center mt-6${
                      boutiqueStatusOverride ||
                      clinicStatusOverride ||
                      walkinsAutomationStatus ||
                      housecallStatusOverride
                        ? " text-movet-yellow"
                        : ""
                    }`}
                  >
                    {boutiqueStatusOverride ||
                    clinicStatusOverride ||
                    walkinsAutomationStatus ||
                    housecallStatusOverride
                      ? "Active Hours Overrides:"
                      : "No Overrides Active"}
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="ml-2 text-movet-black"
                      size="sm"
                    />
                  </h2>
                  <ul className="italic text-extrabold text-center text-movet-yellow">
                    {boutiqueStatusOverride && <li>Boutique</li>}
                    {clinicStatusOverride && <li>Clinic</li>}
                    {walkinsStatusOverride && <li>Clinic Walk-In</li>}
                    {housecallStatusOverride && <li>Housecall</li>}
                  </ul>
                </>
              </Link>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};
