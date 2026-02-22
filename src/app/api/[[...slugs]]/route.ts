import { redis } from "@/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import { authMiddleware } from "./auth";
import { z } from "zod";
import { Message, realtime } from "@/lib/realtime";
const ROOM_TTL_SEC = 60 * 10;
const MAX_TTL = 60 * 60;
const rooms = new Elysia({ prefix: "/room" }).post(
  "/create",
  async ({ query }) => {
    const roomId = nanoid();

    const ttU = Number(query.ttl);

    const ttl =
      !ttU || isNaN(ttU) ? ROOM_TTL_SEC : Math.min(Math.max(ttU), MAX_TTL);

    await redis.hset(`meta:${roomId}`, {
      connected: [],
      createdAt: Date.now(),
    });

    await redis.expire(`meta:${roomId}`, ttl);

    return { roomId };
  },
);

const messages = new Elysia({ prefix: "/messages" }).use(authMiddleware).post(
  "/",
  async ({ auth, body }) => {
    const { sender, text } = body;
    const { roomId } = auth;

    const roomExists = await redis.exists(`meta:${roomId}`);
    if (!roomExists) {
      throw new Error("Pokuj nie istnieje");
    }

    const message: Message = {
      id: nanoid(),
      sender,
      text,
      timeStamp: Date.now(),
      roomId,
    };

    // dodaj do historji
    await redis.rpush(`messages:${roomId}`, {
      ...message,
      token: auth.token,
    });
    await realtime.channel(roomId).emit("chat.message", message);

    // usun po czasie
    const remaining = await redis.ttl(meta:${roomId});
  },
  {
    query: z.object({ roomId: z.string() }),
    body: z.object({
      sender: z.string().max(100),
      text: z.string().max(1000),
    }),
  },
);
export const app = new Elysia({ prefix: "/api" }).use(rooms);

export const GET = app.fetch;
export const POST = app.fetch;
export type App = typeof app;
