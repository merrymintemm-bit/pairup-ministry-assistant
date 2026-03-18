import React, { useState } from "react";

export default function App() {
  const [topic, setTopic] = useState("");
  const [scripture, setScripture] = useState("");
  const [language, setLanguage] = useState("English");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateWithAI = async () => {
    setLoading(true);
    setOutput("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic,
          scripture,
          language
        })
      });

      const data = await response.json();
      setOutput(data.result || "No result");
    } catch (error) {
      setOutput("Error generating content");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <h1>PairUp AI Ministry Tool</h1>

      <div style={{ marginBottom: 12 }}>
        <label>Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Revival Fire"
          style={{ width: "100%", padding: 10, marginTop: 6 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Scripture</label>
        <input
          type="text"
          value={scripture}
          onChange={(e) => setScripture(e.target.value)}
          placeholder="Matthew 25:1–13"
          style={{ width: "100%", padding: 10, marginTop: 6 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 6 }}
        >
          <option value="English">English</option>
          <option value="Amharic">Amharic</option>
          <option value="English + Amharic">English + Amharic</option>
        </select>
      </div>

      <button onClick={generateWithAI} style={{ padding: "12px 18px" }}>
        {loading ? "Generating..." : "Generate Sermon"}
      </button>

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 20, background: "#f5f5f5", padding: 16, borderRadius: 8 }}>
        {output}
      </pre>
    </div>
  );
}
