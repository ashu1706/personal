import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({
  targetDate,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isCompleted: true,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isCompleted: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const padZero = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  const timerItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  if (timeLeft.isCompleted) {
    return (
      <div
        className="flex flex-col items-center justify-center space-y-3 bg-white/70 backdrop-blur-md border border-romantic-200 rounded-2xl p-6 shadow-md max-w-md mx-auto text-center"
        id="countdown-completed"
      >
        <Heart className="h-10 w-10 text-romantic-500 fill-romantic-300 heartbeat-sync" />

        <h3 className="font-display text-2xl text-romantic-600 font-bold">
          The Magic Moment is Here!
        </h3>

        <p className="font-sans text-sm text-gray-600">
          I can't wait to hold your hand and celebrate our love tonight.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center space-y-4"
      id="countdown-timer-container"
    >

      {/* Timer */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {timerItems.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm border border-pink-150 rounded-2xl w-18 h-18 sm:w-22 sm:h-22 shadow-lg transition-transform hover:scale-105"
            id={`timer-unit-${item.label.toLowerCase()}`}
          >
            <span className="font-serif text-3xl sm:text-4xl text-romantic-500 font-semibold tracking-tight">
              {padZero(item.value)}
            </span>

            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-romantic-400 font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Romantic Text */}
      <p className="font-serif italic text-sm text-romantic-500 flex items-center gap-1.5 animate-pulse text-center px-4">
        <Heart className="h-3 w-3 text-romantic-500 fill-romantic-500" />
        Every second feels like forever when all I want is to hold your hand
        and be with you.
      </p>
    </div>
  );
}