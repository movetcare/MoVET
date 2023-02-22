import {
  faChevronLeft,
  faChevronRight,
  faCircle,
  faCircleDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { classNames } from "../../utils";

export interface imageInfo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface CarouselProps {
  children: ReactNode[];
  name: string;
  infinite?: boolean;
  autoScroll?: boolean;
  showIndicators?: boolean;
  interval?: number;
  itemsPerRow?: number;
  customClasses?: Partial<CustomClasses>;
  transitionType?: "elastic";
  transitionDuration?: number;
  slideLabels?: string[];
  slideImages?: string[]; //(i: number) => ReactNode;
}
type CustomClasses = {
  parent: string;
  slideContainer: string;
  slide: string;
  leftButton: string;
  rightButton: string;
};

function threshold(target: EventTarget) {
  const width = (target as HTMLElement).clientWidth;
  return width / 5;
}

export const Carousel = ({
  infinite = false,
  autoScroll = false,
  showIndicators = false,
  interval = 5000,
  itemsPerRow = 1,
  children,
  name,
  customClasses = {},
  transitionDuration = 400,
  slideLabels,
  slideImages,
}: CarouselProps) => {
  const [startIndex, setStartIndex] = useState(0);
  const [desiredStartIndex, setDesiredStartIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const invertDirection = useRef(false);
  const { parent, slideContainer, slide, leftButton, rightButton } =
    customClasses;
  const handlers = useSwipeable({
    onSwiping(e) {
      if (e.absX < (e.event.target as HTMLElement).clientWidth) {
        setOffset(e.deltaX);
      }
    },
    onSwiped(e) {
      if (e.event.target !== null) {
        const t = threshold(e.event.target);
        const dir = Math.sign(e.deltaX);
        const d = dir * e.deltaX;
        if (d >= t) {
          dir > 0 ? prev() : next();
        } else {
          setOffset(0);
        }
      }
    },
    delta: 20,
    trackMouse: false,
    trackTouch: true,
  });

  useEffect(() => {
    if (autoScroll) {
      const id = setTimeout(() => next(), interval);
      return () => clearTimeout(id);
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, startIndex]);

  useEffect(() => {
    const id = setTimeout(() => {
      setOffset(NaN);
      setStartIndex(desiredStartIndex);
      if (invertDirection.current) invertDirection.current = false;
    }, transitionDuration);
    return () => clearTimeout(id);
  }, [desiredStartIndex, transitionDuration]);

  const next = () => {
    if (startIndex + 1 >= children.length && infinite) {
      setDesiredStartIndex(0);
      return;
    }
    if (startIndex + itemsPerRow >= children.length && !infinite) {
      return;
    } else {
      setDesiredStartIndex(startIndex + 1);
    }
  };
  const prev = () => {
    if (startIndex === 0) {
      if (infinite) {
        if (children.length <= 2) invertDirection.current = true;
        setDesiredStartIndex(children.length - 1);
        return;
      } else return;
    } else {
      if (children.length <= 2) invertDirection.current = true;
      setDesiredStartIndex(startIndex - 1);
    }
  };

  const sliderStyle = {
    width: `${(100 * (children.length + itemsPerRow + 1)) / itemsPerRow}%`,
    transform: "translateX(0)",
    left: `-${((startIndex + 1) * 100) / itemsPerRow}%`,
  };

  if (startIndex !== desiredStartIndex) {
    const dist = Math.abs(startIndex - desiredStartIndex);
    const wrapping =
      (startIndex === 0 &&
        desiredStartIndex === children.length - 1 &&
        children.length > 2) ||
      (startIndex === children.length - 1 && desiredStartIndex === 0);
    const dir =
      (invertDirection.current ? -1 : 1) *
      (wrapping ? 1 : -1) *
      Math.sign(desiredStartIndex - startIndex);
    let shift = (100 * dir) / (children.length + itemsPerRow + 1);
    if (dist > 1 && !wrapping) {
      shift = shift * dist;
    }
    sliderStyle.transform = `translateX(${shift}%)`;
  } else if (!isNaN(offset)) {
    if (offset !== 0) {
      sliderStyle.transform = `translateX(${offset}px)`;
    }
  }

  const itemWrapper = (item: ReactNode, index: number, pseudo: boolean) => (
    <div
      className={slide ? slide : "w-full flex justify-center"}
      key={
        pseudo
          ? `carousel-${name}-pseudo-item-${index}`
          : `carousel-${name}-item-${index}`
      }
      data-cy={
        pseudo
          ? `carousel-${name}-pseudo-item-${index}`
          : `carousel-${name}-item-${index}`
      }
    >
      {item}
    </div>
  );
  if (children.length > 1) {
    return (
      <div className={classNames(parent, "flex relative")}>
        {slideImages && (
          <div className="relative w-5/12 flex justify-center items-end">
            {slideImages.map((image, i) => {
              return (
                <Transition
                  key={i}
                  show={
                    startIndex === desiredStartIndex
                      ? startIndex === i
                      : desiredStartIndex === i
                  }
                  enter="transition ease-in duration-300 absolute bottom-0"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition ease-in duration-300 "
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  className="min-w-[12rem]"
                >
                  <Image
                    src={image}
                    alt={name + "-image"}
                    className="rounded-full"
                    height={300}
                    width={300}
                  />
                </Transition>
              );
            })}
          </div>
        )}
        <div className={classNames(slideImages ? "w-7/12" : "w-full")}>
          <div className="hidden sm:ml-[12.5%] sm:block mb-6">
            {slideLabels?.map((label, i) => (
              <p
                key={label}
                className={classNames(
                  desiredStartIndex === i ||
                    (desiredStartIndex !== startIndex &&
                      desiredStartIndex === i)
                    ? "text-movet-yellow"
                    : "text-movet-gray hover:text-movet-yellow hover:text-opacity-40",
                  "font-semibold cursor-pointer text-lg italic"
                )}
                onClick={() => {
                  setDesiredStartIndex(i);
                }}
              >
                {label.toUpperCase()}
              </p>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="grow min-w-min flex justify-center">
              <button
                aria-label="Advance Carousel Button"
                className={classNames(
                  leftButton,
                  !infinite &&
                    (startIndex === 0 || desiredStartIndex === 0) &&
                    (startIndex === desiredStartIndex ||
                      desiredStartIndex < startIndex) &&
                    "invisible cursor-default",
                  "px-2"
                )}
                data-cy={`carousel-${name}-next-button`}
                onClick={() => {
                  prev();
                }}
              >
                <div>
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    size="lg"
                    className="text-movet-yellow w-4 hover:text-movet-brown ease-in-out duration-500"
                  />
                </div>
              </button>
            </div>
            <div className={classNames(slideContainer, "overflow-x-hidden")}>
              <div
                style={{
                  ...sliderStyle,
                  transitionDuration:
                    startIndex !== desiredStartIndex || offset === 0
                      ? transitionDuration + "ms"
                      : undefined,
                }}
                className={classNames(
                  (startIndex !== desiredStartIndex || offset === 0) &&
                    "transition-transform",
                  "inline-flex relative"
                )}
                {...handlers}
              >
                <>
                  {itemWrapper(
                    children[children.length - 1],
                    children.length - 1,
                    true
                  )}
                  {children.map((item, index) =>
                    itemWrapper(item, index, false)
                  )}
                  {children
                    .slice(0, itemsPerRow)
                    .map((item, index) => itemWrapper(item, index, true))}
                </>
              </div>
            </div>
            <div className="grow min-w-min flex justify-center">
              <button
                aria-label="Advance Carousel Button"
                className={classNames(
                  rightButton,
                  !infinite &&
                    (startIndex === children.length - 1 ||
                      desiredStartIndex === children.length - 1) &&
                    (startIndex === desiredStartIndex ||
                      desiredStartIndex > startIndex) &&
                    "invisible cursor-default",
                  "px-2"
                )}
                data-cy={`carousel-${name}-next-button`}
                onClick={() => {
                  next();
                }}
              >
                <FontAwesomeIcon
                  icon={faChevronRight}
                  size="1x"
                  className="text-movet-yellow w-4 hover:text-movet-brown ease-in-out duration-500"
                />
              </button>
            </div>
          </div>
          {showIndicators && (
            <div className="flex items-center justify-center space-x-1 mt-6">
              {children.map((_, index) => {
                if (
                  startIndex !== desiredStartIndex
                    ? index === desiredStartIndex
                    : index === startIndex
                ) {
                  return (
                    <FontAwesomeIcon
                      key={`indicator-${index}`}
                      icon={faCircleDot}
                      color="gray"
                      size="1x"
                    />
                  );
                } else if (
                  infinite ||
                  index < children.length - itemsPerRow + 1
                ) {
                  return (
                    <FontAwesomeIcon
                      key={`indicator-${index}`}
                      icon={faCircle}
                      color="gray"
                      size="1x"
                      className="cursor-pointer"
                      onClick={() => {
                        setDesiredStartIndex(index);
                      }}
                    />
                  );
                } else return <></>;
              })}
            </div>
          )}
        </div>
      </div>
    );
  } else if (children.length === 1) return <div>{children[0]}</div>;
  else return <div></div>;
};
