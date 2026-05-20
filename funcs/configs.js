module.exports = async function (sender_psid, callSendAPI) {
  try {
    // Fetch with User-Agent to bypass 403 Forbidden
    const response = await fetch("https://www.getroned.online/configs/configs.json", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    
    if (!response.ok) throw new Error(`HTTP status ${response.status}`);
    
    const configs = await response.json();

    // Format dates to Month Day, Year
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric"
      });
    };

    // Map each object to a formatted string
    const summaryList = configs.map(item => 
      `🌍 ${item.country} ${item.flag}\n` +
      `🎁 Promo: ${item.promo}\n` +
      `⏳ Expiry: ${formatDate(item.expiry)}\n` +
      `--------------------------`
    ).join("\n");

    const message = `📋 Available Configurations:\n\n${summaryList}\n\nYou can download them at configs.getroned.online`;

    // Send the formatted message
    await callSendAPI(sender_psid, { text: message });

  } catch (err) {
    console.error("Handler Error:", err);
    await callSendAPI(sender_psid, {
      text: "❌ Failed to retrieve configurations. Please try again later.",
    });
  }
};
