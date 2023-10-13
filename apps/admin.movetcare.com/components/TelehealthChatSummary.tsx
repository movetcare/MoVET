import { collection, limit, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Loader } from "ui";
import { firestore } from "services/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faChevronCircleRight,
  faCaretDown,
  faCaretUp,
  faCircleUser,
  faClockFour,
  faCommentMedical,
} from "@fortawesome/free-solid-svg-icons";
import { timeSince } from "utils/timeSince";
import Link from "next/link";
import Error from "components/Error";
import TelehealthChatStatus from "./TelehealthChatStatus";
import { useState } from "react";

const TelehealthChatSummary = ({ mode }: { mode?: "sidebar" }) => {
  const [showArchive, setShowArchive] = useState<boolean>(false);
  const [activeChats, loadingActiveChats, errorActiveChats] = useCollection(
    query(
      collection(firestore, "telehealth_chat"),
      where("status", "==", "active"),
    ),
  );

  const [completedChats, loadingCompletedChats, errorCompletedChats] =
    useCollection(
      query(
        collection(firestore, "telehealth_chat"),
        where("status", "==", "complete"),
        limit(50),
      ),
    );

  return (
    <div>
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="flex flex-row items-center justify-center">
          <FontAwesomeIcon
            icon={faCommentMedical}
            className="text-movet-yellow"
            size="lg"
          />
          <h1 className="ml-2 my-4 text-lg">
            {loadingActiveChats ? "Loading Chats..." : "Active Chats"}
          </h1>
        </div>
        <TelehealthChatStatus />
        {loadingActiveChats ? (
          <div className="mb-6">
            <Loader height={200} width={200} />
          </div>
        ) : errorActiveChats ? (
          <div className="px-8 pb-8">
            <Error error={errorActiveChats} />
          </div>
        ) : (
          <ul
            role="list"
            className="divide-y divide-movet-gray border-t border-movet-gray mt-4"
          >
            {activeChats && activeChats.docs.length < 1 && (
              <p className="text-lg italic text-movet-red opacity-50 text-center mx-8 mt-4 mb-4">
                There are no active chat sessions...
              </p>
            )}
            {activeChats &&
              activeChats.docs.map((session: any, index: number) => (
                <li
                  key={index}
                  className="block hover:bg-movet-red hover:text-movet-white cursor-pointer"
                >
                  <Link href={`/telehealth/chat/?id=${session.id}`}>
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0 cursor-pointer">
                          <FontAwesomeIcon icon={faCircleUser} size="2x" />
                        </div>
                        <div className="min-w-0 flex flex-row px-8 w-full items-center justify-between">
                          <div className="w-full">
                            {session?.data()?.client?.firstName ? (
                              <p className="text-lg font-bold">
                                {session?.data()?.client?.firstName}{" "}
                                {session?.data()?.client?.lastName}
                              </p>
                            ) : (
                              <p className="italic">Unknown Client</p>
                            )}
                            {mode !== "sidebar" && (
                              <p className="flex-row items-center overflow-hidden italic">
                                &quot;{session?.data()?.question}&quot;
                              </p>
                            )}
                            <p className="md:hidden flex flex-row items-center text-sm">
                              <span className="flex-shrink-0 cursor-pointer mr-2">
                                <FontAwesomeIcon icon={faClockFour} size="sm" />
                              </span>
                              {session?.data()?.updatedOn ? (
                                <time
                                  dateTime={session
                                    ?.data()
                                    ?.updatedOn?.toDate()
                                    ?.toString()}
                                >
                                  {timeSince(
                                    session?.data()?.updatedOn?.toDate(),
                                  )}
                                </time>
                              ) : session?.data()?.createdAt ? (
                                <time
                                  dateTime={session
                                    ?.data()
                                    ?.createdAt?.toDate()
                                    ?.toString()}
                                >
                                  {timeSince(
                                    session?.data()?.createdAt?.toDate(),
                                  )}
                                </time>
                              ) : (
                                <time
                                  dateTime={session
                                    ?.data()
                                    ?.createdOn?.toDate()
                                    ?.toString()}
                                >
                                  {timeSince(
                                    session?.data()?.createdOn?.toDate(),
                                  )}
                                </time>
                              )}
                            </p>
                          </div>
                          <div className="hidden md:flex w-full justify-end">
                            {mode !== "sidebar" && (
                              <p className="flex flex-row justify-center h-full items-center">
                                <span className="flex-shrink-0 cursor-pointer mr-2">
                                  <FontAwesomeIcon
                                    icon={faClockFour}
                                    size="sm"
                                  />
                                </span>
                                {session?.data()?.updatedOn ? (
                                  <time
                                    dateTime={session
                                      ?.data()
                                      ?.updatedOn?.toDate()
                                      ?.toString()}
                                  >
                                    {timeSince(
                                      session?.data()?.updatedOn?.toDate(),
                                    )}
                                  </time>
                                ) : session?.data()?.createdAt ? (
                                  <time
                                    dateTime={session
                                      ?.data()
                                      ?.createdAt?.toDate()
                                      ?.toString()}
                                  >
                                    {timeSince(
                                      session?.data()?.createdAt?.toDate(),
                                    )}
                                  </time>
                                ) : (
                                  <time
                                    dateTime={session
                                      ?.data()
                                      ?.createdOn?.toDate()
                                      ?.toString()}
                                  >
                                    {timeSince(
                                      session?.data()?.createdOn?.toDate(),
                                    )}
                                  </time>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <FontAwesomeIcon icon={faChevronCircleRight} />
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </div>
      {completedChats && completedChats.docs.length > 0 && (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div
            className="group w-full flex flex-row items-center justify-center -mb-4 hover:text-movet-white hover:bg-movet-black hover:cursor-pointer border-t-movet-gray border-t"
            onClick={() => setShowArchive(!showArchive)}
          >
            <div className="hidden group-hover:block">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-movet-green"
                size="sm"
              />
            </div>
            <h2 className="ml-2 text-sm my-3 font-bold">
              {loadingCompletedChats ? "Loading Chats..." : "Archived Chats"}
            </h2>
            <div className="hidden group-hover:block ml-2">
              {showArchive ? (
                <FontAwesomeIcon icon={faCaretDown} size="xs" />
              ) : (
                <FontAwesomeIcon icon={faCaretUp} size="xs" />
              )}
            </div>
          </div>
          {loadingCompletedChats ? (
            <div className="mb-6">
              <Loader height={200} width={200} />
            </div>
          ) : errorCompletedChats ? (
            <div className="px-8 pb-8">
              <Error error={errorCompletedChats} />
            </div>
          ) : (
            <ul
              role="list"
              className="divide-y divide-movet-gray border-t border-movet-gray mt-4"
            >
              {showArchive &&
                completedChats &&
                completedChats.docs.map((session: any, index: number) => (
                  <li
                    key={index}
                    className="block hover:bg-movet-red hover:text-movet-white cursor-pointer"
                  >
                    <Link href={`/telehealth/chat/?id=${session.id}`}>
                      <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                          <div className="flex-shrink-0 cursor-pointer">
                            <FontAwesomeIcon icon={faCircleUser} size="2x" />
                          </div>
                          <div className="min-w-0 flex flex-row px-8 items-center justify-between w-full">
                            <div>
                              {session?.data()?.client?.firstName ? (
                                <p className="text-lg font-bold">
                                  {session?.data()?.client?.firstName}{" "}
                                  {session?.data()?.client?.lastName}
                                </p>
                              ) : (
                                <p className="italic">Unknown Client</p>
                              )}
                              <p className="md:hidden flex flex-row items-center text-sm">
                                <span className="flex-shrink-0 cursor-pointer mr-2">
                                  <FontAwesomeIcon
                                    icon={faClockFour}
                                    size="sm"
                                  />
                                </span>
                                {session?.data()?.updatedOn ? (
                                  <time
                                    dateTime={session
                                      ?.data()
                                      ?.updatedOn?.toDate()
                                      ?.toString()}
                                  >
                                    {timeSince(
                                      session?.data()?.updatedOn?.toDate(),
                                    )}
                                  </time>
                                ) : session?.data()?.createdAt ? (
                                  <time
                                    dateTime={session
                                      ?.data()
                                      ?.createdAt?.toDate()
                                      ?.toString()}
                                  >
                                    {timeSince(
                                      session?.data()?.createdAt?.toDate(),
                                    )}
                                  </time>
                                ) : (
                                  <time
                                    dateTime={session
                                      ?.data()
                                      ?.createdOn?.toDate()
                                      ?.toString()}
                                  >
                                    {timeSince(
                                      session?.data()?.createdOn?.toDate(),
                                    )}
                                  </time>
                                )}
                              </p>
                            </div>
                            <div className="hidden md:block">
                              {mode !== "sidebar" && (
                                <p className="flex flex-row justify-center h-full items-center">
                                  <span className="flex-shrink-0 cursor-pointer mr-2">
                                    <FontAwesomeIcon
                                      icon={faClockFour}
                                      size="sm"
                                    />
                                  </span>
                                  {session?.data()?.updatedOn ? (
                                    <time
                                      dateTime={session
                                        ?.data()
                                        ?.updatedOn?.toDate()
                                        ?.toString()}
                                    >
                                      {timeSince(
                                        session?.data()?.updatedOn?.toDate(),
                                      )}
                                    </time>
                                  ) : session?.data()?.createdAt ? (
                                    <time
                                      dateTime={session
                                        ?.data()
                                        ?.createdAt?.toDate()
                                        ?.toString()}
                                    >
                                      {timeSince(
                                        session?.data()?.createdAt?.toDate(),
                                      )}
                                    </time>
                                  ) : (
                                    <time
                                      dateTime={session
                                        ?.data()
                                        ?.createdOn?.toDate()
                                        ?.toString()}
                                    >
                                      {timeSince(
                                        session?.data()?.createdOn?.toDate(),
                                      )}
                                    </time>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <FontAwesomeIcon icon={faChevronCircleRight} />
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default TelehealthChatSummary;
