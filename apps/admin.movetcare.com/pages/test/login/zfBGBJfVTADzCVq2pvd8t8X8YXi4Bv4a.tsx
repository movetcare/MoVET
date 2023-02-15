import { signInWithEmailAndPassword } from "firebase/auth";
import { GetStaticProps } from "next/types";
import { useEffect, useState } from "react";
import { auth } from "services/firebase";
import { Loader } from "ui";
import { environment } from "utilities";

export const getStaticProps: GetStaticProps = async () => {
  if (process.env.NODE_ENV === "production") return { notFound: true };
  else return { props: {} };
};

const TestAuthLogin = ({ notFound }: { notFound: boolean | undefined }) => {
  const [errorMessages, setErrorMessages] = useState<any>({});

  useEffect(() => {
    if (notFound)
      window.location.href =
        (environment === "development" ? "http://" : "https://") +
        `${window.location.host}`;
  }, [notFound]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const { uname, pass } = document.forms[0];
    signInWithEmailAndPassword(auth, uname.value, pass.value).catch(
      (error: any) => setErrorMessages(error)
    );
  };

  return notFound ? (
    <section className="flex flex-col items-center justify-center min-py-2">
      <main
        className={
          "h-screen flex flex-grow items-center justify-center p-8 md:px-12 lg:px-24 bg-movet-white"
        }
      >
        <div className="bg-white rounded-lg">
          <Loader />
        </div>
      </main>
    </section>
  ) : (
    <section className="flex flex-col items-center justify-center min-py-2">
      <main
        className={
          "h-screen flex flex-grow items-center justify-center p-8 bg-movet-white"
        }
      >
        <div className="flex flex-col items-center justify-center w-full flex-1 text-center">
          <div className="min-h-full flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-4 bg-white p-12 rounded-xl">
              <div className="form">
                <form onSubmit={handleSubmit}>
                  <div className="input-container">
                    <input type="text" name="uname" required />
                    <div className="error">{errorMessages?.message}</div>
                  </div>
                  <div className="input-container">
                    <input type="password" name="pass" required />
                    <div className="error">{errorMessages?.message}</div>
                  </div>
                  <div className="button-container">
                    <input type="submit" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};
export default TestAuthLogin;
