export default async function handler(req, res) {
  try {
    const { topic, scripture, language } = req.body || {};

    let languageInstruction = "Write everything in English only.";

    if (language === "Amharic") {
      languageInstruction =
        "Write everything in Amharic only. Do not use English except for Bible references.";
    } else if (language === "English + Amharic") {
      languageInstruction =
        "Write the full sermon in two sections. First section: English. Second section: Amharic.";
    }

    const prompt = `
Write a powerful 20-minute sermon on "${topic}" based on "${scripture}".

${languageInstruction}

IMPORTANT:
You MUST obey the language instruction exactly.

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

    const result =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      data.output?.map((item) =>
        (item.content || [])
          .map((c) => c.text || "")
          .join("")
      ).join("\n") ||
      "";

    if (!response.ok) {
      return res.status(500).json({
        result: `OpenAI error: ${data.error?.message || "Unknown error"}`,
      });
    }

    return res.status(200).json({
      result: result || "No text returned from AI.",
    });
  } catch (error) {
    return res.status(500).json({
      result: `Server error: ${error.message}`,
    });
  }
}
