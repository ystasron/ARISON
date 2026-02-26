const axios = require("axios");
const he = require("he"); // decode HTML entities

module.exports = async function (psid, callSendAPI) {
  try {
    // 1️⃣ Fetch 1 multiple-choice question
    const res = await axios.get(
      "https://opentdb.com/api.php?amount=1&type=multiple"
    );

    const data = res.data;
    if (!data.results || data.results.length === 0) {
      return callSendAPI(psid, { text: "❌ No questions found!" });
    }

    const q = data.results[0];
    const question = he.decode(q.question);
    const correctAnswer = he.decode(q.correct_answer);
    const incorrectAnswers = q.incorrect_answers.map((a) => he.decode(a));

    // 2️⃣ Shuffle all answers
    const options = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);

    // 3️⃣ Build quick replies with correct/wrong payloads
    const quick_replies = options.map((opt) => ({
      content_type: "text",
      title: opt,
      payload: opt === correctAnswer ? `CORRECT_${correctAnswer}` : `WRONG_${correctAnswer}`,
    }));

    // 4️⃣ Send question with quick replies
    callSendAPI(psid, {
      text: question,
      quick_replies,
    });

  } catch (err) {
    console.error("Quiz Error:", err.message);
    callSendAPI(psid, { text: "❌ Failed to fetch question." });
  }
};
