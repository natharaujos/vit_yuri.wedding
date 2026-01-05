import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: Date | string;
};

function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="mt-6 text-xl font-medium">
      Faltam {timeLeft.days} dias, {timeLeft.hours}h e {timeLeft.minutes}min
    </div>
  );
}

export default Countdown;
