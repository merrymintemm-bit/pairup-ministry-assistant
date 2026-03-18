export default async function handler(req, res) {
  const { topic, scripture } = req.body;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: `Write a powerful 20-minute sermon on "${topic}" based on ${scripture}. Include introduction, 3 points, application, and closing prayer.`,
    }),
  });

  const data = await response.json();

  res.status(200).json({
    result: data.output_text || "No result",
  });
}
