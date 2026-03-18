import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Copy, Sparkles, BookOpen, HeartHandshake, Users, MessageSquare, Download, Settings, Trash2, Languages, Wand2, Save } from "lucide-react";

const toolMeta = {
  sermon: {
    title: "Sermon Prep",
    icon: BookOpen,
    description: "Generate full sermon outlines, applications, prayers, and altar calls.",
  },
  prayer: {
    title: "Prayer Writer",
    icon: HeartHandshake,
    description: "Generate prayer points, declarations, and guided prayer flow.",
  },
  study: {
    title: "Bible Study",
    icon: Sparkles,
    description: "Create discussion questions, leader notes, and practical application.",
  },
  followup: {
    title: "Follow-Up Messages",
    icon: MessageSquare,
    description: "Write pastoral care, visitor, hospital, and encouragement messages.",
  },
  pairing: {
    title: "Prayer Pairing",
    icon: Users,
    description: "Generate weekly prayer partners and track history locally.",
  },
};

const defaultSettings = {
  apiKey: "",
  model: "gpt-4.1-mini",
  useLiveAI: false,
  ministryName: "PairUp Ministry",
  defaultLanguage: "English",
};

const defaultForm = {
  tool: "sermon",
  scripture: "",
  topic: "",
  audience: "General Congregation",
  tone: "Biblical and Encouraging",
  language: "English",
  details: "",
  pairingNames: "",
};

function buildPrompt({ tool, scripture, topic, audience, tone, language, details, ministryName }) {
  const shared = `You are assisting ${ministryName}. Write with theological clarity, warmth, biblical faithfulness, and practical ministry usefulness. Output language: ${language}. Tone: ${tone}. Audience: ${audience}. Topic: ${topic || "Not provided"}. Scripture: ${scripture || "Not provided"}. Additional instructions: ${details || "None."}`;

  const prompts = {
    sermon: `${shared}\n\nCreate a full sermon package with these sections:\n1. Sermon title\n2. Main theme in one sentence\n3. Strong opening illustration\n4. Full outline with 3 main points\n5. Supporting Bible verses\n6. Practical application\n7. Short closing prayer\n8. Optional altar call\n9. If the language is bilingual, format clearly in both languages.`,
    prayer: `${shared}\n\nCreate a ministry prayer guide with these sections:\n1. Opening exhortation\n2. 7 to 12 prayer points\n3. Bold declarations\n4. Relevant scriptures\n5. Closing prayer\n6. If requested, make it suitable for a church prayer meeting.`,
    study: `${shared}\n\nCreate a Bible study guide with these sections:\n1. Passage overview\n2. Key observations\n3. 6 discussion questions\n4. Leader notes\n5. Application for the week\n6. Closing prayer\n7. Memory verse suggestion.`,
    followup: `${shared}\n\nWrite 3 polished follow-up message options:\n1. Warm and pastoral\n2. Short and encouraging\n3. Strong and faith-filled\nInclude a scripture only if appropriate.`,
  };

  return prompts[tool] || shared;
}

