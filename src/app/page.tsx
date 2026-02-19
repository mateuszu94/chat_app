"use client";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { compileFunction } from "vm";
const ANIMALS = [
  "Jaskułka",
  "miś",
  "Jeleń",
  "Dzik",
  "Kaczka",
  "Sowa",
  "Wielbłąd",
];
const STORAGE_KEY = "chat_userName";
const generateUserName = () => {
  const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${word}-${nanoid(5)}`;
};

export default function Home() {
  const [userName, setUserName] = useState("");
  const [ttl, setTtl] = useState(600);
  const router = useRouter();

  const increment = () => setTtl((v) => Math.min(v + 60, 3600));
  const decrement = () => setTtl((v) => Math.max(v - 60, 60));
  useEffect(() => {
    const main = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUserName(stored);
        return;
      }
      const generate = generateUserName();
      localStorage.setItem(STORAGE_KEY, generate);
      setUserName(generate);
    };
    main();
  }, []);

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post();
      if (res.status == 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">
            {"< "}Prywatny_Chat{" />"}
          </h1>
          <p className="text-zinc-500 text-sm">
            {" "}
            Prywatny samoniszczący sie chat
          </p>
        </div>
        <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-zinc-500">
                Twoja Toszsamość
              </label>
              <div className="flex  items-center gap-3">
                <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-400 font-mono">
                  {userName}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 items-end">
              <button
                onClick={() => createRoom()}
                className="bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Stwórz bezpieczny pokój
              </button>

              <div className="flex flex-col items-center">
                <label className="text-sm text-zinc-500 mb-1 text-center">
                  Czas trwania (sekundy)
                </label>

                <div className="relative flex items-center max-w-[9rem] rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={decrement}
                    className="border rounded-l-3xl px-3 h-10 hover:text-green-500 hover:border-white "
                  >
                    −
                  </button>

                  <input
                    type="number"
                    value={ttl}
                    onChange={(e) => setTtl(Number(e.target.value))}
                    className="h-10 w-full text-center border-y  text-center"
                  />

                  <button
                    type="button"
                    onClick={increment}
                    className="border rounded-r-3xl px-3 h-10 hover:text-green-500 hover:border-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
