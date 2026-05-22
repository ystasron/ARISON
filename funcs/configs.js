module.exports = async function (sender_psid, callSendAPI) {
  try {
    const response = await fetch("https://www.getroned.online/configs/configs.json", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) throw new Error(`HTTP status ${response.status}`);

    const configs = await response.json();

    if (!Array.isArray(configs) || configs.length === 0) {
      return await callSendAPI(sender_psid, {
        text: "⚠️ No configurations available at the moment.",
      });
    }

    const getTimeLeft = (dateString) => {
      const expiry = new Date(dateString);
      if (isNaN(expiry)) return null; // treat as expired/invalid

      const now = new Date();
      const diff = expiry - now;

      if (diff <= 0) return null; // expired

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) return `${days}d ${hours}h ${minutes}m`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    };

    const activeConfigs = configs.filter(({ expiry } = {}) => getTimeLeft(expiry) !== null);

    if (activeConfigs.length === 0) {
      return await callSendAPI(sender_psid, {
        text: "⚠️ All configurations have expired. Please check back later.",
      });
    }

    const summaryList = activeConfigs
      .map(
        ({ country = "Unknown", flag = "", promo = "N/A", expiry } = {}) =>
          `🌍 ${country} ${flag}\n` +
          `🎁 Promo: ${promo}\n` +
          `⏰ Time Left: ${getTimeLeft(expiry)}\n` +
          `--------------------------`
      )
      .join("\n");

    const message =
      `📋 Available Configurations:\n\n${summaryList}\n\n` +
      `You can download them at configs.getroned.online`;

    await callSendAPI(sender_psid, { text: message });
  } catch (err) {
    console.error("Handler Error:", err);
    await callSendAPI(sender_psid, {
      text: "❌ Failed to retrieve configurations. Please try again later.",
    });
  }
};
