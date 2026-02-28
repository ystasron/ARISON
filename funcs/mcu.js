// mcu.js
const NEXT_MCU_MOVIE = {
  title: "Spider-Man: Brand New Day",
  release_date: "2026-07-29",
  poster_url: "https://image.tmdb.org/t/p/w500/9JCQtDCSpPR2ld55yNlEg1VwcQo.jpg",
  type: "Movie",
  overview:
    "Four years after the events of Spider-Man: No Way Home, Peter Parker is no more and Spider-Man is at the top of his game keeping New York City safe. Things are going well until an unusual trail of crimes pulls Spider-Man into a web of mystery larger than he's ever faced before. In order to take on what's ahead, Spider-Man not only needs to be at the top of his physical and mental game, but he must also be prepared to face the repercussions of his past!",
};

// Pre-format the release date once at module load — not per-request
const releaseDate = new Date(NEXT_MCU_MOVIE.release_date);
const formattedDate = releaseDate.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

module.exports = async function (sender_psid, callSendAPI) {
  try {
    const daysUntil = Math.max(
      0,
      Math.ceil((releaseDate - new Date()) / (1000 * 60 * 60 * 24)),
    );

    const message =
      `🎬 ${NEXT_MCU_MOVIE.title} (${NEXT_MCU_MOVIE.type})\n` +
      `🗓 Release Date: ${formattedDate}\n` +
      `⏳ Days Until Release: ${daysUntil}`;

    // Send text and poster in parallel — neither depends on the other
    await Promise.all([
      callSendAPI(sender_psid, { text: message }),
      callSendAPI(sender_psid, {
        attachment: {
          type: "image",
          payload: {
            url: NEXT_MCU_MOVIE.poster_url,
            is_reusable: true,
          },
        },
      }),
    ]);
  } catch (err) {
    console.error("MCU Handler Error:", err.message);
    await callSendAPI(sender_psid, {
      text: "❌ Failed to fetch next MCU movie.",
    });
  }
};
