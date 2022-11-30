import { BookingFooter } from "components/booking/BookingFooter";
import { BookingHeader } from "components/booking/BookingHeader";
import { Loader } from "ui";
import { useEffect, useState } from "react";
import { Booking } from "types/Booking";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { lazy, object, string } from "yup";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "services/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Error } from "components/Error";
import { SearchInput } from "components/inputs/SearchInput";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Button } from "ui";

export const ChooseService = ({
  session,
  setStep,
  isAppMode,
}: {
  session: Booking;
  setStep: any;
  isAppMode: boolean;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [reasons, setReasons] = useState<any>(false);
  const [reasonsData, loadingReasons, errorReasons] = useCollection(
    collection(firestore, "reasons")
  );
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
    resolver: yupResolver(
      object().shape({
        reason: lazy((value: any) =>
          typeof value === "object" && !Array.isArray(value) && value !== null
            ? object().shape({
                label: string().trim().min(1, "A selection is required"),
                value: string().trim().min(1, "A selection is required"),
              })
            : string()
                .matches(/.*\d/, "A selection selection is required")
                .required("A selection selection is required")
        ),
      })
    ),
    defaultValues: {
      reason: "",
    },
  });

  useEffect(() => {
    if (session.locationId && reasonsData) {
      const reasons: any = [];
      reasonsData.docs.map((doc: any) =>
        doc.data()?.isVisible && doc?.data()?.group === session.locationId
          ? reasons.push({
              label: doc.data()?.name,
              value: doc.data()?.id,
            })
          : null
      );
      setReasons(reasons);
    }
  }, [reasonsData, setValue, session]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await setDoc(
      doc(firestore, "bookings", `${session.id}`),
      {
        ...data,
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    ).catch((error: any) => {
      setIsLoading(false);
      setError(error);
    });
  };

  return (
    <>
      {isLoading || loadingReasons ? (
        <Loader
          message={
            isLoading ? "Saving Service Selection..." : "Loading Services..."
          }
        />
      ) : error || errorReasons ? (
        <Error error={error || errorReasons} isAppMode={isAppMode} />
      ) : (
        <>
          <BookingHeader
            isAppMode={isAppMode}
            title={"Choose a Service"}
            description={"What kind of service are you needing?"}
          />
          <div className="mt-8 px-1">
            <form className="grid grid-cols-1 gap-y-8 text-left mt-8 z-50 relative mb-8 overflow-visible">
              <SearchInput
                label="Service"
                options={reasons || []}
                control={control}
                errors={errors}
                name="reason"
                placeholder="Select a Service Type"
                required
              />
              <Button
                disabled={!isDirty || !isValid}
                type="submit"
                icon={faArrowRight}
                iconSize={"sm"}
                color="black"
                text="Continue"
                className={"w-full mx-auto mt-12"}
                onClick={handleSubmit(onSubmit)}
              />
            </form>
          </div>
          <BookingFooter session={session} />
        </>
      )}
    </>
  );
};
