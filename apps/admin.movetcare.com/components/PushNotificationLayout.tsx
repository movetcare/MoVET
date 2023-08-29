import React, { useEffect } from "react";
import "firebase/messaging";
import { messages, pushConfig } from "services/firebase";
import { toast, Toaster, ToastBar } from "react-hot-toast";
import { useRouter } from "next/router";
import { faArrowRight, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PushNotificationLayout = ({ children }: any) => {
  const router = useRouter();
  useEffect(() => {
    setToken();
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("event for the service worker", event);
      });
    else console.error("service worker not supported");

    async function setToken() {
      try {
        const token = await pushConfig.init();
        if (token) {
          console.log("token", token);
          getMessage();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  function getMessage() {
    const messaging = messages?.messaging();
    if (messaging)
      messaging.onMessage((message: any) => {
        console.log("PUSH MESSAGE", message);
        toast(JSON.stringify(message), {
          duration: 5000,
          position: "top-center",
          icon: (
            <FontAwesomeIcon
              icon={faCircleCheck}
              size="sm"
              className="text-movet-yellow"
            />
          ),
        });
      });
    else console.log("No Messages Found!");
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false}>
        {(t: any) => {
          console.log("T", t);
          return (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  {message}
                  {t.type !== "loading" && (
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      onClick={() => router.push(t?.data?.url)}
                    />
                  )}
                </>
              )}
            </ToastBar>
          );
        }}
      </Toaster>
      {children}
    </>
  );
};

export default PushNotificationLayout;
