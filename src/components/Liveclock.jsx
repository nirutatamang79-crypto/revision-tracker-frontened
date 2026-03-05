import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

export default function LiveClock() {
  const fmt = () => DateTime.now().setZone('Asia/Kathmandu').toFormat("cccc, dd LLL yyyy  •  HH:mm");
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15_000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="font-mono text-xs text-muted tracking-widest uppercase">
      {time} <span className="text-amber">NPT</span>
    </div>
  );
}
