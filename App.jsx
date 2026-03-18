import React, { useMemo, useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gap: "24px",
  },
  hero: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
  },
  badge: {
    display: "inline-block",
    background: "#e2e8f0",
    color: "#0f172a",
    borderRadius: "999px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  heroTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  button: {
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    background: "#0f172a",
    color: "#ffffff",
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    background: "#ffffff",
    color: "#0f172a",
  },
  tabs: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "10px",
  },
  tab: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: "16px",
    padding: "14px 12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  activeTab: {
    border: "2px solid #0f172a",
    background: "#e2e8f0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "24px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
  },
  field: {
    display: "grid",
    gap: "8px",
    marginBottom: "16px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    background: "#ffffff",
  },
  textarea: {
    width: "100%",
    minHeight: "180px",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    background: "#ffffff",
    resize: "vertical",
  },
  selectRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },
  outputBox: {
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: "16px",
    padding: "16px",
    height: "560px",
    overflow: "auto",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  smallText: {
    color: "#475569",
    fontSize: "14px",
    lineHeight: 1.5,
  },
};

const templates = {
  sermon: ({ scripture, topic, audience, tone, language, details }) => `TITLE: ${topic || "Untitled Sermon"}
SCRIPTURE: ${scripture || "Add a scripture passage"}
AUDIENCE: ${audience || "General congregation"}
TONE: ${tone}
LANGUAGE: ${language}

1. INTRODUCTION
- Open with a relevant real-life moment, testimony, or question tied to ${topic || "the message"}.
- Briefly introduce ${scripture || "the selected passage"}.
- State the central burden of the sermon clearly.

2. MAIN POINT 1
- Explain the meaning of the text.
- Highlight what this reveals about God.
- Add one supporting verse.
- Give one practical application for ${audience || "the listeners"}.

3. MAIN POINT 2
- Show what this passage requires from believers.
- Include one illustration or biblical example.
- Add one reflection question.

4. MAIN POINT 3
- Show the promise, warning, or invitation in the passage.
- Connect the text to daily Christian life.
- Add one short prayer point.

5. CONCLUSION
- Summarize the core message.
- Give a call to action.
- End with a closing prayer.

EXTRA NOTES
${details || "Add examples, stories, or translation requests here."}`,
  prayer: ({ scripture, topic, audience, tone, language, details }) => `PRAYER THEME: ${topic || "General Prayer"}
SUPPORTING SCRIPTURE: ${scripture || "Add a supporting verse"}
GROUP: ${audience || "Church / ministry group"}
TONE: ${tone}
LANGUAGE: ${language}

OPENING EXHORTATION
- Welcome everyone briefly.
- Read ${scripture || "the chosen verse"}.
- Connect the verse to today's prayer burden.

PRAYER POINTS
1. Thanksgiving for God's faithfulness.
2. Repentance and cleansing.
3. Revival and fresh fire.
4. Healing and restoration.
5. Families, children, and marriages.
6. Church leaders and servants.
7. Salvation for the lost.
8. Personal breakthrough and boldness.

DECLARATIONS
- The Lord is our help and shield.
- We reject fear and discouragement.
- We receive grace, wisdom, and strength.

CLOSING PRAYER
- Seal the prayer time with thanksgiving and faith.

EXTRA NOTES
${details || "Add specific prayer burdens, names, or ministry focus here."}`,
  study: ({ scripture, topic, audience, tone, language, details }) => `BIBLE STUDY TOPIC: ${topic || "Bible Study"}
PASSAGE: ${scripture || "Add a passage"}
AUDIENCE: ${audience || "Small group / youth / leaders"}
TONE: ${tone}
LANGUAGE: ${language}

1. OPENING SUMMARY
- Give a brief overview of ${scripture || "the passage"}.

2. KEY OBSERVATIONS
- What does the text say?
- What does it reveal about God?
- What does it reveal about people?

3. DISCUSSION QUESTIONS
1. What stands out most in this passage?
2. What does this teach us about God's character?
3. What warning, command, or promise is present?
4. How does this apply today?
5. What change should we make this week?
6. What should we pray about from this text?

4. MEMORY VERSE
- Choose one key verse from ${scripture || "the passage"}.

5. LEADER APPLICATION
- End with prayer and practical response.

EXTRA NOTES
${details || "Add age group, theology emphasis, or translation notes here."}`,
  followup: ({ scripture, topic, audience, tone, language, details }) => `MESSAGE PURPOSE: ${topic || "Follow-up / encouragement"}
OPTIONAL SCRIPTURE: ${scripture || "None selected"}
RECIPIENT TYPE: ${audience || "Church member / guest / leader"}
TONE: ${tone}
LANGUAGE: ${language}

MESSAGE DRAFT
Hello,

I just wanted to check in and encourage you. We are grateful for you and praying that God strengthens you in every way. ${scripture ? `I was encouraged by ${scripture} and wanted to share that with you.` : ""}

May the Lord give you peace, wisdom, and fresh strength for this season. Please know you are not alone, and we are standing with you in prayer.

Blessings,
[Your Ministry / Name]

EXTRA NOTES
${details || "Add visit, hospital, first-time guest, prayer follow-up, or pastoral tone here."}`,
  pairing: ({ topic, audience, tone, language, details }) => `PAIRING PLAN: ${topic || "Prayer / discipleship pairing"}
GROUP: ${audience || "Ministry members"}
TONE: ${tone}
LANGUAGE: ${language}

PAIRING GUIDELINES
- Pair people for weekly prayer and encouragement.
- Rotate pairs every 7 days.
- Avoid repeating the same pairings too often.
- If group size is odd, create one group of three.

WEEKLY CHECK-IN TEMPLATE
1. How can I pray for you this week?
2. What did God teach you this week?
3. Is there any area where you need encouragement or accountability?

COORDINATOR NOTE
- Share pairs every week.
- Encourage a 15–20 minute call or message exchange.
- Ask members to confirm connection.

EXTRA NOTES
${details || "Add names, age categories, men/women groups, or ministry rules here."}`,
};

