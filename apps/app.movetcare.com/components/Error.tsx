import { faCircleExclamation, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { environment } from "utilities";

export const Error = ({ error, isAppMode }: any) => {
  return (
    <div className="text-center">
      <FontAwesomeIcon
        icon={faCircleExclamation}
        size="3x"
        className="text-movet-red"
      />
      <h2 className="text-2xl font-extrabold tracking-tight text-movet-black sm:text-4xl font-parkinson mb-4">
        Whoops!
      </h2>
      <p className={"mt-4 text-lg leading-6 text-movet-black"}>
        We&apos;re sorry, but something went wrong.
      </p>
      {environment === "development" && (
        <pre className="my-8 p-4">
          {JSON.stringify({
            error: { message: error?.message, code: error?.code },
          })}
        </pre>
      )}
      {!isAppMode ? (
        <p>
          Please try again or{" "}
          <a
            href={
              (environment === "production"
                ? "https://movetcare.com"
                : "http://localhost:3000") + "/contact"
            }
            target="_blank"
            rel="noreferrer"
          >
            contact support
          </a>{" "}
          for assistance.
        </p>
      ) : (
        <p>Please try again </p>
      )}
      <div
        className="flex flex-row justify-center items-center my-4 cursor-pointer"
        onClick={() => (window.location.href = window.location.origin)}
      >
        <FontAwesomeIcon icon={faRedo} />
        <p className="ml-2">Try Again</p>
      </div>
    </div>
  );
};
