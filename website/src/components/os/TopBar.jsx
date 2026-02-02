import { useState, useEffect } from "react";
import { Battery, Wifi } from "lucide-react";

export default function TopBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-10 w-full bg-black/20 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 fixed top-0 left-0 z-[100] text-sm font-medium text-white/80 select-none">
      <div className="flex items-center gap-4">
        <span className="font-bold tracking-wider cursor-pointer">
          <span className="text-emerald-400">Chase</span>
          <span className="text-white">OS</span>
        </span>
        <nav className="hidden md:flex items-center gap-3">
          <span className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors cursor-pointer">File</span>
          <span className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors cursor-pointer">Edit</span>
          <span className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors cursor-pointer">View</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-400">System Online</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
        </div>
        <span>{time}</span>
      </div>
    </div>
  );
}
