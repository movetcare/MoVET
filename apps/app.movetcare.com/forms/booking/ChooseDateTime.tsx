import { BookingFooter } from "components/booking/BookingFooter";
import { Booking } from "types/Booking";
import TimePicker from "react-time-picker/dist/entry.nostyle";
import Calendar from "react-calendar";
import { useState } from "react";
import { BookingHeader } from "components/booking/BookingHeader";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Button } from "ui";
import { Error } from "components/Error";
import { Loader } from "ui";
import { Transition } from "@headlessui/react";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { firestore } from "services/firebase";
import { formatDateObjectPlusTimeStringIntoString } from "utilities";

export const ChooseDateTime = ({
  session,
  isAppMode,
}: {
  session: Booking;
  isAppMode: boolean;
}) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [selectedTime, onTimeChange] = useState<string | null>(null);
  const [selectedDate, onDateChange] = useState<Date | null>(
    session.vcprRequired ? tomorrow : today
  );
  const onSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    await setDoc(
      doc(firestore, "bookings", `${session.id}`),
      {
        requestedDateTime: {
          date: selectedDate,
          time: selectedTime,
        },
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
        <Error errorMessage={error?.message || "Unknown Error"} />
      ) : (
        <>
          <BookingHeader
            isAppMode={isAppMode}
            title="Request a Time"
            description={
              "What day and time would you like to request an appointment for?"
            }
          />
          <form onSubmit={onSubmit}>
            <Calendar
              onChange={(value: any) => {
                console.log(value);
                onDateChange(value);
              }}
              value={selectedDate}
              minDate={session.vcprRequired ? tomorrow : today}
              minDetail="month"
              className="flex-1 justify-center items-center my-8 w-full mx-auto"
            />
            <h2 className="text-center text-base mb-0">Hours of Operation</h2>
            <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside mb-4 whitespace-nowrap font-normal text-sm">
              <div className="w-full">
                <div className="flex w-full">
                  <span className="whitespace-nowrap">MON - FRI</span>
                  <div className="w-full border-b mb-2 mx-4"></div>
                </div>
                <div className="flex w-full">
                  <span className="whitespace-nowrap">SAT & SUN</span>
                  <div className="w-full border-b mb-2 mx-4"></div>
                </div>
              </div>
              <div className="w-max whitespace-nowrap">
                <div>9 AM TO 5 PM</div>
                <div>CLOSED</div>
              </div>
            </div>
            <TimePicker
              onChange={(value: any) => onTimeChange(value)}
              value={selectedTime}
              maxTime="16:00"
              minTime="09:00"
              disableClock
              className="border-movet-black focus:outline-none focus:ring-1 focus:ring-movet-brown focus:border-movet-brown relative border w-full bg-white rounded-xl pl-3 pr-3 py-3 text-left cursor-pointer sm:text-sm placeholder:text-gray font-abside-smooth"
            />
            <Transition
              show={selectedDate !== null && selectedTime !== null}
              enter="transition ease-in duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              <>
                <h2 className="text-base mt-8 text-center">
                  REQUEST APPOINTMENT FOR
                </h2>
                {selectedDate && selectedTime && (
                  <p className="text-center italic">
                    {formatDateObjectPlusTimeStringIntoString(
                      selectedDate,
                      selectedTime
                    )}
                  </p>
                )}
              </>
            </Transition>
            <Button
              type="submit"
              icon={faArrowRight}
              disabled={selectedDate === null || selectedTime === null}
              iconSize={"sm"}
              color="black"
              text="Continue"
              className="mt-8"
            />
          </form>
          <div className="mt-8">
            <BookingFooter session={session} />
          </div>
        </>
      )}
    </>
  );
};
