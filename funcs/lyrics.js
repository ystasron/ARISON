const axios = require("axios");

const CHUNK_SIZE = 1900;
const PREAMBLE_REGEX =
  /^[\s\S]*?(\[Intro\]|\[Verse.*?\]|\[Chorus\]|\[Bridge\]|\[Outro\])/i;
const EXCESS_NEWLINES = /\n{3,}/g;

// Send lyrics in Messenger-safe chunks
const sendInChunks = async (psid, text, callSendAPI, prefix = "") => {
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    const chunk = text.slice(i, i + CHUNK_SIZE);
    await callSendAPI(psid, { text: i === 0 ? prefix + chunk : chunk });
  }
};

module.exports = async (sender_psid, callSendAPI, messageText) => {
  const songQuery = messageText.replace(/^\/lyrics\s*/i, "").trim();

  if (!songQuery) {
    return callSendAPI(sender_psid, { text: "⚠️ Usage: /lyrics [song name]" });
  }

  try {
    const res = await axios.get(
      `https://api.popcat.xyz/v2/lyrics?song=${encodeURIComponent(songQuery)}`,
      { timeout: 15000 },
    );

    if (!res.data || res.data.error || !res.data.message) {
      return callSendAPI(sender_psid, {
        text: `ℹ️ No lyrics found for "${songQuery}".`,
      });
    }

    const { title, artist, lyrics } = res.data.message;
    if (!lyrics) throw new Error("Lyrics not found");

    const cleanedLyrics = lyrics
      .replace(PREAMBLE_REGEX, "$1")
      .replace(EXCESS_NEWLINES, "\n\n")
      .trim();

    await sendInChunks(
      sender_psid,
      cleanedLyrics,
      callSendAPI,
      `🎵 ${title} — ${artist}\n\n`,
    );
  } catch (err) {
    console.error("Lyrics Error:", err.message);
    await callSendAPI(sender_psid, {
      text: "❌ Unable to fetch lyrics right now.",
    });
  }
};
