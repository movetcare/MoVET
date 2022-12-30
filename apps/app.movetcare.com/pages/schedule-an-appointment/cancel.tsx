/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppLinks, Button, Loader } from "ui";
import { Error } from "components/Error";
import { BookingHeader } from "components/booking/BookingHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faPaw } from "@fortawesome/free-solid-svg-icons";
import { ServerResponse } from "types";
import { AppHeader } from "components/AppHeader";
import { SearchInput } from "components/inputs/SearchInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string, lazy } from "yup";
import { TextInput } from "ui/src/components/forms/inputs";
export default function CancelAppointmentBookingRequest() {
  const router = useRouter();
  const { id, mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(
    null
  );

  const [reasonSubmissionSuccess, setReasonSubmissionSuccess] = useState<
    boolean | null
  >(null);
  const {
    control,
    handleSubmit,
    watch,
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
      details: "",
    },
  });
  const reason: any = watch("reason");
  const processAppointmentBookingCancellationReason = async () =>
    (
      await fetch("/api/schedule-an-appointment", {
        method: "POST",
        body: JSON.stringify({ id, cancelReason: reason?.value }),
      })
    ).json();
  useEffect(() => {
    if (reason?.value) {
      processAppointmentBookingCancellationReason();
    }
  }, [reason]);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    if (id) {
      const processAppointmentBookingCancellation = async () =>
        (
          await fetch("/api/schedule-an-appointment", {
            method: "POST",
            body: JSON.stringify({ id, step: "cancelled-client" }),
          })
        ).json();
      processAppointmentBookingCancellation()
        .then((response: ServerResponse) => {
          if (response.error) {
            setError(response.error);
          } else setSubmissionSuccess(true);
        })
        .catch((error) => handleError(error))
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const processAppointmentBookingCancellationDetails = async () =>
      (
        await fetch("/api/schedule-an-appointment", {
          method: "POST",
          body: JSON.stringify({
            id,
            cancelReason: data?.reason?.value || "None Provided",
            cancelDetails: data?.details || "None Provided",
          }),
        })
      ).json();
    processAppointmentBookingCancellationDetails()
      .then((response: ServerResponse) => {
        if (response.error) {
          setError(response.error);
        } else setReasonSubmissionSuccess(true);
      })
      .catch((error) => handleError(error))
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    setSubmissionSuccess(false);
    setReasonSubmissionSuccess(false);
    setIsLoading(false);
  };
  return (
    <section className="w-full flex-1">
      <AppHeader />
      <div
        className={`flex items-center justify-center bg-white rounded-xl max-w-lg mx-auto mb-4`}
      >
        <div className={isAppMode ? "px-4 mb-8" : "p-4"}>
          <section className="relative mx-auto">
            {isLoading || submissionSuccess === null ? (
              <Loader message="Loading Confirmation..." />
            ) : error ? (
              <Error error={error} isAppMode={isAppMode} />
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faBan}
                  size="4x"
                  className="text-movet-red mx-auto w-full mb-4 mt-4"
                />
                <BookingHeader
                  isAppMode={isAppMode}
                  title="Booking Request Cancelled"
                  description={
                    "Your appointment booking request has been cancelled."
                  }
                />
                {reasonSubmissionSuccess ? (
                  <>
                    <h2 className="text-center mb-0 mt-2">
                      Thank you for your feedback!
                    </h2>
                  </>
                ) : (
                  <>
                    <h2 className="text-center mb-4 text-base mt-2">
                      Mind telling us why you cancelled?
                    </h2>
                    <form className="px-4 sm:px-8">
                      <SearchInput
                        label=""
                        options={[
                          {
                            label: "Appointment is No Longer Needed",
                            value: "not-needed",
                          },
                          {
                            label: "Technical Issue / Bug",
                            value: "bug-report",
                          },

                          {
                            label: "Other",
                            value: "other",
                          },
                        ]}
                        control={control}
                        errors={errors}
                        name="reason"
                        placeholder="Select an Option"
                        required
                      />
                      {reason?.value === undefined ||
                        (reason?.value !== "not-needed" && (
                          <TextInput
                            label=""
                            className={"mt-8"}
                            control={control}
                            errors={errors}
                            required
                            name="details"
                            multiline
                            numberOfLines={3}
                            placeholder="Please provide as much detail as possible"
                          />
                        ))}
                      {isDirty && (
                        <Button
                          disabled={!isDirty || !isValid}
                          type="submit"
                          icon={faPaw}
                          iconSize={"sm"}
                          color="red"
                          text="SUBMIT"
                          className={"w-full mx-auto mt-8"}
                          onClick={handleSubmit(onSubmit)}
                        />
                      )}
                    </form>
                  </>
                )}
                {!reasonSubmissionSuccess && (
                  <h2 className="text-center text-base">OR</h2>
                )}
                <Button
                  text="Start New Booking"
                  icon={faPaw}
                  color="black"
                  onClick={() => router.replace("/schedule-an-appointment")}
                  className="mt-4"
                />
              </>
            )}
          </section>
          {!isAppMode && !isLoading && (
            <section>
              <hr className="border-movet-gray w-full sm:w-2/3 mx-auto mt-8" />
              <h2 className="text-center mb-0">Download The App!</h2>
              <div className="flex flex-row justify-center w-full mx-auto mt-4">
                <AppLinks />
              </div>
              <p className="text-center mb-4 italic text-sm w-full sm:w-2/3 mx-auto">
                Download our our mobile app to manage your pets, manage your
                appointments, chat with us, and more!
              </p>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
