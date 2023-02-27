import { useState } from "react";
import { useForm } from "react-hook-form";
import { ServerResponse } from "types";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { Loader, ErrorMessage, Button } from "../../elements";
import { TextInput, EmailInput } from "../inputs";
import PhoneInput from "../inputs/PhoneInput";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/router";

export const K9SmilesForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    reset,
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
      })
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    const submitForm = async () =>
      (
        await fetch("/api/k9-smiles", {
          method: "POST",
          body: JSON.stringify(data),
        })
      ).json();
    submitForm()
      .then((response: ServerResponse) => {
        if (response.error) setErrorMessage(response.error);
        else if (Number(router.query.disableRedirect) !== 1)
          window.open("https://movet.timetap.com/", "_blank");
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
      {isLoading ? (
        <Loader message="Taking You to K-9 Smile's Appointment Schedule..." />
      ) : (
        <div id="sign-up-form">
          {errorMessage ? (
            <pre>
              <ErrorMessage errorMessage={errorMessage} />
            </pre>
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
                <div className="flex flex-col justify-center items-center sm:col-span-2 my-4">
                  <Button
                    type="submit"
                    icon={faPaw}
                    iconSize={"sm"}
                    loading={isLoading}
                    disabled={!isDirty || isLoading}
                    color="black"
                    text="Schedule an Appointment"
                    className={"w-full md:w-1/3"}
                    onClick={handleSubmit(onSubmit)}
                  />
                  <div className="flex sm:col-span-2 mx-auto mt-2">
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-xs italic text-movet-black">
                        By clicking the &quot;Schedule an Appointment&quot;
                        button above,
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