function fallbackTemplate({ tool, scripture, topic, audience, tone, language, details }) {
  const header = `MINISTRY DRAFT\nTool: ${tool}\nTopic: ${topic || "Not provided"}\nScripture: ${scripture || "Not provided"}\nAudience: ${audience}\nTone: ${tone}\nLanguage: ${language}\n\n`;

  if (tool === "sermon") {
    return `${header}TITLE\n${topic || "Untitled Sermon"}\n\nINTRODUCTION\n- Begin with a testimony, question, or current-life illustration.\n- Introduce the main burden of the message from ${scripture || "the passage"}.\n\nPOINT 1\n- Explain the meaning of the text.\n- Show what it reveals about God.\n\nPOINT 2\n- Show what this text calls believers to do.\n- Add one biblical example.\n\nPOINT 3\n- Show the promise, warning, or invitation in the text.\n- Connect it to daily life.\n\nAPPLICATION\n- Give 3 practical next steps.\n\nCLOSING PRAYER\n- Pray for understanding, obedience, and transformation.\n\nEXTRA NOTES\n${details || "None."}`;
  }

  if (tool === "prayer") {
    return `${header}OPENING EXHORTATION\n- Read ${scripture || "a fitting scripture"}.\n- Call the church to pray in faith.\n\nPRAYER POINTS\n1. Thanksgiving\n2. Repentance\n3. Revival\n4. Healing\n5. Families\n6. Leadership\n7. Salvation\n8. Strength and boldness\n\nDECLARATIONS\n- The Lord is our refuge.\n- We reject fear.\n- We receive grace and victory.\n\nCLOSING PRAYER\n- Thank God and seal the time in faith.\n\nEXTRA NOTES\n${details || "None."}`;
  }

  if (tool === "study") {
    return `${header}PASSAGE OVERVIEW\n- Summarize ${scripture || "the passage"}.\n\nKEY OBSERVATIONS\n- What does it say about God?\n- What does it say about people?\n- What command, warning, or promise is present?\n\nDISCUSSION QUESTIONS\n1. What stands out?\n2. What does this reveal about God?\n3. What should change in us?\n4. How does this apply now?\n5. What should we pray about?\n6. What will we obey this week?\n\nLEADER NOTES\n- Guide discussion gently and bring the group back to scripture.\n\nEXTRA NOTES\n${details || "None."}`;
  }

  return `${header}FOLLOW-UP MESSAGE\nHello,\n\nI just wanted to reach out and encourage you. We are grateful for you and praying that God strengthens you in every way. ${scripture ? `I was thinking about ${scripture} and wanted to share that encouragement with you.` : ""}\n\nMay the Lord give you peace, wisdom, healing, and fresh strength for this season. Please know you are not alone.\n\nBlessings,\n[Your Name / Ministry]\n\nEXTRA NOTES\n${details || "None."}`;
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generatePairings(names, previousGroups) {
  if (names.length < 2) return [];

  const tried = new Set(previousGroups.flatMap((group) => {
    const cleaned = [...group].sort();
    return cleaned.length === 2 ? [`${cleaned[0]}__${cleaned[1]}`] : [];
  }));

  let best = [];
  let fewestRepeats = Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const shuffled = shuffleArray(names);
    const groups = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      if (i === shuffled.length - 3) {
        groups.push([shuffled[i], shuffled[i + 1], shuffled[i + 2]]);
        break;
      }
      if (i === shuffled.length - 1) {
        groups.push([shuffled[i]]);
      } else {
        groups.push([shuffled[i], shuffled[i + 1]]);
      }
    }

    let repeats = 0;
    groups.forEach((group) => {
      if (group.length === 2) {
        const key = [...group].sort().join("__");
        if (tried.has(key)) repeats += 1;
      }
    });

    if (repeats < fewestRepeats) {
      fewestRepeats = repeats;
      best = groups;
      if (repeats === 0) break;
    }
  }

  return best;
}

async function callOpenAI({ apiKey, model, prompt }) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: prompt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Unable to generate response.");
  }

  const data = await response.json();
  return data.output_text || "No response returned.";
}

