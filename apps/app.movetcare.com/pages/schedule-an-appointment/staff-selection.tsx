import { UAParser } from "ua-parser-js";
import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { useEffect, useState } from "react";
import { Button, Loader } from "ui";
import {
  faArrowRight,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { httpsCallable } from "firebase/functions";
import { functions } from "services/firebase";
import { BookingHeader } from "components/BookingHeader";
import { BookingFooter } from "components/BookingFooter";
import Image from "next/image";
import { Staff } from "types/Staff";
import { getUrlQueryStringFromObject } from "utilities";

export default function StaffSelection() {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [staff, setStaff] = useState<Array<any> | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") === null)
      router.push("/schedule-an-appointment");
    else {
      setStaff(
        JSON.parse(window.localStorage.getItem("bookingSession") as string)
          ?.staff,
      );
      setIsLoading(false);
    }
  }, [router]);

  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    setIsLoading(false);
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoadingMessage("Saving Selection...");
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "scheduleAppointment",
          )({
            selectedStaff: data,
            id: JSON.parse(
              window.localStorage.getItem("bookingSession") as string,
            )?.id,
            device: JSON.parse(
              JSON.stringify(UAParser(), function (key: any, value: any) {
                if (value === undefined) return null;
                return value;
              }),
            ),
            token,
          });
          if (result?.error !== true || result?.error === undefined) {
            setLoadingMessage("Almost Finished...");
            if (result?.client?.uid && result?.id) {
              window.localStorage.setItem(
                "bookingSession",
                JSON.stringify(result),
              );
              const queryString = getUrlQueryStringFromObject(router.query);
              router.push(
                "/schedule-an-appointment/datetime-selection" +
                  (queryString ? queryString : ""),
              );
            } else handleError(result);
          } else handleError(result);
        } catch (error) {
          handleError(error);
        }
      }
    } else handleError({ message: "FAILED CAPTCHA" });
  };
  return (
    <section className="w-full flex-1">
      <AppHeader />
      <div
        className={`flex items-center justify-center bg-white rounded-xl max-w-xl mx-auto${
          !isAppMode ? " p-4 mb-4 sm:p-8" : ""
        }`}
      >
        <div className={isAppMode ? "mb-8" : ""}>
          <section className="relative mx-auto">
            {isLoading ? (
              <Loader
                message={loadingMessage || "Loading, please wait..."}
                isAppMode={isAppMode}
              />
            ) : error ? (
              <Error error={error} isAppMode={isAppMode} />
            ) : (
              <div
                className={
                  isAppMode
                    ? "flex flex-grow items-center justify-center min-h-screen"
                    : ""
                }
              >
                <div className="flex-col">
                  <BookingHeader
                    isAppMode={isAppMode}
                    title={"Choose an Expert"}
                    description={
                      "Which MoVET Expert would you like to meet with?"
                    }
                  />
                  <div className="mt-8 px-1">
                    <div className="grid grid-cols-1 gap-y-8 text-left mt-8 z-10 relative mb-8 overflow-visible">
                      {staff &&
                        staff.map((expert: Staff, index: number) =>
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
                                      alt={`Photo of ${expert?.title}`}
                                    />
                                  ) : (
                                    <Image
                                      src="/icon-192x192.png"
                                      // layout="responsive"
                                      height={80}
                                      width={80}
                                      className="rounded-full mx-auto"
                                      alt={`MoVET Logo Placeholder Image for ${expert?.title}`}
                                    />
                                  )}
                                </div>
                                <h2 className="text-2xl text-center my-4">
                                  {expert?.title ? `${expert?.title} ` : ""}
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
                          ${expert?.title ? `${expert?.title}` : " "}`}
                                className={"w-full sm:w-2/3 mx-auto mt-4"}
                                onClick={() => onSubmit(expert)}
                              />
                              {index !== staff?.length - 1 && (
                                <hr className="text-movet-gray border rounded-full my-4" />
                              )}
                            </div>
                          ) : (
                            <div key={index}></div>
                          ),
                        )}
                      <hr className="text-movet-gray border rounded-full" />
                      <Button
                        type="submit"
                        icon={faArrowRight}
                        iconSize={"lg"}
                        color="red"
                        text="SKIP"
                        className={"w-full sm:w-2/3 mx-auto"}
                        onClick={() => onSubmit("NONE")}
                      />
                    </div>
                  </div>
                  <BookingFooter />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
