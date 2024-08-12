import { useState, useEffect } from "react";
import { ItalicText } from "./themed";
import tw from "tailwind";

export const CountdownTimer = ({
  targetDate,
  style,
}: {
  targetDate: Date;
  style: any;
}) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  function calculateTimeRemaining() {
    const difference = (targetDate as any) - (new Date() as any);

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return (
    <ItalicText style={style} noDarkMode>
      Starts in {timeRemaining.hours}h {timeRemaining.minutes}m
    </ItalicText>
  );
};
