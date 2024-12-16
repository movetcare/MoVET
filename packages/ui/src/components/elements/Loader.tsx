/* eslint-disable @typescript-eslint/no-require-imports */
import { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";
import { BlueDog } from "../../assets/animations/blue-dog/BlueDog";
import { Corgi } from "../../assets/animations/corgi/Corgi";
import Image from "next/image";
interface LottieProps {
  isAppMode?: boolean;
  message?: string;
  animationData?: any;
  width?: number;
  height?: number;
}

const getRandomInt = (min: number, max: number) => {
  const minRange = Math.ceil(min);
  const maxRange = Math.floor(max);
  return Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
};

const randomRandomAnimation = () => {
  const randomNumber = getRandomInt(1, 5);
  let backgroundImage = null;
  switch (randomNumber) {
    case 1:
      backgroundImage = require("../../assets/animations/loading_animation_2.json");
      break;
    case 2:
      backgroundImage = require("../../assets/animations/loading_animation_2.json");
      break;
    case 3:
      backgroundImage = require("../../assets/animations/loading_animation_3.json");
      break;
    case 4:
      backgroundImage = require("../../assets/animations/loading_animation_4.json");
      break;
    case 5:
      backgroundImage = require("../../assets/animations/loading_animation_5.json");
      break;
    default:
      backgroundImage = require("../../assets/animations/loading_animation_4.json");
  }
  return backgroundImage;
};

export const Loader = ({
  isAppMode = false,
  message = "Loading, please wait...",
  animationData = randomRandomAnimation(),
  width = 300,
  height = 300,
}: LottieProps) => {
  const element = useRef<HTMLDivElement>(null);
  const lottieInstance = useRef<any>(null);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (element.current) {
      lottieInstance.current = lottie.loadAnimation({
        animationData,
        container: element.current,
      });
    }
  }, [animationData]);

  useEffect(() => {
    setIndex(getRandomInt(1, 7));
  }, []);

  return (
    <div
      className={
        isAppMode
          ? "flex flex-grow items-center justify-center min-h-screen"
          : ""
      }
    >
      <div className={isAppMode ? "flex flex-col" : ""}>
        {isAppMode && (
          <Image
            src="/images/logos/logo.png"
            className="mx-auto"
            width={190}
            height={60}
            alt="MoVET Logo"
            priority
          />
        )}
        <div className="flex flex-grow justify-center items-center overflow-hidden -mt-4">
          {index === 1 ? (
            <BlueDog />
          ) : index === 2 ? (
            <Corgi />
          ) : (
            <div style={{ width, height }} ref={element}></div>
          )}
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-center -mt-10 mb-8">
          {message}
        </h2>
      </div>
    </div>
  );
};
