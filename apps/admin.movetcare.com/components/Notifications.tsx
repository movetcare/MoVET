import React, { useEffect } from "react";
import "firebase/messaging";
import { messages, pushConfig } from "services/firebase";
import { toast, Toaster, ToastBar } from "react-hot-toast";
import { useRouter } from "next/router";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onMessage } from "firebase/messaging";
import Image from "next/image";

const Notifications = ({ children }: any) => {
  const router = useRouter();
  useEffect(() => {
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("event for the service worker", event?.data || event);
      });
    else
      alert(
        "WARNING - Service Workers are not supported in this browser! Push Notifications will NOT work...",
      );
  }, []);

  useEffect(() => {
    const setToken = async () => {
      try {
        const token = await pushConfig.init();
        if (token) {
          console.log("token", token);
          //const unsubscribeMessages =
          onMessage(messages, (message: any) => {
            console.log("PUSH MESSAGE", message);
            toast.custom(
              (t: any) => (
                <div
                  className="bg-white border-movet-red border-2 p-4 rounded-xl flex flex-row items-center min-w-min cursor-pointer ease-in-out duration-300 hover:border-movet-black"
                  onClick={() => {
                    message?.fcmOptions?.link
                      ? router.push(message?.fcmOptions?.link)
                      : "/telehealth/chat";
                    toast.dismiss(t.id);
                  }}
                >
                  <Image
                    src="/images/icons/telehealth.svg"
                    alt={`In-Clinic Appointments icon`}
                    width={50}
                    height={50}
                  />
                  <div className="flex flex-col items-center px-4 -ml-4">
                    <h1 className="text-base">{message.notification.title}</h1>
                    <p className="text-sm">{message.notification.body}</p>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              ),
              {
                duration: 500000,
              },
            );
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    setToken();
  }, [router]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false}>
        {(t: any) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      {children}
    </>
  );
};

export default Notifications;
