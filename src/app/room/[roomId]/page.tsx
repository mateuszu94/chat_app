"use client";

import { useParams } from "next/navigation";
import { useRef, useState } from "react";

function formatTimeRemaning(seconds: number) {
  const min = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${min}: ${secs.toString().padStart(2, "0")}`;
}

const Page = () => {
  const param = useParams();
  const roomId = param.roomId as string;
  const [coppyStatus, setCoppyStatus] = useState(false);
  const [imput, setiImput] = useState("");
  const InputRef = useRef<HTMLInputElement>(null);

  const coppyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCoppyStatus(true);
    setTimeout(() => setCoppyStatus(false), 2000);
  };

  const [timeRemaning, settimeRemaning] = useState<number | null>(50);
  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden">
      <header className="border-b- border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">Room ID</span>
            <div className="flex items-center gap-2">
              {" "}
              <div className="font-bold text-green-500"> {roomId}</div>
              <button
                onClick={() => {
                  coppyLink();
                }}
                className={`text-[10px]  ${coppyStatus ? "bg-zinc-700 text-zinc-200" : "bg-zinc-800 text-zinc-400"} hover:bg-zinc-700 px-2 py-0.5 rounded  hover:text-zinc-200 transition-colors`}
              >
                {coppyStatus ? "Skopiowane" : "Skopiuj"}
              </button>
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <span className="tex-xs text-zinc-500 uppercase">Room skończony</span>
          <span
            className={`text-sm font-bold flex items-center gap-2 ${
              timeRemaning !== null
                ? timeRemaning < 60
                  ? "text-red-500"
                  : timeRemaning < 120
                    ? "text-yellow-500"
                    : "text-green-500"
                : "text-green-500"
            }`}
          >
            {timeRemaning !== null ? formatTimeRemaning(timeRemaning) : "--:--"}
          </span>
        </div>
        <button className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50">
          <span className="group-hover:animate-pulse">💥</span>
          Zakończ pokój
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin "></div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <div className="flex gap-4 ">
          <div className="flex-1 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
              {">"}
            </span>
            <input
              value={imput}
              onChange={(e) => setiImput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && imput.trim()) {
                  // send
                  InputRef.current?.focus();
                }
              }}
              autoFocus
              type="text"
              placeholder="Wiadomość..."
              className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-4 pl-8 pr-4 text-sm"
            ></input>
          </div>
          <button className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            Wyślij
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;
