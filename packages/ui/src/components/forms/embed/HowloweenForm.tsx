import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ServerResponse } from "types";
import {
  faCat,
  faCheckCircle,
  faDog,
  faMars,
  faPaw,
  faVenus,
} from "@fortawesome/free-solid-svg-icons";
import { Loader, ErrorMessage, Button } from "../../elements";
import { TextInput, EmailInput, ToggleInput, DateInput } from "../inputs";
import PhoneInput from "../inputs/PhoneInput";
import { object, string, addMethod } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

addMethod(string as any, "isBeforeToday", function (errorMessage: string) {
  return (this as any).test(
    "test-before-today",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      const today = new Date();
      const date = value?.split("-");
      const month = date[0];
      const day = date[1];
      const year = date[2];
      const valueAsDate = new Date(year, month - 1, day);
      return (
        today > valueAsDate || createError({ path, message: errorMessage })
      );
    },
  );
});

addMethod(string as any, "isValidDay", function (errorMessage: string) {
  return (this as any).test(
    "test-valid-day",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      const date = value?.split("-");
      const day = date[1];
      return (
        (day <= 31 && day >= 1) || createError({ path, message: errorMessage })
      );
    },
  );
});

addMethod(string as any, "isValidMonth", function (errorMessage: string) {
  return (this as any).test(
    "test-valid-month",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      const date = value?.split("-");
      const month = date[0];
      return (
        (month <= 12 && month >= 1) ||
        createError({ path, message: errorMessage })
      );
    },
  );
});

