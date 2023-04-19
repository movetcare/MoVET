import { useRouter } from "next/router";
import {
  collection,
  doc,
  query as firestoreQuery,
  orderBy,
  serverTimestamp,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { Tooltip } from "react-tooltip";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { Loader } from "ui";
import { firestore, functions } from "services/firebase";
import {
  faCircleExclamation,
  faCircleXmark,
  faDoorClosed,
  faPaperPlane,
  faUserCircle,
  faIdBadge,
  faSms,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import environment from "utils/environment";
import { useEffect, useRef, useState } from "react";
import { uuid } from "utils/uuid";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { timeSince } from "utils/timeSince";
import TelehealthChatSummary from "components/TelehealthChatSummary";
import Image from "next/image";
import "react-tooltip/dist/react-tooltip.css";
import { httpsCallable } from "firebase/functions";
interface ChatMessage {
  _id: string;
  createdAt: any;
  startNewThread?: boolean;
  text: string;
  user: {
    _id: string;
    avatar?: string | null;
    name?: string | null;
  };
}

const ChatSession = () => {
  const router = useRouter();
  const { query } = router;
  const messagesEndRef: any = useRef(null);
  const [didEndChat, setDidEndChat] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, loadingMessages, errorMessages] = useCollection(
    firestoreQuery(
      collection(firestore, `telehealth_chat/${query?.id}/log`),
      orderBy("createdAt", "asc")
    )
  );
  const [session, loadingSession, errorSession] = useDocument(
    doc(firestore, `telehealth_chat/${query?.id}`)
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, isDirty, errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages]
  );

  useEffect(() => {
    if (
      session &&
      session.data()?.status === "complete" &&
      session.data()?.endedBy === "client" &&
      !didEndChat
    ) {
      toast(
        `${session.data()?.client?.firstName} ${
          session.data()?.client?.lastName
        } ended chat session`,
        {
          icon: <FontAwesomeIcon icon={faDoorClosed} size="sm" />,
        }
      );
      setDidEndChat(true);
    } else if (
      session &&
      session.data()?.status === "complete" &&
      session.data()?.endedBy === "movet" &&
      !didEndChat
    ) {
      toast(
        `Telehealth Chat Session Ended ${
          session && `w/ ${session.data()?.client?.firstName}`
        } ${session && session.data()?.client?.lastName}`,
        {
          icon: <FontAwesomeIcon icon={faDoorClosed} size="sm" />,
        }
      );
      setDidEndChat(true);
    }
  }, [session, router, didEndChat]);

  const endTelehealthChatSession = async () => {
    setIsLoading(true);
    await updateDoc(doc(firestore, `telehealth_chat/${query?.id}`), {
      updatedOn: serverTimestamp(),
      status: "complete",
      endedBy: "movet",
    })
      .catch((error: any) =>
        toast(error?.message, {
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              className="text-movet-red"
            />
          ),
        })
      )
      .finally(() => {
        router.query.mode !== "embed" && router.push("/telehealth");
      });
  };

  const onSubmit = async (data: { message: string }) =>
    await addDoc(
      collection(doc(firestore, "telehealth_chat", `${query?.id}`), "log"),
      {
        _id: uuid(),
        createdAt: serverTimestamp(),
        text: data?.message,
        user: {
          _id: "0",
          name: "MoVET",
          avatar: "https://movetcare.com/images/logo/logo-paw-black.png",
        },
      } as ChatMessage
    )
      .then(() => reset())
      .then(
        async () =>
          await updateDoc(doc(firestore, "telehealth_chat", `${query?.id}`), {
            status: "active",
          })
      )
      .catch((error: any) =>
        toast(error?.message, {
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              className="text-movet-red"
            />
          ),
        })
      );

  const sendSmsToClient = async () => {
    toast(
      `Sending SMS to Client...\n\n"You have received a new message from MoVET!\n\n"${
        messages &&
        messages.docs.length &&
        messages.docs[messages.docs.length - 1]?.data()?.text
      }"\n\nPlease do not reply to this message. Use the MoVET app if you have any follow ups or questions.\n\nhttps://movetcare.com/get-the-app"`,
      {
        duration: 3500,
        position: "top-center",
        icon: (
          <FontAwesomeIcon
            icon={faSms}
            size="lg"
            className="text-movet-yellow"
          />
        ),
      }
    );
    await httpsCallable(
      functions,
      "sendChatMessageAsSms"
    )({
      email: session?.data()?.client?.email,
      message: `"You have received a new message from MoVET!\n\n"${
        messages &&
        messages.docs.length &&
        messages.docs[messages.docs.length - 1]?.data()?.text
      }"\n\nPlease do not reply to this message. Use the MoVET app if you have any follow ups or questions.\n\nhttps://movetcare.com/get-the-app"`,
    })
      .then(() =>
        toast(`SMS to client was sent!`, {
          position: "top-center",
          icon: (
            <FontAwesomeIcon
              icon={faSms}
              size="lg"
              className="text-movet-green"
            />
          ),
        })
      )
      .catch((error: any) =>
        toast(error?.message, {
          position: "top-center",
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              className="text-movet-red"
            />
          ),
        })
      );
  };

  return (
    <div className="flex flex-col md:flex-row">
      {router.query.mode !== "embed" && (
        <div className="flex flex-col mb-8 md:mb-0 justify-between bg-transparent md:bg-white shadow overflow-hidden rounded-lg w-full md:w-1/3">
          <TelehealthChatSummary mode="sidebar" />
        </div>
      )}
      <div
        className={`flex flex-col lg:pb-8 lg:pt-4 justify-between bg-white shadow overflow-hidden rounded-lg text-movet-black w-full${
          router.query.mode !== "embed" ? " md:ml-8" : ""
        }`}
        style={{ height: "80vh" }}
      >
        {session &&
        !loadingSession &&
        !errorSession &&
        !loadingMessages &&
        !errorMessages &&
        messages ? (
          <>
            <div className="flex sm:items-center justify-between md:pb-6 border-b border-movet-gray px-8 py-4">
              <div className="flex items-center space-x-4">
                <Image
                  src="/images/logo/logo-paw-black.png"
                  alt=""
                  className="hidden md:block w-10 sm:w-16 h-10 sm:h-16 mr-4"
                  priority
                  height={50}
                  width={50}
                />
                <div className="flex flex-col leading-tight">
                  {session.data()?.client && (
                    <div className="text-xl mt-1 flex items-center">
                      <span className=" mr-3">
                        {session.data()?.client?.firstName}{" "}
                        {session.data()?.client?.lastName}
                      </span>
                    </div>
                  )}
                  {session.data()?.question ? (
                    <span className="italic text-sm hidden sm:inline-block">
                      Question: &quot;{session.data()?.question}&quot;
                    </span>
                  ) : (
                    <>
                      <span className="italic">
                        This client has never used chat!
                      </span>
                      <span className="italic mt-2 text-xs">
                        Instruct them to{" "}
                        <a
                          href="https://movetcare.com/get-the-app"
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:text-movet-red"
                        >
                          download the app
                        </a>{" "}
                        and &quot;Ask a Question&quot; to start
                      </span>
                    </>
                  )}
                  {session?.data() && (
                    <>
                      <span className="hidden sm:flex sm:flex-row items-center text-xs mt-1 italic ">
                        Asked:&nbsp;
                        {session?.data()?.createdAt?.toDate()?.toString() ? (
                          <time
                            dateTime={session
                              ?.data()
                              ?.createdAt?.toDate()
                              ?.toString()}
                          >
                            {timeSince(session?.data()?.createdAt?.toDate())}
                          </time>
                        ) : (
                          <time
                            dateTime={session
                              ?.data()
                              ?.createdOn?.toDate()
                              ?.toString()}
                          >
                            {timeSince(session?.data()?.createdOn?.toDate())}
                          </time>
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Tooltip id="sendSmsToClient" />
                <div
                  data-tooltip-id="sendSmsToClient"
                  data-tooltip-content="Send last chat message as SMS to Client"
                  title="Send last message as SMS to Client"
                  className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                  onClick={() => sendSmsToClient()}
                >
                  <FontAwesomeIcon icon={faSms} size="lg" />
                </div>
                <Tooltip id="clientVerification" />
                <a
                  data-tooltip-id="clientVerification"
                  data-tooltip-content="View Client Account"
                  title="View Client Account"
                  href={
                    environment === "production"
                      ? `https://admin.movetcare.com/client/?id=${query?.id}`
                      : `http://localhost:3002/client/?id=${query?.id}`
                  }
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faIdBadge} size="lg" />
                </a>
                {router.query.mode !== "embed" && (
                  <>
                    <Tooltip id="endChat" />
                    <div
                      data-tooltip-id="endChat"
                      data-tooltip-content="End Client Chat - This will send them an email of the chat log!"
                      title="End Client Chat - This will send them an email of the chat log!"
                      onClick={() => endTelehealthChatSession()}
                      className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red text-movet-yellow"
                    >
                      <FontAwesomeIcon icon={faCircleXmark} size="lg" />
                    </div>
                  </>
                )}
              </div>
            </div>
            {!isLoading ? (
              <>
                <div
                  id="messages"
                  className="flex flex-col space-y-4 px-3 py-6 overflow-y-auto scroll-smooth text-movet-black md:px-8"
                >
                  {!session.data()?.question && (
                    <div className="chat-message">
                      <div className={"flex items-center justify-center"}>
                        <div
                          className={
                            "flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-center"
                          }
                        >
                          <div
                            className={
                              "flex flex-col px-4 py-2 rounded-md text-base bg-movet-black bg-opacity-95"
                            }
                          >
                            <span className="text-movet-red italic uppercase">
                              Chat messages will NOT be seen until the client
                              has downloaded the app and asked a question
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {messages &&
                    messages.docs.length > 0 &&
                    messages.docs.map((message: any) => (
                      <div key={message.data()?._id} className="chat-message">
                        <div
                          className={`flex items-end${
                            message.data()?.user?._id === session.id
                              ? ""
                              : " justify-end"
                          }`}
                        >
                          <div
                            className={`flex flex-col space-y-2 text-xs max-w-xs mx-2${
                              message.data()?.user?._id === session.id
                                ? " order-2 items-start"
                                : " order-1 items-end"
                            }`}
                          >
                            <div
                              className={`flex flex-col px-4 py-2 rounded-lg bg-opacity-25 text-base${
                                message.data()?.user?._id === session.id
                                  ? " bg-movet-gray  rounded-bl-none"
                                  : " bg-movet-red  rounded-br-none "
                              }`}
                            >
                              <span> {message.data()?.text}</span>
                              <span className="text-xs">
                                {message
                                  .data()
                                  ?.createdAt?.toDate()
                                  .toLocaleString("en-US", {
                                    hour12: true,
                                  })}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`w-6 h-6 ${
                              message.data()?.user?._id === session.id
                                ? "order-1"
                                : "order-2"
                            }`}
                          >
                            {message.data()?.user?._id === session.id ? (
                              <FontAwesomeIcon icon={faUserCircle} size="lg" />
                            ) : (
                              <Image
                                src="/images/logo/logo-paw-black.png"
                                className="h-6 w-6"
                                alt="MoVET"
                                priority
                                height={20}
                                width={20}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="border-t border-movet-gray pt-4 mb-0 px-4 md:px-8">
                  <form
                    onSubmit={handleSubmit(onSubmit as any)}
                    className="relative flex"
                  >
                    <textarea
                      placeholder={
                        session.data()?.question
                          ? "Write Something..."
                          : "This message will not be seen until the client downloads the MoVET mobile app"
                      }
                      className="flex items=center w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 pl-8 pr-12 bg-white rounded-full mb-4 lg:-mb-4 h-18 md:h-11"
                      {...register("message", { required: true })}
                    />
                    <div className="absolute right-0 items-center inset-y-0">
                      {/* <div className="cursor-pointer inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none">
                  <FontAwesomeIcon icon={faPaperclip} size="lg" />
                </div> */}
                      <button
                        type="submit"
                        disabled={!isDirty || isSubmitting || !isValid}
                        className={
                          !isDirty || isSubmitting || !isValid
                            ? "inline-flex items-center justify-center rounded-full h-10 w-10 text-movet-gray focus:outline-none mr-1 mt-3 md:mt-0"
                            : "cursor-pointer inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-movet-black hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none mr-1 mt-3 md:mt-0"
                        }
                      >
                        <FontAwesomeIcon icon={faPaperPlane} size="lg" />
                      </button>
                    </div>
                  </form>
                  {errors.message && (
                    <div className="text-movet-red text-center italic text-sm mt-4">
                      <span>A message is required...</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Loader />
            )}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default ChatSession;