const toolMeta = {
  sermon: {
    title: "Sermon Prep",
    description: "Build sermon outlines, points, illustrations, and closing prayers.",
  },
  prayer: {
    title: "Prayer Writer",
    description: "Generate prayer points, declarations, and prayer meeting flow.",
  },
  study: {
    title: "Bible Study",
    description: "Create study guides, discussion questions, and leader notes.",
  },
  followup: {
    title: "Follow-Up Messages",
    description: "Draft encouragement, visitor follow-up, and pastoral check-ins.",
  },
  pairing: {
    title: "Prayer Pairing",
    description: "Prepare prayer-partner coordination plans and weekly prompts.",
  },
};

export default function App() {
  const [tool, setTool] = useState("sermon");
  const [scripture, setScripture] = useState("");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("General Congregation");
  const [tone, setTone] = useState("Biblical and Encouraging");
  const [language, setLanguage] = useState("English");
  const [details, setDetails] = useState("");
  const [output, setOutput] = useState("");

  const currentMeta = toolMeta[tool];

  const promptText = useMemo(() => {
    return templates[tool]({ scripture, topic, audience, tone, language, details }).trim();
  }, [tool, scripture, topic, audience, tone, language, details]);

  const generate = () => {
    setOutput(promptText);
  };

  const copyText = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      alert("Copied successfully");
    } catch (e) {
      console.error("Copy failed", e);
      alert("Copy failed on this device");
    }
  };

  const downloadText = () => {
    const blob = new Blob([output || promptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool}-draft.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.heroTop}>
            <div>
              <div style={styles.badge}>PairUp Ministry Assistant</div>
              <h1 style={{ margin: 0, fontSize: "32px" }}>Ministry AI Tool Starter</h1>
              <p style={{ ...styles.smallText, maxWidth: "720px", marginTop: "10px" }}>
                A simple version for sermon prep, prayer writing, Bible study planning, follow-up care, and prayer-pair coordination.
              </p>
            </div>
            <div style={styles.buttonRow}>
              <button style={styles.secondaryButton} onClick={() => copyText(promptText)}>
                Copy Prompt
              </button>
              <button style={styles.button} onClick={generate}>
                Generate Draft
              </button>
            </div>
          </div>
        </div>

        <div style={styles.tabs}>
          {Object.entries(toolMeta).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setTool(key)}
              style={{
                ...styles.tab,
                ...(tool === key ? styles.activeTab : {}),
              }}
            >
              {meta.title}
            </button>
          ))}
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>{currentMeta.title}</h2>
            <p style={styles.smallText}>{currentMeta.description}</p>

            <div style={styles.field}>
              <label style={styles.label}>Topic / Title</label>
              <input
                style={styles.input}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Example: The Fire of Revival"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Scripture</label>
              <input
                style={styles.input}
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
                placeholder="Example: Psalm 19:7–11"
              />
            </div>

            <div style={styles.selectRow}>
              <div style={styles.field}>
                <label style={styles.label}>Audience</label>
                <select style={styles.input} value={audience} onChange={(e) => setAudience(e.target.value)}>
                  <option>General Congregation</option>
                  <option>Youth</option>
                  <option>Leaders</option>
                  <option>Women</option>
                  <option>Men</option>
                  <option>Prayer Group</option>
                  <option>Small Group</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Tone</label>
                <select style={styles.input} value={tone} onChange={(e) => setTone(e.target.value)}>
                  <option>Biblical and Encouraging</option>
                  <option>Prophetic and Bold</option>
                  <option>Pastoral and Gentle</option>
                  <option>Evangelistic</option>
                  <option>Teaching Focused</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Language</label>
                <select style={styles.input} value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option>English</option>
                  <option>Amharic</option>
                  <option>English + Amharic</option>
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Extra Instructions</label>
              <textarea
                style={styles.textarea}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Add details like real-life illustration, doctrinal emphasis, age group, hospital follow-up, or ministry notes."
              />
            </div>

            <div style={styles.buttonRow}>
              <button style={styles.button} onClick={generate}>
                Generate Draft
              </button>
              <button style={styles.secondaryButton} onClick={() => copyText(promptText)}>
                Copy Prompt
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>Generated Draft</h2>
            <p style={styles.smallText}>
              This version creates a structured draft or prompt you can use directly or expand later.
            </p>

            <div style={styles.buttonRow}>
              <button style={styles.secondaryButton} onClick={() => copyText(output || promptText)}>
                Copy Output
              </button>
              <button style={styles.secondaryButton} onClick={downloadText}>
                Download TXT
              </button>
            </div>

            <div style={{ height: "16px" }} />

            <div style={styles.outputBox}>
              {output || "Click 'Generate Draft' to create your first ministry draft."}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .force-single-column {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