export const HowloweenForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hideFormSection, setHideFormSection] = useState<boolean>(true);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(
      object({
        email: string()
          .email("Email must be a valid email address")
          .required("An email address is required"),
        firstName: string().required("A First Name is required"),
        lastName: string().required("A last name is required"),
        phone: string().required("A phone number is required"),
        handle: string(),
        petName: string().required("A pet name is required"),
        petAge: (string() as any)
          .isBeforeToday("Birthday must be before today")
          .isValidDay("Please enter valid day")
          .isValidMonth("Please enter a valid month")
          .required("A birthday is required"),
        petBreed: string().required("A breed for your pet is required"),
        petGender: string().required("A gender for your pet is required"),
        petHandle: string(),
        description: string().required("A costume description is required"),
        funFact: string(),
      }),
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      handle: "",
      petName: "",
      petAge: "",
      petBreed: "",
      petGender: "",
      petHandle: "",
      description: "",
      funFact: "",
    },
  });

  const phoneNumberSelection = watch("phone");
  const emailSelection = watch("email");

  useEffect(() => {
    if (
      emailSelection &&
      phoneNumberSelection &&
      phoneNumberSelection.length === 10
    ) {
      setHideFormSection(false);
    }
  }, [phoneNumberSelection, emailSelection]);

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    console.log("data => ", data);
    const submitForm = async () =>
      (
        await fetch("/api/howloween", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).json();
    submitForm()
      .then((response: ServerResponse) => {
        if (response.error) setErrorMessage(response.error);
        else setSubmissionSuccess(true);
      })
      .catch((error) => {
        setErrorMessage(error?.message || JSON.stringify(error));
      })
      .finally(() => {
        reset();
        setIsLoading(false);
      });
  };

  return (
    <>
      {!submissionSuccess ? (
        <>
          <h1 className="mt-8 mb-0">Costume Contest Sign Up</h1>
          <p>Submit the form below to enter into the contest.</p>
        </>
      ) : (
        <>
          <h1 className="mt-8 mb-0">Costume Contest Sign Up Successful</h1>
          <p className="text-lg">
            We&apos;ve added you and your pet into the contest!
          </p>
        </>
      )}
      {isLoading ? (
        <Loader message="Processing, Please Wait..." />
      ) : (
        <div id="sign-up-form">
          {errorMessage ? (
            <pre>
              <ErrorMessage errorMessage={errorMessage} />
            </pre>
          ) : submissionSuccess ? (
            <section className="relative mx-auto mt-4">
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="4x"
                className="text-movet-green mx-auto w-full mb-4"
              />
              <p className="text-center sm:px-8 italic">
                Be sure to have your friends and family vote
                <br />
                for their favorite costume on our{" "}
                <a href="https://www.facebook.com/MOVETCARE" target="_blank">
                  Facebook
                </a>{" "}
                and{" "}
                <a
                  href="https://www.instagram.com/nessie_themovetpup/"
                  target="_blank"
                >
                  Instagram
                </a>
                !
              </p>
              <p className="text-center sm:px-8 font-bold -mb-2 mt-4 text-sm">
                Have another pet?
              </p>
              <p
                className="text-center sm:px-8 italic text-xs cursor-pointer"
                onClick={() => router.reload()}
              >
                Click here to submit the entry form again and enter them into
                the contest!
              </p>
            </section>
          ) : (
            <div className="mt-8 w-full sm:max-w-md">
              <form className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 text-left">
                <TextInput
                  disabled={isLoading}
                  label="First Name"
                  name="firstName"
                  control={control}
                  errors={errors}
                  placeholder="Your First Name"
                  autoComplete="given-name"
                  required
                />
                <TextInput
                  disabled={isLoading}
                  label="Last Name"
                  name="lastName"
                  control={control}
                  errors={errors}
                  placeholder="Your Last Name"
                  autoComplete="family-name"
                  required
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
                    required
                  />
                </div>
                <div className="sm:col-span-2 my-2">
                  <TextInput
                    disabled={isLoading}
                    label="Social Media Handle (Optional)"
                    name="handle"
                    control={control}
                    errors={errors}
                    placeholder="Your Social Media Handle"
                  />
                </div>
                <Transition
                  show={!hideFormSection}
                  enter="transition ease-in duration-500"
                  leave="transition ease-out duration-64"
                  leaveTo="opacity-10"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leaveFrom="opacity-100"
                  as={Fragment}
                >
                  <section className="sm:col-span-2">
                    <hr className="sm:col-span-2 mt-4 mb-8 text-movet-gray" />
                    <div className="my-4">
                      <TextInput
                        disabled={isLoading}
                        label="Pet Name"
                        name="petName"
                        control={control}
                        errors={errors}
                        placeholder="Your Pet's Name"
                        required
                      />
                    </div>
                    <div className="my-8">
                      <ToggleInput
                        options={[
                          { name: "dog", icon: faDog },
                          { name: "cat", icon: faCat },
                        ]}
                        label="Type of Pet"
                        control={control}
                        errors={errors}
                        name="petBreed"
                        required
                      />
                    </div>
                    <div className="my-8">
                      <ToggleInput
                        options={[
                          { name: "male", icon: faMars },
                          { name: "female", icon: faVenus },
                        ]}
                        label="Pet's Gender"
                        control={control}
                        errors={errors}
                        name="petGender"
                        required
                      />
                    </div>
                    <div className="my-8">
                      <DateInput
                        label="Pet's Birthday"
                        name="petAge"
                        errors={errors}
                        control={control}
                        required
                      />
                    </div>
                    <div className="my-8">
                      <TextInput
                        disabled={isLoading}
                        label="Costume Description"
                        name="description"
                        control={control}
                        errors={errors}
                        placeholder="Describe your costume so we can find you!"
                        multiline
                        numberOfLines={3}
                        required
                      />
                    </div>
                    <div className="my-8">
                      <TextInput
                        disabled={isLoading}
                        label="Pet's Social Media Handle (Optional)"
                        name="petHandle"
                        control={control}
                        errors={errors}
                        placeholder="Your Pet's Social Media Handle"
                      />
                    </div>
                    <div className="my-8">
                      <TextInput
                        disabled={isLoading}
                        label="Fun Fact (Optional)"
                        name="funFact"
                        control={control}
                        errors={errors}
                        placeholder="What is a fun fact about your pet?"
                        multiline
                        numberOfLines={3}
                      />
                    </div>
                    <div className="mt-8">
                      <label
                        className="block text-sm font-medium text-movet-black font-abside mb-2"
                        id="headlessui-label-:r3:"
                        role="none"
                      >
                        Photo Release <span className="text-movet-red">*</span>
                      </label>
                      <p className="text-xs italic">
                        By clicking the &quot;Sign Up&quot; button below, I
                        hereby give the MoVET, Inc. and/or DenverPetPics my
                        permission to use the Images depicting the Property in
                        any Media, for any purpose, which may include, among
                        others, advertising, promotion, marketing and packaging
                        for any product or service. I agree that the Images may
                        be combined with other images, text and graphics and
                        cropped, altered or modified. I agree that I have no
                        rights to the Images, and all rights to the Images
                        belong to the MoVET, Inc. and/or DenverPetPics.
                      </p>
                    </div>
                  </section>
                </Transition>
                <div className="flex flex-col justify-center items-center sm:col-span-2 my-4">
                  <Button
                    type="submit"
                    icon={faPaw}
                    iconSize={"sm"}
                    loading={isLoading}
                    disabled={!isDirty || isLoading}
                    color="black"
                    text="Sign Up"
                    className={"w-full md:w-1/3"}
                    onClick={handleSubmit(onSubmit)}
                  />
                  <div className="flex sm:col-span-2 mx-auto mt-2">
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-xs italic text-movet-black">
                        By clicking the &quot;Sign Up&quot; button above,
                        <br />
                        you agree to the{" "}
                        <span className="font-medium font-abside text-center md:text-left hover:underline  ease-in-out duration-500 mb-2">
                          <Link href="/privacy-policy?mode=app">
                            <span className="text-movet-brown hover:underline  ease-in-out duration-500 cursor-pointer">
                              privacy policy
                            </span>
                          </Link>
                        </span>{" "}
                        and{" "}
                        <span className="font-medium font-abside text-center md:text-left hover:underline  ease-in-out duration-500 mb-2">
                          <Link href="/terms-and-conditions?mode=app">
                            <span className="text-movet-brown hover:underline  ease-in-out duration-500 cursor-pointer">
                              terms of service
                            </span>
                          </Link>
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};
