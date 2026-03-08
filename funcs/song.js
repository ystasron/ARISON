const axios = require("axios");
const fs = require("fs");
const path = require("path");

const messages = [
  "🔍 Searching for your track...",
  "🎧 Fetching the audio...",
  "🚀 Preparing your song...",
  "🎶 Processing request...",
  "🎯 Almost ready...",
];

const LIMIT = 25 * 1024 * 1024; // 25MB
const MAX_DURATION_SECONDS = 600; // 10 minutes

const dirPath = path.join(__dirname, "..", "temp", "song");
fs.mkdirSync(dirPath, { recursive: true });

const parseDuration = (timestamp) => {
  if (!timestamp) return 0;
  const parts = timestamp.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
};

module.exports = async (sender_psid, callSendAPI, messageText) => {
  const query = messageText.replace(/^\/?song\s+/i, "").trim();

  if (!query) {
    return callSendAPI(sender_psid, { text: "⚠️ Usage: /song [song name]" });
  }

  const mp3Path = path.join(dirPath, `song_${Date.now()}.m4a`);
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const cleanup = () => fs.rm(mp3Path, () => {});

  try {
    // Send status + search in parallel
    const [, searchResponse] = await Promise.all([
      callSendAPI(sender_psid, { text: `⏳ ${randomMessage}` }),
      axios.get(
        `https://mostakim.onrender.com/mostakim/ytSearch?search=${encodeURIComponent(query)}`,
        { timeout: 60000 },
      ),
    ]);

    const filteredVideos = searchResponse.data.filter(
      (video) => parseDuration(video.timestamp) < MAX_DURATION_SECONDS,
    );

    if (!filteredVideos.length) throw new Error("NO_RESULTS");

    const selectedVideo = filteredVideos[0];
    const title = selectedVideo.title || "Unknown Title";
    const duration = selectedVideo.timestamp || "0:00";

    // Get audio download URL
    const apiResponse = await axios.get(
      `https://mostakim.onrender.com/m/sing?url=${encodeURIComponent(selectedVideo.url)}`,
      { timeout: 60000 },
    );

    if (!apiResponse.data?.url) throw new Error("Invalid API response");

    // Stream directly to disk, abort early if over 25MB
    const audioRes = await axios.get(apiResponse.data.url, {
      responseType: "stream",
      timeout: 0,
      maxRedirects: 10,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    await new Promise((resolve, reject) => {
      let totalBytes = 0;
      const writer = fs.createWriteStream(mp3Path);

      audioRes.data.on("data", (chunk) => {
        totalBytes += chunk.length;
        if (totalBytes > LIMIT) {
          writer.destroy();
          audioRes.data.destroy();
          reject(new Error("FILE_TOO_LARGE"));
        }
      });

      audioRes.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Send metadata and audio sequentially
    await callSendAPI(sender_psid, {
      text:
        `🎧 𝑨.𝑹.𝑰.𝑺.𝑶.𝑵 𝑺𝑷𝑬𝑨𝑲𝑬𝑹𝑺\n\n` +
        `🎵 Title: ${title}\n` +
        `🕒 Duration: ${duration}`,
    });

    await callSendAPI(sender_psid, {
      attachment: { type: "audio", payload: {} },
      filedata: mp3Path,
    });

    cleanup();
  } catch (err) {
    cleanup();
    console.error("Song Error:", err.message);

    if (err.message === "FILE_TOO_LARGE") {
      return callSendAPI(sender_psid, {
        text: "❌ File exceeds 25MB limit. Try a shorter track.",
      });
    }

    if (err.message === "NO_RESULTS") {
      return callSendAPI(sender_psid, {
        text: "❌ No results found under 10 minutes. Try a different search.",
      });
    }

    callSendAPI(sender_psid, {
      text: "❌ Unable to fetch this song right now. Please try again later.",
    });
  }
};
