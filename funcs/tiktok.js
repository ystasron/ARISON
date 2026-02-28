const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Compiled once at module load
const TIKTOK_REGEX = /https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com\/[^\s]+/;
const LIMIT = 45 * 1024 * 1024; // 45MB

const dir = path.join(__dirname, "..", "temp", "tiktok");
fs.mkdirSync(dir, { recursive: true }); // idempotent, no existsSync needed

const cleanup = (filePath) => fs.rm(filePath, () => {});

module.exports = async function (psid, callSendAPI, text) {
  const match = text.match(TIKTOK_REGEX);
  if (!match) return;

  const link = match[0];
  const filePath = path.join(dir, `${Date.now()}.mp4`);

  try {
    const { data } = await axios.get(
      `https://tikdownpro.vercel.app/api/download?url=${encodeURIComponent(link)}`,
    );

    if (
      !data ||
      data.status !== true ||
      !Array.isArray(data.video) ||
      !data.video[0]
    ) {
      throw new Error("Invalid API response structure");
    }

    const videoUrl = data.video[0];

    const response = await axios({
      method: "get",
      url: videoUrl,
      responseType: "stream",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://www.tiktok.com/",
      },
    });

    // Stream to disk with early size abort — avoids downloading oversized files
    await new Promise((resolve, reject) => {
      let totalBytes = 0;
      const writer = fs.createWriteStream(filePath);

      response.data.on("data", (chunk) => {
        totalBytes += chunk.length;
        if (totalBytes > LIMIT) {
          writer.destroy();
          response.data.destroy();
          reject(new Error("FILE_TOO_LARGE"));
        }
      });

      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    await callSendAPI(psid, {
      attachment: { type: "video", payload: {} },
      filedata: filePath,
    });

    cleanup(filePath);
  } catch (err) {
    cleanup(filePath);
    console.error("TikTok Handler Error:", err.message);

    if (err.message === "FILE_TOO_LARGE") {
      return callSendAPI(psid, {
        text: "❌ Video is too large to send via Messenger (45MB limit).",
      });
    }

    callSendAPI(psid, {
      text: "❌ Unable to download this TikTok video.",
    });
  }
};
