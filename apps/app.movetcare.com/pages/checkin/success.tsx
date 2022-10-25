import {
  faCheckCircle,
  faCreditCard,
  faUserEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, AppLinks } from "ui";
import { AppHeader } from "components/AppHeader";
import { Loader } from "ui";
import { httpsCallable } from "firebase/functions";
import router from "next/router";
import { useState, useEffect } from "react";
import { functions } from "services/firebase";
import { formatPhoneNumber } from "utilities";

export default function Success() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [client, setClient] = useState<any>();
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage) {
      const fetchClientData = async () => {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "checkIn"
          )({ id: sessionStorage.getItem("id"), token: true });
          setClient(result);
          setIsLoading(false);
          sessionStorage.removeItem("session");
        } catch (error: any) {
          console.error(error);
        }
      };
      fetchClientData();
    }
  }, []);
  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <main className="w-full flex-1 overflow-hidden">
        <AppHeader />
        <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 sm:p-8">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="text-center">
              <FontAwesomeIcon icon={faCheckCircle} size="4x" color="#00A36C" />
              <h3 className="text-2xl tracking-tight text-movet-black font-parkinson mt-6">
                We&apos;ve got you checked in
                {client?.firstName
                  ? ` ${
                      client?.firstName.charAt(0).toUpperCase() +
                      client?.firstName.slice(1)
                    }`
                  : ""}
                .
              </h3>
              <p
                className={
                  "text-lg leading-6 text-movet-black font-source-sans-pro mt-4"
                }
              >
                We&apos;ll send you a text @{" "}
                <span className="italic">
                  {formatPhoneNumber(client?.phone)}
                </span>{" "}
                as soon as we are ready to begin your appointment.
              </p>
              <p
                className={
                  "mt-4 leading-6 text-movet-black font-source-sans-pro italic"
                }
              >
                Feel free to browse our shop and checkout our new mobile app
                which you can use to book future clinic, at home, and telehealth
                appointments!
              </p>
              <div className="flex flex-col justify-center items-center mt-6">
                <div className="flex justify-center">
                  <AppLinks />
                </div>
              </div>
              <h3 className="mt-4">Need to change your information?</h3>
              <div className="flex flex-row justify-center items-center">
                <div className="mx-2 flex flex-col justify-center items-center">
                  <Button
                    color="black"
                    icon={faUserEdit}
                    iconSize={"lg"}
                    text="Update Profile"
                    className={"mt-4"}
                    onClick={() => router.reload()}
                  />
                </div>
                {client?.email && (
                  <div className="mx-2 flex flex-col justify-center items-center">
                    <Button
                      color="red"
                      icon={faCreditCard}
                      iconSize={"lg"}
                      text="Update Payment"
                      className={"mt-4"}
                      onClick={() =>
                        router.push(
                          `/payment?email=${client?.email?.replaceAll(
                            "+",
                            "%2B"
                          )}`
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
