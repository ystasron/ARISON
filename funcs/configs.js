module.exports = async function (sender_psid, callSendAPI) {
  try {
    const response = await fetch("https://www.getroned.online/configs/configs.json");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`);
    }
    
    const configs = await response.json();

    // 1. Map each object to a formatted string
    const summaryList = configs.map(item => 
      `🌍 ${item.country} ${item.flag}\n` +
      `🎁 Promo: ${item.promo}\n` +
      `⏳ Expiry: ${item.expiry}\n` +
      `--------------------------`
    );

    // 2. Join all summaries into one single message
    const message = `📋 **Available Configurations**:\n\n${summaryList.join("\n")}`;

    // 3. Send the summarized message
    await callSendAPI(sender_psid, { text: message });

  } catch (err) {
    console.error("Config Fetch Error:", err.message);
    await callSendAPI(sender_psid, {
      text: "❌ Failed to retrieve configurations.",
    });
  }
};
