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
`You can ask me anything at any time — just mention me or include "ARISON" in your message, and I’ll respond with AI-powered assistance. Whether you’re looking for answers, ideas, entertainment, or just a fun conversation, I’m here to help!

Here’s a list of commands you can use to get started:

/help – Open this detailed help message anytime to view all available commands and features.
/menu – Browse commands quickly through interactive quick replies for a smoother experience.
/song – Search for songs by title, artist, or genre, and I’ll send them straight to you.
/lyrics – Get the full lyrics of your favorite tracks — just type the song title (you can include the artist too).
/quiz – Challenge yourself with interactive quiz questions and test your knowledge on different topics.
/mcu – Explore details about upcoming Marvel Cinematic Universe releases and related updates.
/developer – Learn more about the creator behind this AI and the inspiration that brought it to life.

Feel free to explore, experiment, and combine commands to discover music, information, and interactive features with ease. I’m always ready to make your chat experience smarter, faster, and more fun.`,

`Need something? Just mention me or type "ARISON" anywhere in your message, and I’ll jump in with AI-powered assistance. From answers and inspiration to entertainment and fun chats, I’ve got you covered!

Here’s a list of commands you can use to get started:

/help – View the complete help guide with all commands and features explained.
/menu – Access commands quickly using interactive quick replies.
/song – Find songs by title, artist, or genre and receive them instantly.
/lyrics – Retrieve full lyrics for your favorite songs (include the artist if needed).
/quiz – Take part in interactive quizzes and test your knowledge.
/mcu – Discover updates and details about upcoming Marvel Cinematic Universe releases.
/developer – Learn about the creator of this AI and the inspiration behind it.

Try different commands and explore all the features available. I’m always ready to respond!`,

`Just include "ARISON" in your message and I’ll respond instantly with AI-powered assistance. Whether you’re searching for knowledge, entertainment, or something creative, I’m here whenever you need me!

Here’s a list of commands you can use to get started:

/help – Access the detailed help section with all commands listed.
/menu – Quickly browse features using interactive replies.
/song – Search and receive songs directly in chat.
/lyrics – Fetch accurate lyrics for any song you choose.
/quiz – Test your skills with engaging quiz questions.
/mcu – Explore information about upcoming Marvel Cinematic Universe films.
/developer – Learn more about the creator behind this AI system.

Explore freely, combine features, and enjoy a smarter chat experience with me by your side!`
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

