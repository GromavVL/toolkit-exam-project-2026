import { useState, useEffect } from 'react';

const useCountdown = (targetDate, createdAt) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const end = new Date(targetDate).getTime();
      const distance = end - now;
      const total = end - createdAt;

      if (distance <= 0) {
        setTimeLeft({ expired: true });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);
      const percentPassed = Math.max(
        0,
        Math.min(100, ((total - distance) / total) * 100)
      );

      setTimeLeft({
        expired: false,
        days,
        hours,
        minutes,
        seconds,
        percentPassed,
      });
    };

    tick();
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate, createdAt]);

  return timeLeft;
};

export default useCountdown;
