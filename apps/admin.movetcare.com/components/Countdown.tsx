import React from 'react';

interface ICountdown {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export const Countdown = ({
  hours = 0,
  minutes = 0,
  seconds = 60,
}: ICountdown) => {
  const [time, setTime] = React.useState<ICountdown>({
    hours,
    minutes,
    seconds,
  });

  const tick = () => {
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) reset();
    else if (time.hours === 0 && time.seconds === 0) {
      setTime({ hours: time.hours - 1, minutes: 59, seconds: 59 });
    } else if (time.seconds === 0) {
      setTime({
        hours: time.hours,
        minutes: (time?.minutes as number) - 1,
        seconds: 59,
      });
    } else {
      setTime({
        hours: time.hours,
        minutes: time.minutes,
        seconds: (time?.seconds as number) - 1,
      });
    }
  };

  const reset = () =>
    setTime({
      hours: time.hours,
      minutes: time.minutes,
      seconds: time.seconds,
    });

  React.useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  return hours !== 0 && minutes !== 0 ? (
    <span>{`${(time?.hours as number).toString().padStart(2, '0')}:${(
      time?.minutes as number
    )
      .toString()
      .padStart(2, '0')}:${(time?.seconds as number)
      .toString()
      .padStart(2, '0')}`}</span>
  ) : minutes !== 0 ? (
    <span>{`${(time?.minutes as number).toString().padStart(2, '0')}:${(
      time?.seconds as number
    )
      .toString()
      .padStart(2, '0')}`}</span>
  ) : (
    <span>{`${(time?.seconds as number).toString().padStart(2, '0')}`}</span>
  );
};
