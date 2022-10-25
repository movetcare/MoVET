import { useEffect, useRef } from "react";
import lottie from "lottie-web";

interface LottieProps {
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
      backgroundImage = require("../../animations/loading_animation_2.json");
      break;
    case 2:
      backgroundImage = require("../../animations/loading_animation_2.json");
      break;
    case 3:
      backgroundImage = require("../../animations/loading_animation_3.json");
      break;
    case 4:
      backgroundImage = require("../../animations/loading_animation_4.json");
      break;
    case 5:
      backgroundImage = require("../../animations/loading_animation_5.json");
      break;
    default:
      backgroundImage = require("../../animations/loading_animation_4.json");
  }
  return backgroundImage;
};

export const Loader = ({
  message = "Loading, please wait...",
  animationData = randomRandomAnimation(),
  width = 300,
  height = 300,
}: LottieProps) => {
  const element = useRef<HTMLDivElement>(null);
  const lottieInstance = useRef<any>();

  useEffect(() => {
    if (element.current) {
      lottieInstance.current = lottie.loadAnimation({
        animationData,
        container: element.current,
      });
    }
  }, [animationData]);

  return (
    <>
      <div className="flex flex-grow justify-center items-center overflow-hidden -mt-8">
        <div style={{ width, height }} ref={element}></div>
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight text-center -mt-10 mb-8">
        {message}
      </h2>
    </>
  );
};
