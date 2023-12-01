import {
  faCheckCircle,
  faEnvelopeSquare,
  faHouseMedical,
  faMessage,
  faPaw,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
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
import Link from "next/link";

export const ContactForm = () => {
  const router = useRouter();
  const {
    mode,
    firstName,
    lastName,
    phone,
    email,
    appointmentRequest,
    message,
  }: any = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(
    null,
  );
  const isAppMode = mode === "app";
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
      message: message || "",
    } as any,
  });
  const reason = watch("reason");

  useEffect(() => {
    if (
      mode === "app" ||
      email ||
      firstName ||
      lastName ||
      phone ||
      appointmentRequest ||
      message
    )
      reset({
        reason: appointmentRequest ? CONTACT_REASONS[1] : CONTACT_REASONS[0],
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        phone: phone || "",
        message: message || "",
      });
  }, [
    mode,
    firstName,
    lastName,
    phone,
    email,
    appointmentRequest,
    message,
    reset,
  ]);

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
        <div id="contact-form" className="w-full">
          {submissionSuccess ? (
            <div className="text-center max-w-3xl">
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
              {!isAppMode && <EmergencyWarning />}
            </div>
          ) : !isAppMode ? (
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
            </div>
          ) : (
            <></>
          )}
          {submissionSuccess === null && (
            <div className="mt-4 flex md:flex-row flex-col">
              {!isAppMode && (
                <section className="w-full md:w-1/2 p-6">
                  <h2 className="m-0 text-xl">MoVET @ Belleview Station</h2>
                  <iframe
                    title="Google Map of MoVET @ Belleview Station"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ9aCJc9mHbIcRu0B0dJWB4x8&key=AIzaSyD-8-Mxe05Y1ySHD7XoDcumWt3vjA-URF0&zoom=10"
                    className="w-full h-80 rounded-xl mb-8 mt-6"
                  />
                  <div className="flex flex-col justify-center items-center">
                    <h3 className="text-lg">
                      Wellness Clinic & Home Veterinary Services
                    </h3>
                    <a
                      className="text-center mb-2 w-full mt-2 text-sm text-movet-black hover:text-movet-red duration-300 ease-in-out"
                      target="_blank"
                      href={"https://goo.gl/maps/h8eUvU7nsZTDEwHW9"}
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faHouseMedical}
                        size="lg"
                        className="mr-2 text-movet-red"
                      />
                      4912 S Newport St, Denver, CO 80237
                    </a>
                    <a
                      className="text-center mb-2 w-full text-sm text-movet-black hover:text-movet-red duration-300 ease-in-out"
                      target="_blank"
                      href={"mailto:info@movetcare.com"}
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faEnvelopeSquare}
                        size="lg"
                        className="mr-2 text-movet-red"
                      />
                      info@movetcare.com
                    </a>
                    <a
                      className="text-center mb-2 w-full text-sm text-movet-black hover:text-movet-red duration-300 ease-in-out"
                      target="_blank"
                      href={"tel:+17205077387"}
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faPhone}
                        size="lg"
                        className="mr-2 text-movet-red"
                      />
                      (720) 507-7387
                    </a>
                    <Link
                      href="/get-the-app/"
                      passHref
                      className="text-center mb-2 w-full text-sm text-movet-black hover:text-movet-red duration-300 ease-in-out"
                    >
                      <FontAwesomeIcon
                        icon={faMessage}
                        size="lg"
                        className="mr-2 text-movet-red"
                      />
                      Chat with Us
                    </Link>
                  </div>
                </section>
              )}
              <section
                className={`grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 text-left w-full md:w-1/2 px-6 pb-6 pt-0 sm:p-6${
                  isAppMode ? " -mt-8" : ""
                }`}
              >
                {isLoading ? (
                  "Processing your request, please wait..."
                ) : submissionSuccess === null ? (
                  appointmentRequest ? (
                    ""
                  ) : (
                    ""
                  )
                ) : (
                  <p
                    className={`italic text-lg leading-6 text-movet-black font-source-sans-pro text-center col-span-2`}
                  >
                    Something went wrong, please try again later or email
                    support@movetcare.com if you continue having trouble.
                  </p>
                )}
                <TextInput
                  autoFocus={!!isAppMode}
                  disabled={isLoading}
                  label="First Name"
                  name="firstName"
                  control={control}
                  errors={errors}
                  placeholder="First Name"
                  autoComplete="given-name"
                />
                <TextInput
                  disabled={isLoading}
                  label="Last Name"
                  name="lastName"
                  control={control}
                  errors={errors}
                  placeholder="Last Name"
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
                    placeholder={"Email Address"}
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
                {!isAppMode && (
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
              </section>
            </div>
          )}
        </div>
      )}
    </>
  );
};
