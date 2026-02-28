const axios = require("axios");
const he = require("he");

// Reusable API URL constant
const QUIZ_URL =
  "https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple";

// Fisher-Yates shuffle — unbiased unlike () => Math.random() - 0.5
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

module.exports = async function (psid, callSendAPI) {
  try {
    const res = await axios.get(QUIZ_URL);
    const data = res.data;

    if (!data?.results?.length) {
      return callSendAPI(psid, { text: "❌ No questions found!" });
    }

    const q = data.results[0];
    const question = he.decode(q.question);
    const correctAnswer = he.decode(q.correct_answer);

    const options = shuffle([
      ...q.incorrect_answers.map((a) => he.decode(a)),
      correctAnswer,
    ]);

    const quick_replies = options.map((opt) => ({
      content_type: "text",
      title: opt.length > 20 ? opt.substring(0, 17) + "..." : opt,
      payload:
        opt === correctAnswer ? "QUIZ_CORRECT" : `QUIZ_WRONG:${correctAnswer}`,
    }));

    await callSendAPI(psid, {
      text: `🧠 [General Knowledge]\n\n${question}`,
      quick_replies,
    });
  } catch (err) {
    console.error("Quiz Error:", err.message);
    callSendAPI(psid, {
      text: "❌ Failed to fetch question. Try again later.",
    });
  }
};
