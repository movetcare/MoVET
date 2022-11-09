import {
  faArrowRight,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { BookingFooter } from "components/booking/BookingFooter";
import { BookingHeader } from "components/booking/BookingHeader";
import { Button } from "ui";
import { Loader } from "ui";
import { Error } from "components/Error";
import { useState } from "react";
import { Booking } from "types/Booking";
import { Staff } from "types/Staff";
import Image from "next/image";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { firestore } from "services/firebase";
export const ChooseStaff = ({
  session,
  isAppMode,
}: {
  session: Booking;
  isAppMode: boolean;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  // useEffect(() => {
  //   const advanceToNextStep = async () =>
  //     await setDoc(
  //       doc(firestore, "bookings", `${session.id}`),
  //       {
  //         selectedStaff: null,
  //         updatedOn: serverTimestamp(),
  //       },
  //       { merge: true }
  //     ).catch((error: any) => {
  //       setIsLoading(false);
  //       setError(error);
  //     });
  //   if (session.staff && session.staff.length < 1) advanceToNextStep();
  //   else setIsLoading(false);
  // }, [session]);
  const onSubmit = async (selectedStaff: Staff | string) => {
    setIsLoading(true);
    await setDoc(
      doc(firestore, "bookings", `${session.id}`),
      {
        selectedStaff,
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
      <BookingHeader
        isAppMode={isAppMode}
        title={"Choose an Expert"}
        description={"Which MoVET Expert would you like to meet with?"}
      />
      <div className="mt-8 px-1">
        <form className="grid grid-cols-1 gap-y-8 text-left mt-8 z-10 relative mb-8 overflow-visible">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Error error={error.message} />
          ) : (
            <>
              {session?.staff &&
                session?.staff.map((expert: Staff, index: number) =>
                  expert?.isActive && expert?.isStaff ? (
                    <div key={index}>
                      <div>
                        <div className="">
                          {expert?.picture ? (
                            <Image
                              src={`${expert?.picture}`}
                              // layout="responsive"
                              height={80}
                              width={80}
                              className="rounded-full mx-auto"
                              alt={`Photo of ${expert?.firstName} ${expert?.lastName}`}
                            />
                          ) : (
                            <Image
                              src="https://storage-us.provetcloud.com/provet/4285/users/09339fca5622431ab86783c206483ce0.jpeg"
                              // layout="responsive"
                              height={80}
                              width={80}
                              className="rounded-full mx-auto"
                              alt={`MoVET Logo Placeholder Image for ${expert?.firstName} ${expert?.lastName}`}
                            />
                          )}
                        </div>
                        <h2 className="text-2xl text-center my-4">
                          {expert?.title ? `${expert?.title} ` : ""}
                          {expert?.firstName ? `${expert?.firstName} ` : ""}
                          {expert?.lastName ? expert?.lastName : ""}
                        </h2>
                        {expert?.qualifications && (
                          <>
                            <h3>Qualifications:</h3>
                            <p>{expert?.qualifications}</p>
                          </>
                        )}
                        {expert?.areasOfExpertise && (
                          <div className="mt-6">
                            <h3>Areas of Expertise:</h3>
                            <p>{expert?.areasOfExpertise}</p>
                          </div>
                        )}
                      </div>
                      <Button
                        type="submit"
                        icon={faCalendarCheck}
                        iconSize={"lg"}
                        color="black"
                        text={`Request 
                          ${expert?.firstName ? `${expert?.firstName}` : " "}`}
                        className={"w-full sm:w-2/3 mx-auto mt-4"}
                        onClick={() => onSubmit(expert)}
                      />
                      {index !== session?.staff?.length - 1 && (
                        <hr className="text-movet-gray border rounded-full my-8" />
                      )}
                    </div>
                  ) : (
                    <div key={index}></div>
                  )
                )}
              <hr className="text-movet-gray border rounded-full my-8" />
              <Button
                type="submit"
                icon={faArrowRight}
                iconSize={"lg"}
                color="red"
                text="SKIP"
                className={"w-full sm:w-2/3 mx-auto mt-4 sm:mt-0"}
                onClick={() => onSubmit("none")}
              />
            </>
          )}
        </form>
      </div>
      <BookingFooter session={session} />
    </>
  );
};