import { redis } from "@/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";

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

export const app = new Elysia({ prefix: "/api" }).use(rooms);

export const GET = app.fetch;
export const POST = app.fetch;
export type App = typeof app;
