import { Error } from "components/Error";
import { Loader } from "ui";
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { ChooseDateTime } from "forms/booking/ChooseDateTime";
import { ChooseLocation } from "forms/booking/ChooseLocation";
import { ChooseService } from "forms/booking/ChooseService";
import { ChooseStaff } from "forms/booking/ChooseStaff";
import { ClientInfo } from "forms/booking/ClientInfo";
import { IllnessAssignment } from "forms/booking/IllnessAssignment";
import { SelectAPet } from "forms/booking/SelectAPet";
import { WellnessCheck } from "forms/booking/WellnessCheck";
import { useEffect, useState } from "react";
import { firestore } from "services/firebase";
import { Booking } from "types/Booking";
import { environment } from "utilities";
import { PaymentConfirmation } from "forms/booking/PaymentConfirmation";
import Image from "next/image";

export const BookingController = ({
  id,
  isAppMode,
}: {
  id: string;
  isAppMode: boolean;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Booking | null>(null);
  const [step, setStep] = useState<Booking["step"] | null>(null);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    if (id !== undefined && id !== null) {
      const docRef = doc(firestore, "bookings", id);
      const getBookingStep = async () => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          if (environment === "development")
            console.log("Document STEP:", docSnap.data()?.step);
          setStep(docSnap.data()?.step || "started");
        } else setError("Data Not Found...");
      };
      getBookingStep();
      const unsubscribe = onSnapshot(
        docRef,
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
  useEffect(() => {
    if (session?.step === "choose-location" && session?.nextPatient === null)
      setStep("choose-location");
    if (session?.step === "choose-staff") setStep("choose-staff");
    if (session?.step === "choose-datetime") setStep("choose-datetime");
    if (session?.step === "checkout" && session?.checkout?.url && !isAppMode)
      window.location.href = session?.checkout?.url;
    if (session?.step === "payment-confirmation")
      setStep("payment-confirmation");
    if (session?.step === "needs-scheduling")
      window.location.href =
        window.location.origin + "/request-an-appointment/success?id=" + id;
  }, [session, isAppMode, id]);
  if (isLoading) return <Loader />;
  else if (error) return <Error error={error} />;
  else if (session !== null)
    switch (step) {
      case "started":
        if (session.client.displayName && session.client.phoneNumber)
          return (
            <SelectAPet
              session={session}
              setStep={setStep}
              isAppMode={isAppMode}
            />
          );
        else
          return (
            <ClientInfo
              session={session}
              setStep={setStep}
              isAppMode={isAppMode}
            />
          );
      case "contact-info":
        return (
          <ClientInfo
            session={session}
            setStep={setStep}
            isAppMode={isAppMode}
          />
        );
      case "patient-selection":
        return (
          <SelectAPet
            session={session}
            setStep={setStep}
            isAppMode={isAppMode}
          />
        );
      case "wellness-check":
        return (
          <WellnessCheck
            session={session}
            setStep={setStep}
            isAppMode={isAppMode}
          />
        );
      case "illness-assignment":
        return (
          <IllnessAssignment
            session={session}
            setStep={setStep}
            isAppMode={isAppMode}
          />
        );
      case "choose-location":
        return (
          <ChooseLocation
            session={session}
            setStep={setStep}
            isAppMode={isAppMode}
          />
        );
      case "choose-reason":
        return (
          <ChooseService
            session={session}
            setStep={setStep}
            isAppMode={isAppMode}
          />
        );
      case "choose-staff":
        return (
          <ChooseStaff
            session={session}
            setStep={setStep}
            isAppMode={isAppMode}
          />
        );
      case "choose-datetime":
        return <ChooseDateTime session={session} isAppMode={isAppMode} />;
      case "payment-confirmation":
        return (
          <PaymentConfirmation
            session={session}
            setStep={setStep}
            isAppMode={isAppMode}
          />
        );
      case "complete":
        return <Loader message="Confirming Booking Request..." />;
      case "needs-scheduling":
        return <Loader message="Almost Finished..." />;
      case "checkout":
        return (
          <>
            <Loader message="Loading Payment Information..." />
            <Image
              src="/images/icons/powered-by-stripe.svg"
              alt="Powered by Stripe"
              height={40}
              width={120}
              className="-mt-4 mx-auto"
            />
          </>
        );
      case "add-pet":
        return <Loader message="Saving Pet..." />;
      case "restart":
        return <Loader message="Starting New Booking..." />;
      default:
        return <Error error={{ ERROR: "MISSING STEP" }} mode={isAppMode} />;
    }
  else return <Error error={{ ERROR: "MISSING ID" }} mode={isAppMode} />;
};