export default function PairUpMinistryAssistant() {
  const [settings, setSettings] = useState(defaultSettings);
  const [form, setForm] = useState(defaultForm);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [pairingHistory, setPairingHistory] = useState([]);
  const [pairingOutput, setPairingOutput] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedSettings = localStorage.getItem("pairup_settings_v2");
    const savedHistory = localStorage.getItem("pairup_history_v2");
    const savedPairings = localStorage.getItem("pairup_pairings_v2");

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedPairings) setPairingHistory(JSON.parse(savedPairings));
  }, []);

  useEffect(() => {
    localStorage.setItem("pairup_settings_v2", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("pairup_history_v2", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("pairup_pairings_v2", JSON.stringify(pairingHistory));
  }, [pairingHistory]);

  const currentMeta = toolMeta[form.tool];
  const CurrentIcon = currentMeta.icon;

  const promptText = useMemo(() => buildPrompt({ ...form, ministryName: settings.ministryName }), [form, settings.ministryName]);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const copyText = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadText = (value, filename) => {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveCurrentOutput = () => {
    if (!output.trim()) return;
    const entry = {
      id: Date.now(),
      tool: form.tool,
      title: form.topic || `${toolMeta[form.tool].title} Draft`,
      scripture: form.scripture,
      output,
      createdAt: new Date().toLocaleString(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, 20));
  };

  const handleGenerate = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (settings.useLiveAI && settings.apiKey.trim()) {
        const result = await callOpenAI({
          apiKey: settings.apiKey.trim(),
          model: settings.model.trim() || "gpt-4.1-mini",
          prompt: promptText,
        });
        setOutput(result);
      } else {
        setOutput(fallbackTemplate(form));
      }
    } catch (err) {
      setError("Live AI generation failed. Check your API key or model, or switch off Live AI.");
      setOutput(fallbackTemplate(form));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePairingGenerate = () => {
    const names = form.pairingNames
      .split(/\n|,/)
      .map((name) => name.trim())
      .filter(Boolean);

    const previousGroups = pairingHistory.flatMap((week) => week.groups);
    const groups = generatePairings(names, previousGroups);
    setPairingOutput(groups);

    if (groups.length) {
      const record = {
        id: Date.now(),
        createdAt: new Date().toLocaleString(),
        groups,
      };
      setPairingHistory((prev) => [record, ...prev].slice(0, 12));
    }
  };

  const pairingText = pairingOutput.length
    ? pairingOutput
        .map((group, index) => `${index + 1}. ${group.join(" + ")}`)
        .join("\n")
    : "No pairings generated yet.";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge className="mb-3">Full Version</Badge>
              <h1 className="text-3xl font-bold tracking-tight">{settings.ministryName || "PairUp Ministry"} Assistant</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                This version can run in two modes: template mode without AI, or live AI mode with your own API key. It also includes prayer-partner pairing, local history, copy and download tools, and bilingual ministry support.
              </p>
            </div>
            <div className="grid gap-2 rounded-2xl border bg-slate-50 p-4 text-sm md:grid-cols-2">
              <div className="flex items-center gap-2"><Settings className="h-4 w-4" /> Live AI: {settings.useLiveAI ? "On" : "Off"}</div>
              <div className="flex items-center gap-2"><Languages className="h-4 w-4" /> Default Language: {settings.defaultLanguage}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Settings</CardTitle>
                <CardDescription>
                  For independent use, turn on Live AI and paste your API key. For safer production use later, move the API call to a server route.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Ministry Name</Label>
                  <Input value={settings.ministryName} onChange={(e) => setSettings((s) => ({ ...s, ministryName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input value={settings.model} onChange={(e) => setSettings((s) => ({ ...s, model: e.target.value }))} placeholder="gpt-4.1-mini" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>API Key</Label>
                  <Input type="password" value={settings.apiKey} onChange={(e) => setSettings((s) => ({ ...s, apiKey: e.target.value }))} placeholder="Paste your API key here" />
                </div>
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select value={settings.defaultLanguage} onValueChange={(value) => setSettings((s) => ({ ...s, defaultLanguage: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Amharic">Amharic</SelectItem>
                      <SelectItem value="English + Amharic">English + Amharic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-2xl border p-4">
                  <div>
                    <div className="font-medium">Use Live AI</div>
                    <div className="text-xs text-slate-500">Turn off to use template mode only.</div>
                  </div>
                  <Switch checked={settings.useLiveAI} onCheckedChange={(checked) => setSettings((s) => ({ ...s, useLiveAI: checked }))} />
                </div>
              </CardContent>
            </Card>

            <Tabs value={form.tool} onValueChange={(value) => updateForm("tool", value)} className="space-y-6">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-transparent p-0 md:grid-cols-5">
                {Object.entries(toolMeta).map(([key, meta]) => {
                  const Icon = meta.icon;
                  return (
                    <TabsTrigger key={key} value={key} className="rounded-2xl border bg-white px-4 py-3 data-[state=active]:shadow-sm">
                      <Icon className="mr-2 h-4 w-4" /> {meta.title}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value={form.tool} className="m-0">
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-slate-100 p-3"><CurrentIcon className="h-5 w-5" /></div>
                      <div>
                        <CardTitle>{currentMeta.title}</CardTitle>
                        <CardDescription>{currentMeta.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {form.tool !== "pairing" ? (
                      <>
                        <div className="space-y-2">
                          <Label>Topic / Title</Label>
                          <Input value={form.topic} onChange={(e) => updateForm("topic", e.target.value)} placeholder="Example: The Fire of Revival" />
                        </div>
                        <div className="space-y-2">
                          <Label>Scripture</Label>
                          <Input value={form.scripture} onChange={(e) => updateForm("scripture", e.target.value)} placeholder="Example: Psalm 19:7–11" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label>Audience</Label>
                            <Select value={form.audience} onValueChange={(value) => updateForm("audience", value)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="General Congregation">General Congregation</SelectItem>
                                <SelectItem value="Youth">Youth</SelectItem>
                                <SelectItem value="Leaders">Leaders</SelectItem>
                                <SelectItem value="Women">Women</SelectItem>
                                <SelectItem value="Men">Men</SelectItem>
                                <SelectItem value="Prayer Group">Prayer Group</SelectItem>
                                <SelectItem value="Small Group">Small Group</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Tone</Label>
                            <Select value={form.tone} onValueChange={(value) => updateForm("tone", value)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Biblical and Encouraging">Biblical and Encouraging</SelectItem>
                                <SelectItem value="Prophetic and Bold">Prophetic and Bold</SelectItem>
                                <SelectItem value="Pastoral and Gentle">Pastoral and Gentle</SelectItem>
                                <SelectItem value="Evangelistic">Evangelistic</SelectItem>
                                <SelectItem value="Teaching Focused">Teaching Focused</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Language</Label>
                            <Select value={form.language} onValueChange={(value) => updateForm("language", value)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Amharic">Amharic</SelectItem>
                                <SelectItem value="English + Amharic">English + Amharic</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Extra Instructions</Label>
                          <Textarea value={form.details} onChange={(e) => updateForm("details", e.target.value)} placeholder="Example: Add a real-life story, make it 30 minutes, include altar call, or write for Amharic church leaders." className="min-h-[170px]" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={handleGenerate} disabled={isLoading}>
                            <Wand2 className="mr-2 h-4 w-4" /> {isLoading ? "Generating..." : "Generate"}
                          </Button>
                          <Button variant="outline" onClick={() => copyText(promptText)}>
                            <Copy className="mr-2 h-4 w-4" /> Copy Prompt
                          </Button>
                          <Button variant="outline" onClick={saveCurrentOutput}>
                            <Save className="mr-2 h-4 w-4" /> Save Output
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>Names for Prayer Pairing</Label>
                          <Textarea value={form.pairingNames} onChange={(e) => updateForm("pairingNames", e.target.value)} placeholder={"Paste one name per line or separate with commas\nExample:\nAbel\nBeth\nCaleb\nDina"} className="min-h-[220px]" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={handlePairingGenerate}><Users className="mr-2 h-4 w-4" /> Generate Pairings</Button>
                          <Button variant="outline" onClick={() => copyText(pairingText)}><Copy className="mr-2 h-4 w-4" /> Copy Pairings</Button>
                          <Button variant="outline" onClick={() => downloadText(pairingText, "pairings.txt")}><Download className="mr-2 h-4 w-4" /> Download</Button>
                        </div>
                      </>
                    )}
                    {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Output</CardTitle>
                <CardDescription>
                  {form.tool === "pairing" ? "Your generated prayer partners appear here." : "Live AI output appears here when enabled. Otherwise, the app uses a strong ministry template."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => copyText(form.tool === "pairing" ? pairingText : output || "")}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                  <Button variant="outline" onClick={() => downloadText(form.tool === "pairing" ? pairingText : output || "", `${form.tool}-output.txt`)}><Download className="mr-2 h-4 w-4" /> Download</Button>
                </div>
                <ScrollArea className="h-[420px] rounded-2xl border bg-slate-50 p-4">
                  <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-800">{form.tool === "pairing" ? pairingText : output || "Generate something to see the result here."}</pre>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Saved Drafts</CardTitle>
                <CardDescription>Stored in this browser only.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[260px]">
                  <div className="space-y-3">
                    {history.length === 0 ? (
                      <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-500">No saved drafts yet.</div>
                    ) : history.map((entry) => (
                      <div key={entry.id} className="rounded-2xl border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium">{entry.title}</div>
                            <div className="text-xs text-slate-500">{entry.tool} • {entry.scripture || "No scripture"} • {entry.createdAt}</div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setHistory((prev) => prev.filter((item) => item.id !== entry.id))}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setOutput(entry.output)}>Load</Button>
                          <Button variant="outline" size="sm" onClick={() => copyText(entry.output)}>Copy</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Pairing History</CardTitle>
                <CardDescription>Recent weekly partner groups stored locally.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[220px]">
                  <div className="space-y-3">
                    {pairingHistory.length === 0 ? (
                      <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-500">No pairing history yet.</div>
                    ) : pairingHistory.map((record) => (
                      <div key={record.id} className="rounded-2xl border p-4 text-sm">
                        <div className="mb-2 font-medium">{record.createdAt}</div>
                        <div className="space-y-1 text-slate-700">
                          {record.groups.map((group, index) => (
                            <div key={`${record.id}-${index}`}>{index + 1}. {group.join(" + ")}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
