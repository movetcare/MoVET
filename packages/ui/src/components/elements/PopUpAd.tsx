import {
  faBell,
  faBullhorn,
  faExclamationCircle,
  faIcons,
  faInfoCircle,
  faStar,
  faTags,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, Fragment, useEffect } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { usePopper } from "react-popper";
import { useRouter } from "next/router";
import type { PopUpAd as PopUpAdType } from "types";

export const PopUpAd = ({
  icon = "bullhorn",
  title = "New Offers & Deals @ MoVET",
  description,
  autoOpen = true,
  adComponent,
  ignoreUrlPath,
}: PopUpAdType) => {
  const router = useRouter();
  const { mode } = router.query || {};
  const [referenceElement, setReferenceElement] = useState<any>();
  const [popperElement, setPopperElement] = useState<any>();
  const { styles, attributes } = usePopper(referenceElement, popperElement);
  const [showModal, setShowModal] = useState<boolean | null>(null);
  const popUpIcon =
    icon === "bullhorn"
      ? faBullhorn
      : icon === "exclamation-circle"
      ? faExclamationCircle
      : icon === "bell"
      ? faBell
      : icon === "star"
      ? faStar
      : icon === "info-circle"
      ? faInfoCircle
      : icon === "tags"
      ? faTags
      : faIcons;

  useEffect(() => {
    if (
      (localStorage &&
        localStorage.getItem("showPopUpAd") === "false" &&
        showModal === null) ||
      window.location.pathname === ignoreUrlPath ||
      window.location.pathname.includes("contact") ||
      (mode && mode === "app")
    ) {
      setShowModal(false);
    } else if (showModal === null) setShowModal(autoOpen);
  }, [showModal, autoOpen, ignoreUrlPath, mode]);

  useEffect(() => {
    if (showModal === false) localStorage.setItem("showPopUpAd", "false");
  }, [showModal]);
  return mode !== "app" ? (
    <>
      {showModal === false ? (
        <Popover>
          {({ open }: any) => (
            <>
              <Popover.Button
                ref={setReferenceElement}
                title={title}
                className="fixed z-50 bottom-4 sm:bottom-10 sm:right-8 right-4 bg-movet-tan w-12 h-12 sm:w-16 sm:h-16 rounded-full drop-shadow-lg flex justify-center items-center text-movet-brown hover:text-movet-white text-2xl sm:text-3xl hover:bg-movet-red hover:drop-shadow-2xl duration-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-movet-brown"
              >
                <FontAwesomeIcon icon={popUpIcon} size="sm" />
              </Popover.Button>
              <Popover.Overlay className="fixed inset-0 bg-movet-black opacity-30 z-50" />
              <Transition
                show={open}
                enter="transition ease-in duration-250"
                leave="transition ease-out duration-250"
                leaveTo="opacity-10"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leaveFrom="opacity-100"
                className="z-50"
              >
                <Popover.Panel
                  ref={setPopperElement}
                  style={styles.popper}
                  {...attributes.popper}
                  className="z-50 px-8 mb-8"
                >
                  {({ close }: any) => (
                    <div className="flex flex-col">
                      <div className="flex w-full justify-end" onClick={close}>
                        <FontAwesomeIcon
                          icon={faTimes}
                          size="sm"
                          className="text-movet-white h-4 w-4 bg-movet-black rounded-full p-3 -mt-4 -mr-4 fixed z-50 hover:bg-movet-red cursor-pointer duration-300"
                        />
                      </div>
                      <div onClick={close}>{adComponent}</div>
                    </div>
                  )}
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      ) : (
        <Transition
          show={showModal === true}
          enter="transition ease-in duration-250"
          leave="transition ease-out duration-250"
          leaveTo="opacity-10"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          as={Fragment}
        >
          <Dialog
            open={showModal === true}
            onClose={() => setShowModal(false)}
            className="relative z-50"
          >
            <div
              className="fixed inset-0 bg-movet-black opacity-30"
              aria-hidden="true"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-transparent">
                <div className="flex flex-col">
                  <Dialog.Title className="hidden">{title}</Dialog.Title>
                  <Dialog.Description className="hidden">
                    {description}
                  </Dialog.Description>
                  <div
                    className="flex w-full justify-end"
                    onClick={() => setShowModal(false)}
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      size="sm"
                      className="text-movet-white h-4 w-4 bg-movet-black rounded-full p-3 -mt-4 -mr-4 fixed z-50 hover:bg-movet-red cursor-pointer duration-300"
                    />
                  </div>
                  <div onClick={() => setShowModal(false)}>{adComponent}</div>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  ) : (
    <></>
  );
};
