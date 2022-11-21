import { faCheckCircle, faPaw } from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { contactSchema } from "schemas";
import { Button, EmergencyWarning, ErrorMessage } from "../../elements";
import { Loader } from "../../elements/Loader";
import { EmailInput, SelectInput, TextInput } from "../inputs";
import PhoneInput from "../inputs/PhoneInput";
import type { ContactForm as ContactFormType, ServerResponse } from "types";
import { CONTACT_REASONS } from "constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ContactForm = () => {
  const router = useRouter();
  const { mode, firstName, lastName, phone, email, appointmentRequest } =
    router.query;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(
    null
  );
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(contactSchema),
    defaultValues: {
      reason: CONTACT_REASONS[0],
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phone: phone || "",
      message: "",
    },
  });
  const reason = watch("reason");

  useEffect(() => {
    if (
      mode === "app" ||
      email ||
      firstName ||
      lastName ||
      phone ||
      appointmentRequest
    )
      reset({
        reason: appointmentRequest ? CONTACT_REASONS[1] : CONTACT_REASONS[0],
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        phone: phone || "",
        message: "",
      });
  }, [mode, firstName, lastName, phone, email, appointmentRequest, reset]);

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    const submitForm = async () =>
      (
        await fetch("/api/contact", {
          method: "POST",
          body: JSON.stringify(data as ContactFormType),
        })
      ).json();
    submitForm()
      .then((response: ServerResponse) => {
        if (response.error) {
          setErrorMessage(response.error);
          setSubmissionSuccess(false);
        } else setSubmissionSuccess(true);
      })
      .catch((error) => {
        setErrorMessage(error?.message || JSON.stringify(error));
        setSubmissionSuccess(false);
      })
      .finally(() => {
        reset();
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <Loader message="Processing submission, please wait..." />
      ) : (
        <>
          {submissionSuccess ? (
            <div className="text-center">
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="4x"
                className="text-movet-green mx-auto w-full mb-4"
              />
              <h2 className="text-3xl font-extrabold tracking-tight text-movet-black sm:text-4xl">
                Success!
              </h2>
              <p className="text-lg mt-4">
                We have received your message and we will get back to you as
                soon as we can.
              </p>
              <p className="text-lg">
                Please allow 1 business day for a response. All messages are
                responded to in the order they are received. You will hear from
                us. We promise. We are working hard to give everyone the same
                service we are known for and can&apos;t wait to give you the
                love and attention you deserve.
              </p>
              <p className="text-lg">
                Our customer service business hours are 9:00AM to 5:00PM (MST),
                Monday through Friday. We are not open on Saturdays and Sundays,
                so messages sent on the weekend may not be answered until at
                least Monday afternoon. We are also closed for Memorial Day,
                July 4th, Labor Day, Thanksgiving, and between Christmas and New
                Year&apos;s Day.
              </p>
              <EmergencyWarning />
            </div>
          ) : (
            <div className="text-center -mt-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-movet-black sm:text-4xl">
                {submissionSuccess === null
                  ? appointmentRequest
                    ? "Request an Appointment"
                    : "Contact Us"
                  : "Whoops!"}
              </h2>
              {errorMessage && (
                <pre>
                  <ErrorMessage errorMessage={errorMessage} />
                </pre>
              )}
              <p
                className={`${
                  isLoading ? "italic " : ""
                } mt-8 text-lg leading-6 text-movet-black font-source-sans-pro`}
              >
                {isLoading
                  ? "Processing your request, please wait..."
                  : submissionSuccess === null
                  ? appointmentRequest
                    ? "Please submit the form below to request a custom appointment time."
                    : "Leave us a note and we'll get back to you as soon as possible!"
                  : "Something went wrong, please try again later or email support@movetcare.com if you continue having trouble."}
              </p>
            </div>
          )}
          {submissionSuccess === null && (
            <div className="mt-8 w-full sm:max-w-md">
              <form className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 text-left">
                <TextInput
                  autoFocus={!(mode !== "app")}
                  disabled={isLoading}
                  label="First Name"
                  name="firstName"
                  control={control}
                  errors={errors}
                  placeholder="Your First Name"
                  autoComplete="given-name"
                />
                <TextInput
                  disabled={isLoading}
                  label="Last Name"
                  name="lastName"
                  control={control}
                  errors={errors}
                  placeholder="Your Last Name"
                  autoComplete="family-name"
                />
                <div className="sm:col-span-2 my-2">
                  <EmailInput
                    required
                    disabled={isLoading}
                    label="Email Address"
                    name="email"
                    errors={errors}
                    control={control}
                    placeholder={"Your Email Address"}
                  />
                </div>
                <div className="sm:col-span-2 my-2">
                  <PhoneInput
                    disabled={isLoading}
                    label="Phone Number"
                    name="phone"
                    control={control}
                    errors={errors}
                    required={false}
                  />
                </div>
                {mode !== "app" && (
                  <div className="sm:col-span-2 my-2">
                    <SelectInput
                      label="Reason"
                      name="reason"
                      required
                      disabled={isLoading || Boolean(appointmentRequest)}
                      values={CONTACT_REASONS}
                      errors={errors}
                      control={control}
                    />
                  </div>
                )}
                <div className="sm:col-span-2 my-2">
                  <TextInput
                    autoFocus={mode === "app"}
                    disabled={isLoading}
                    label={
                      CONTACT_REASONS[2] === reason
                        ? "Tell us about the bug(s) you found"
                        : appointmentRequest
                        ? "Appointment Request"
                        : "Message"
                    }
                    placeholder={
                      CONTACT_REASONS[1] === reason
                        ? "Please provide as much details as possible"
                        : appointmentRequest
                        ? 'Please provide the 5 "W"\'s (Who, What, Where, When and Why)'
                        : "Whats on your mind?"
                    }
                    required
                    multiline
                    numberOfLines={4}
                    name="message"
                    control={control}
                    errors={errors}
                  />
                </div>
                <div className="flex flex-col justify-center items-center sm:col-span-2 my-4">
                  <Button
                    type="submit"
                    icon={faPaw}
                    iconSize={"sm"}
                    loading={isLoading}
                    disabled={!isDirty || isLoading}
                    color="black"
                    text="Submit"
                    className={"w-full md:w-1/3"}
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </>
  );
};
