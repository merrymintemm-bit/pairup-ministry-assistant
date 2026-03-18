export default async function handler(req, res) {
  const { topic, scripture, language } = req.body || {};

  let languageInstruction = "Write everything in English only.";

  if (language === "Amharic") {
    languageInstruction = "Write everything in Amharic only. Do not use English except for Bible references.";
  } else if (language === "English + Amharic") {
    languageInstruction =
      "Write the full sermon in two sections. First section: English. Second section: Amharic.";
  }

  const prompt = `
Write a powerful 20-minute sermon on "${topic}" based on "${scripture}".

${languageInstruction}

Include:
- Introduction
- 3 main points
- Application
- Closing prayer
`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt,
    }),
  });

  const data = await response.json();

  res.status(200).json({
    result: data.output_text || "No result",
  });
}
