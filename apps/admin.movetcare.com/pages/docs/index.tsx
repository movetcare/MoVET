import { getAllDocs } from "utils/docs";
import Head from "next/head";
import Link from "next/link";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Docs = ({ docs }: any) => (
  <section className="rounded-lg bg-white overflow-hidden shadow divide-y divide-movet-gray sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
    <Head>
      <title>MoVET | Documents</title>
    </Head>
    {docs?.length > 0 && (
      <>
        <div className="flex flex-row items-center justify-center col-span-2 bg-white">
          <FontAwesomeIcon icon={faBook} className="text-movet-red" size="lg" />
          <h1 className="ml-2 my-4 text-lg">Documents</h1>
        </div>
        <div
          key="Supplies Shopping List"
          className={
            "relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-movet-red flex flex-row items-center"
          }
        >
          <div className="mx-8">
            <h3 className="text-lg font-medium">
              <a
                href="https://docs.google.com/spreadsheets/d/1FGr57eeaMlyplAM1PACmCfqTcxvB6jgCdMjWpmaDgp4"
                target="_blank"
              >
                <div className="focus:outline-none hover:underline ease-in-out duration-500">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Supplies Shopping List
                </div>
              </a>
            </h3>
            <p className="text-movet-black">
              Use this document to communicate with your team about supplies
              needed for the clinic and shop
            </p>
          </div>
          <span
            className="pointer-events-none absolute top-6 right-6 text-movet-gray group-hover:text-movet-black"
            aria-hidden="true"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
          </span>
        </div>
        <div
          key="Closure Announcement Checklist"
          className={
            "relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-movet-red flex flex-row items-center"
          }
        >
          <div className="mx-8">
            <h3 className="text-lg font-medium">
              <a
                href="https://docs.google.com/document/d/1MlW5J9St7xpQ0m2b1GVenelGybc5HRfXQnjZxl4HPBk"
                target="_blank"
              >
                <div className="focus:outline-none hover:underline ease-in-out duration-500">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Closure Announcement Checklist
                </div>
              </a>
            </h3>
            <p className="text-movet-black">
              These are the steps you must take to implement a new closure
            </p>
          </div>
          <span
            className="pointer-events-none absolute top-6 right-6 text-movet-gray group-hover:text-movet-black"
            aria-hidden="true"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
          </span>
        </div>
        {docs.map((doc: any) => (
          <div
            key={doc.title}
            className={
              "relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-movet-red flex flex-row items-center"
            }
          >
            <div className="mx-8">
              <h3 className="text-lg font-medium">
                <Link href={`/docs/${doc.slug}`}>
                  <div className="focus:outline-none hover:underline ease-in-out duration-500">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {doc.title}
                  </div>
                </Link>
              </h3>
              <p className="text-movet-black">{doc.excerpt}</p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-movet-gray group-hover:text-movet-black"
              aria-hidden="true"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </div>
        ))}
      </>
    )}
  </section>
);

export const getStaticProps = async () => {
  const docs = getAllDocs(["title", "slug", "excerpt"]);
  return {
    props: { docs },
  };
};

export default Docs;
