const { join } = require("path");

module.exports = async (sender_psid, callSendAPI) => {
  const currentDate = new Date().toLocaleDateString();

  const introText = `🤖 ── 𝗔𝗥𝗜𝗦𝗢𝗡 ──
𝘚𝘺𝘴𝘵𝘦𝘮 𝘐𝘯𝘧𝘰𝘳𝘮𝘢𝘵𝘪𝘰𝘯:

✦ ᴀʙᴏᴜᴛ: 𝐀utonomous, 𝐑esponsive, 𝐈ntelligent 𝐒ystems for 𝐎ptimized 𝐍etworking. 𝖡𝗎𝗂𝗅𝗍 𝗍𝗈 𝖽𝖾𝗅𝗂𝗏𝖾𝗋 𝗉𝗋𝖾𝖼𝗂𝗌𝗂𝗈𝗇, 𝖾𝖿𝖿𝗂𝖼𝗂𝖾𝗇𝖼𝗒, 𝖺𝗇𝖽 𝖼𝗈𝗇𝗍𝗋𝗈𝗅 𝗂𝗇 𝖼𝗈𝗆𝗉𝗅𝖾𝗑 𝗈𝗉𝖾𝗋𝖺𝗍𝗂𝗈𝗇𝖺𝗅 𝖾𝗇𝗏𝗂𝗋𝗈𝗇𝗆𝖾𝗇𝗍𝗌.

✦ ᴏᴡɴᴇʀ: 𝖱𝗈𝗇 𝖥𝗎𝗇𝗂𝖾𝗌𝗍𝖺𝗌
✦ ᴡᴇʙꜱɪᴛᴇ: funiestas.com
✦ ᴅᴀᴛᴇ: ${currentDate}
✦ ᴄᴏɴᴛᴀᴄᴛ: https://www.facebook.com/ron.funiestas/`;

  try {
    await callSendAPI(sender_psid, { text: introText });

    await callSendAPI(sender_psid, {
      attachment: { type: "image", payload: {} },
      filedata: join(__dirname, "..", "res", "owner.gif"),
    });
  } catch (error) {
    console.error("❌ Error executing ARISON core module:", error);
  }
};
