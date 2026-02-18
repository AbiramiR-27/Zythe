import { useEffect, useState } from "react";

export const CountdownTimer = ({ deadline }: { deadline: string }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(deadline)), 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (timeLeft.total <= 0) {
    return <span className="text-sm font-semibold text-destructive">Ended</span>;
  }

  return (
    <div className="flex gap-2 text-center">
      {[
        { label: "D", value: timeLeft.days },
        { label: "H", value: timeLeft.hours },
        { label: "M", value: timeLeft.minutes },
        { label: "S", value: timeLeft.seconds },
      ].map((unit) => (
        <div key={unit.label} className="flex flex-col items-center rounded-lg bg-muted px-3 py-2 min-w-[3rem]">
          <span className="text-lg font-bold tabular-nums">{String(unit.value).padStart(2, "0")}</span>
          <span className="text-[10px] font-medium text-muted-foreground">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

function getTimeLeft(deadline: string) {
  const total = new Date(deadline).getTime() - Date.now();
  return {
    total,
    days: Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24))),
    hours: Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24)),
    minutes: Math.max(0, Math.floor((total / (1000 * 60)) % 60)),
    seconds: Math.max(0, Math.floor((total / 1000) % 60)),
  };
}
