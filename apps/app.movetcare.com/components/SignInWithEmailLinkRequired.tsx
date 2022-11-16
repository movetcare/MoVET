import { faEnvelopeSquare, faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import router from 'next/router';
import toast from 'react-hot-toast';
import { environment } from "utilities";

export const SignInWithEmailLinkRequired = ({
  successMessage,
  email = undefined,
}: {
  successMessage: string | null;
  email: string | undefined;
}) => {
  return (
    <>
      <h2 className="text-2xl font-extrabold tracking-tight text-center">
        {successMessage !== null ? successMessage : "You're almost there!"}
      </h2>
      {!successMessage && (
        <p className="text-center mb-4">
          Please check in for your appointment by submitting your email below
        </p>
      )}
      <p className="mx-auto text-center text-movet-red">
        Please check your email for a sign in link
      </p>
      <p className="mx-auto text-center text-xs mb-6 italic">
        Your booking session will resume once you sign in
      </p>
      <div className="border border-movet-gray rounded-xl bg-white mt-4 text-left flex flex-row items-center px-4 py-3 mx-8">
        <FontAwesomeIcon
          icon={faEnvelopeSquare}
          size={"2x"}
          className="text-movet-black mr-4"
        />
        <div className="text-left flex-1 justify-left">
          <p className="italic mx-auto text-sm m-0">
            FROM: noreply@movetcare.com
          </p>
          <p className="italic mx-auto text-sm m-0">
            SUBJECT: &quot;Sign In to MoVET&quot;
          </p>
        </div>
      </div>
      {environment === "development" && (
        <pre className="my-8">
          Copy & Paste URL Query String Arguments
          (mode,lang,oobCode,apiKey,continueUrl) from Link Generated in Terminal
          (http://127.0.0.1:9099/emulator/action) to:
          {window.location.host}
        </pre>
      )}
      <p
        className="text-xs mt-6 uppercase text-center text-movet-brown cursor-pointer hover:underline ease-in-out duration-500"
        onClick={() => {
          toast(`A new verification link has been sent to ${email}`, {
            duration: 4000,
            icon: (
              <FontAwesomeIcon
                icon={faEnvelopeSquare}
                size="sm"
                className="text-movet-green"
              />
            ),
          });

          if (email)
            (router.replace(
              `/request-an-appointment?email=${email?.replaceAll("+", "%2B")}`
            ) as any) && router.reload();
          else
            (router.replace("/request-an-appointment") as any) &&
              router.reload();
        }}
      >
        <FontAwesomeIcon icon={faRedo} className="text-movet-brown mr-2" />{" "}
        Resend Verification Link
      </p>
    </>
  );
};
