import { useState } from "react";
import { Button } from "ui";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import TextInput from "components/inputs/TextInput";
import { useForm } from "react-hook-form";
import PhoneInput from "components/inputs/PhoneInput";
import { firestore } from "services/firebase";
import { Loader } from "ui";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { Error } from "components/Error";
import { Booking } from "types/Booking";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { BookingHeader } from "components/booking/BookingHeader";

export const ClientInfo = ({
  session,
  isAppMode,
}: {
  session: Booking;
  isAppMode: boolean;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(
      object().shape({
        firstName: string().required("A first name is required"),
        lastName: string().required("A last name is required"),
        phone: string()
          .min(10, "Phone number must be 10 digits")
          .required("A phone number is required"),
      })
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await setDoc(
      doc(firestore, "bookings", `${session.id}`),
      {
        client: data,
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
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error error={error} isAppMode={isAppMode} />
      ) : (
        <>
          <BookingHeader
            isAppMode={isAppMode}
            title={"Contact Information"}
            description={"Please let us know how to contact you."}
          />
          <div className="mt-8 px-1">
            <form className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 text-left">
              <TextInput
                autoFocus
                label="First Name"
                name="firstName"
                control={control}
                errors={errors}
                placeholder="Your First Name"
                autoComplete="given-name"
                required
              />
              <TextInput
                label="Last Name"
                name="lastName"
                control={control}
                errors={errors}
                placeholder="Your Last Name"
                autoComplete="family-name"
                required
              />
              <div className="sm:col-span-2 my-2">
                <PhoneInput
                  label="Phone Number"
                  name="phone"
                  control={control}
                  errors={errors}
                  required
                />
              </div>
              <div className="group flex flex-col justify-center items-center sm:col-span-2 my-4">
                <Button
                  type="submit"
                  icon={faArrowRight}
                  iconSize={"sm"}
                  disabled={!isDirty}
                  color="black"
                  text="Continue"
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};
