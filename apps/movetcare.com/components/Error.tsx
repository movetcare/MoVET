import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

export const Error = ({ error }: any) => {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";

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
      <pre className="my-8 p-4">
        {JSON.stringify({
          error: { message: error?.message, code: error?.code },
        })}
      </pre>
      {!isAppMode ? (
        <p>
          Please try again or{" "}
          <a
            href={"https://movetcare.com/contact"}
            target="_blank"
            rel="noreferrer"
          >
            contact support
          </a>{" "}
          for assistance.
        </p>
      ) : (
        <p>Please try again...</p>
      )}
    </div>
  );
};
