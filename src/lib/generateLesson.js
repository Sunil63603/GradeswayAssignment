export async function generateLesson(promptText) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
    apiKey;

  const headers = {
    "Content-Type": "application/json",
  };

  const buildPayload = (sectionPrompt) => ({
    contents: [
      {
        parts: [{ text: sectionPrompt }],
        role: "user",
      },
    ],
  });

  const ask = async (sectionTitle) => {
    const fullPrompt = `${promptText}\n\nNow generate the section: ${sectionTitle}`;

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(buildPayload(fullPrompt)),
    });

    if (!response.ok) throw new Error(`Failed to fetch ${sectionTitle}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  };

  const results = await Promise.all([
    ask("Detailed Lesson Content"),
    ask("Suggested Classroom Activities"),
    ask("Assessment Questions"),
  ]);

  return {
    "Detailed Lesson Content": results[0],
    "Suggested Classroom Activities": results[1],
    "Assessment Questions": results[2],
  };
}

export async function generateSection(promptText, sectionName) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

  const headers = {
    "Content-Type": "application/json",
  };

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `${promptText}\n\nNow generate the section: ${sectionName}`,
          },
        ],
        role: "user",
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Failed to fetch ${sectionName}`);

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
