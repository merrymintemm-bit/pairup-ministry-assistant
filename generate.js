export default async function handler(req, res) {
  const { topic, scripture, language } = req.body;

  const prompt = `
Write a powerful 20-minute sermon on "${topic}" based on ${scripture}.

Language: ${language}

Rules:
- If language is Amharic → write fully in Amharic
- If language is English → write in English
- If language is English + Amharic → write first in English, then repeat in Amharic

Include:
- Strong introduction
- 3 main points
- Practical application
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
