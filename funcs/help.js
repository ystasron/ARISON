// help.js
module.exports = (sender_psid, callSendAPI) => {
  // Arrays of possible phrases
  const firstMessages = [
    "Are you feeling a bit lost and need some guidance through the commands?",
    "Need a little help understanding how things work here?",
    "Lost in the list of commands and not sure what to do next?",
    "Feeling stuck and unsure how to proceed?",
    "Do you need some assistance to navigate the bot’s features?",
  ];

  const secondMessages = [
    "/help - open this detailed help message to see all available commands\n/developer - learn more about the bot's creator\n/menu - explore commands quickly through interactive quick replies\n/mcu - check out the upcoming MCU movie details\n/song - search for a song and get it sent to you\n/lyrics - find lyrics for any song you like",

    "/help - show the complete help info with all commands\n/developer - discover who developed this bot and their info\n/menu - browse all commands conveniently with quick replies\n/mcu - get the latest info on the next MCU movie\n/song - search for your favorite songs and receive them instantly\n/lyrics - fetch the lyrics for any song you want",

    "/help - access the help message with instructions for every command\n/developer - view information about the bot developer\n/menu - see a quick list of all commands available\n/mcu - get details on the upcoming MCU movie release\n/song - find and send music directly to you\n/lyrics - get the full lyrics for any song you request",

    "/help - open the full help guide with command explanations\n/developer - learn about who created this bot and their role\n/menu - explore commands using quick replies for faster navigation\n/mcu - check out the next MCU movie schedule and info\n/song - search and receive songs right here\n/lyrics - retrieve complete song lyrics instantly",

    "/help - display a detailed help message with all the bot commands\n/developer - information about the developer behind this bot\n/menu - view commands quickly through the interactive menu\n/mcu - find out the details about the next MCU movie\n/song - search for and get songs sent directly to you\n/lyrics - obtain lyrics for any song you’re interested in",

    "/help - get access to the help message with instructions\n/developer - see who created me and learn more about them\n/menu - list all available commands with ease\n/mcu - upcoming MCU movie info and details\n/song - search and send your favorite songs\n/lyrics - fetch lyrics for any song you want",

    "/help - open the comprehensive help guide for all commands\n/developer - get to know the developer behind this bot\n/menu - quickly view commands via interactive quick replies\n/mcu - find out about the next MCU movie release schedule\n/song - search for songs and send them to yourself\n/lyrics - get song lyrics instantly",

    "/help - see the help message with all instructions and commands\n/developer - check who developed this bot and their details\n/menu - quick access to all commands in one place\n/mcu - info on the next MCU movie release\n/song - find and send songs quickly\n/lyrics - fetch lyrics for any song easily",

    "/help - view all help commands with explanations\n/developer - learn who developed this bot and their background\n/menu - access all commands conveniently in one place\n/mcu - next MCU movie details at a glance\n/song - search songs and have them delivered to you\n/lyrics - find lyrics for your favorite songs",

    "/help - open the help menu with full command details\n/developer - who developed this bot and their info\n/menu - browse commands easily via quick replies\n/mcu - next MCU movie info and updates\n/song - find and send songs directly\n/lyrics - fetch the complete lyrics for any song",
  ];

  // Pick random phrases
  const firstMessage =
    firstMessages[Math.floor(Math.random() * firstMessages.length)];
  const secondMessage =
    secondMessages[Math.floor(Math.random() * secondMessages.length)];

  // Send first message
  callSendAPI(sender_psid, { text: firstMessage });

  // Send second message after 1 second
  setTimeout(() => {
    callSendAPI(sender_psid, { text: secondMessage });
  }, 1000);
};
