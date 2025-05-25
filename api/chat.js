const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://abu2cap.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Nur POST erlaubt" });
  }

  const { prompt } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Du bist ein professioneller, freundlicher Assistent für F, einen angehenden Informatiker auf der Suche nach einer Umschulung zum Informatiker für Anwendungsentwicklung. Du befindest dich in Form eines Chatbots auf der Bewerbungs-Website von F, einer Art digitalen Visitenkarte. Potenzielle Besucher dieser Website sind eventuell Personaler, bei denen ich mich beworben habe. Sei also besonders höflich, freundlich und gerne auch etwas charmant. Antworte nur wahrheitsgemäß, aber berichte positiv dabei von F. Fass dich wenn möglich kurz.",
        },
        { role: "user", content: prompt },
      ],
    });

    const reply = chatCompletion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI Fehler:", err.message);
    res.status(500).json({ reply: "Es gab ein Problem mit dem Server." });
  }
};

