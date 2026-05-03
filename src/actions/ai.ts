"use server";

import Anthropic from "@anthropic-ai/sdk";

export async function draftDescription(
  title: string,
  manufacturer: string,
  category: string,
  model: string,
  condition: string,
): Promise<{ text?: string; error?: string }> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "ANTHROPIC_API_KEY is not configured." };
  }

  const client = new Anthropic();

  const conditionLabel: Record<string, string> = {
    NEW: "new",
    USED: "used",
    REFURBISHED: "refurbished",
    PARTS_ONLY: "for parts / not fully operational",
  };

  const prompt = `Write a concise, professional product listing description for a piece of used industrial wire processing equipment. Write 2–3 short paragraphs. Focus on what the machine does, its typical applications, and what a buyer should know. Do not invent specific serial numbers, hours, or condition details — keep it general enough that it can be edited. Do not use bullet points. Do not start with "Introducing" or marketing fluff.

Machine details:
- Title: ${title}
- Manufacturer: ${manufacturer || "Unknown"}
- Category: ${category || "Wire processing equipment"}
- Model: ${model || "Not specified"}
- Condition: ${conditionLabel[condition] ?? condition}

Write the description now:`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const block = message.content[0];
    if (block.type !== "text") return { error: "Unexpected response from AI." };
    return { text: block.text.trim() };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { error: `AI request failed: ${msg}` };
  }
}
