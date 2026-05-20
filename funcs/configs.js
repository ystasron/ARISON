
module.exports = async function (sender_psid, callSendAPI) {
  try {
    // 1. Add User-Agent header to bypass 403 Forbidden
    const response = await fetch("https://www.getroned.online/configs/configs.json", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    
    if (!response.ok) throw new Error(`HTTP status ${response.status}`);
    
    const configs = await response.json();

    const summaryList = configs.map(item => 
      `🌍 ${item.country} ${item.flag}\n` +
      `🎁 Promo: ${item.promo}\n` +
      `⏳ Expiry: ${item.expiry}\n` +
      `--------------------------`
    ).join("\n");

    const message = `📋 **Available Configurations**:\n\n${summaryList}`;

    // 2. Ensure payload matches Messenger API requirement: { recipient: { id: ... }, message: { text: ... } }
    // If callSendAPI already wraps this, just pass the message object
    await callSendAPI(sender_psid, { text: message });

  } catch (err) {
    console.error("Handler Error:", err);
    await callSendAPI(sender_psid, {
      text: "❌ Failed to retrieve configurations. Please try again later.",
    });
  }
};
