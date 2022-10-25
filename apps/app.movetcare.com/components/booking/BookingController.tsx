import { Error } from "components/Error";
import { Loader } from "ui";
import { onSnapshot, doc } from "firebase/firestore";
import { ChooseDateTime } from "forms/booking/ChooseDateTime";
import { ChooseLocation } from "forms/booking/ChooseLocation";
import { ChooseService } from "forms/booking/ChooseService";
import { ChooseStaff } from "forms/booking/ChooseStaff";
import { ClientInfo } from "forms/booking/ClientInfo";
import { Confirmation } from "forms/booking/Confirmation";
import { IllnessAssignment } from "forms/booking/IllnessAssignment";
import { SelectAPet } from "forms/booking/SelectAPet";
import { WellnessCheck } from "forms/booking/WellnessCheck";
import { useEffect, useState } from "react";
import { firestore } from "services/firebase";
import { Booking } from "types/Booking";
import { environment } from "utilities";

export const BookingController = ({
  id,
  isAppMode,
}: {
  id: string;
  isAppMode: boolean;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Booking | null>(null);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    if (id !== undefined && id !== null) {
      const unsubscribe = onSnapshot(
        doc(firestore, "bookings", id),
        (doc: any) => {
          if (environment === "development")
            console.log("Booking Session Data", doc.data());
          setSession({ ...doc.data(), id });
          setIsLoading(false);
        },
        (error: any) => setError(error)
      );
      return () => unsubscribe();
    } else return;
  }, [id]);
  if (isLoading) return <Loader />;
  else if (error) return <Error error={error} />;
  else if (session !== null)
    switch (session.step) {
      case "started":
        if (session.client.displayName && session.client.phoneNumber)
          return <SelectAPet session={session} isAppMode={isAppMode} />;
        else return <ClientInfo session={session} isAppMode={isAppMode} />;
      case "contact-info":
        return <ClientInfo session={session} isAppMode={isAppMode} />;
      case "patient-selection":
        return <SelectAPet session={session} isAppMode={isAppMode} />;
      case "wellness-check":
        return <WellnessCheck session={session} isAppMode={isAppMode} />;
      case "illness-assignment":
        return <IllnessAssignment session={session} isAppMode={isAppMode} />;
      case "choose-location":
        return <ChooseLocation session={session} isAppMode={isAppMode} />;
      case "choose-reason":
        return <ChooseService session={session} isAppMode={isAppMode} />;
      case "choose-staff":
        return <ChooseStaff session={session} isAppMode={isAppMode} />;
      case "choose-datetime":
        return <ChooseDateTime session={session} isAppMode={isAppMode} />;
      case "confirmation":
        return <Confirmation session={session} isAppMode={isAppMode} />;
      case "add-pet":
        return <Loader />;
      case "restart":
        return <Loader />;
      default:
        return <Error error={{ ERROR: "MISSING STEP" }} mode={isAppMode} />;
    }
  else return <Error error={{ ERROR: "MISSING ID" }} mode={isAppMode} />;
};
