import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Hours, Loader } from "ui";
import Error from "components/Error";
import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "services/firebase";
import { useRouter } from "next/router";

export const HoursStatus = ({
  mode = "default",
}: {
  mode?: "admin" | "default";
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [winterMode, setWinterMode] = useState<any>(null);
  const [hours, setHours] = useState<any>(null);
  const [boutiqueStatus, setBoutiqueStatus] = useState<boolean>(false);
  const [clinicStatus, setClinicStatus] = useState<boolean>(false);
  const [housecallStatus, setHousecallStatus] = useState<boolean>(false);
  const [walkinsStatus, setWalkinsStatus] = useState<boolean>(false);
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
    return () => {
      unsubscribeHoursStatusConfiguration();
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
            <div
              className="-mb-10 cursor-pointer"
              onClick={() => {
                setIsLoading(true);
                router.push("/settings/manage-hours/");
              }}
            >
              <Hours
                winterMode={winterMode}
                hours={hours}
                mode={mode}
                hoursStatus={{
                  boutiqueStatus,
                  clinicStatus,
                  housecallStatus,
                  walkinsStatus,
                }}
                previewMode
              />
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};
