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
import { Transition } from "@headlessui/react";

export const ChooseService = ({
  session,
  isAppMode,
}: {
  session: Booking;
  isAppMode: boolean;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [reasons, setReasons] = useState<any>(false);
  const [reasonGroups, setReasonGroups] = useState<any>(false);
  const [reasonGroupsData, loadingReasonGroups, errorReasonGroups] =
    useCollection(collection(firestore, "reason_groups"));
  const [reasonsData, loadingReasons, errorReasons] = useCollection(
    collection(firestore, "reasons")
  );
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
    resolver: yupResolver(
      object().shape({
        reasonGroup: lazy((value: any) =>
          typeof value === "object" && !Array.isArray(value) && value !== null
            ? object().shape({
                label: string().trim().min(1, "A selection is required"),
                value: string().trim().min(1, "A selection is required"),
              })
            : string()
                .matches(/.*\d/, "A selection selection is required")
                .required("A selection selection is required")
        ),
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
      reasonGroup: "",
      reason: "",
    },
  });

  const reasonGroup: { label: string; value: number } = watch(
    "reasonGroup"
  ) as any;

  useEffect(() => {
    if (reasonGroupsData) {
      const reasonGroups: any = [];
      reasonGroupsData.docs.map((doc: any) =>
        doc.data()?.isVisible
          ? reasonGroups.push({
              label: doc.data()?.name,
              value: doc.data()?.id,
            })
          : null
      );
      setReasonGroups(reasonGroups);
    }
  }, [reasonGroupsData]);

  useEffect(() => {
    if (reasonGroup?.value && reasonsData) {
      setValue("reason", "");
      const reasons: any = [];
      reasonsData.docs.map((doc: any) =>
        doc.data()?.isVisible && doc?.data()?.group === reasonGroup?.value
          ? reasons.push({
              label: doc.data()?.name,
              value: doc.data()?.id,
            })
          : null
      );
      setReasons(reasons);
    }
  }, [reasonsData, reasonGroup, setValue]);

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
      {isLoading || loadingReasonGroups || loadingReasons ? (
        <Loader />
      ) : error || errorReasonGroups || errorReasons ? (
        <Error
          error={error || errorReasonGroups || errorReasons}
          isAppMode={isAppMode}
        />
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
                label="Reason Type"
                options={reasonGroups || []}
                control={control}
                errors={errors}
                name="reasonGroup"
                placeholder="Select a Reason Type"
                required
              />
              <Transition
                show={
                  reasonGroup !== undefined &&
                  reasons !== undefined &&
                  reasons.length > 0
                }
                enter="transition ease-in duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
              >
                <SearchInput
                  label="Service"
                  options={reasons || []}
                  control={control}
                  errors={errors}
                  name="reason"
                  placeholder="Select a Service"
                  required
                />
              </Transition>
              <Button
                disabled={!isDirty || !isValid}
                type="submit"
                icon={faArrowRight}
                iconSize={"sm"}
                color="black"
                text="Continue"
                className={"w-full mx-auto mt-4 sm:mt-0"}
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
