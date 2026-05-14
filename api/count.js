import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const KEY = "youren:download_count";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const count = (await redis.get(KEY)) || 0;
      return res.status(200).json({ count: Number(count) });
    }

    if (req.method === "POST") {
      const count = await redis.incr(KEY);
      return res.status(200).json({ count: Number(count) });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Download count error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
