const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
async function ask(system, user) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("Missing GROQ_API_KEY. Add it to .env.local or Vercel settings.");
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {"Authorization": `Bearer ${key}`, "Content-Type":"application/json"},
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      temperature: 0.2,
      messages: [{role:"system",content:system},{role:"user",content:user}]
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Groq API request failed");
  const content = data.choices?.[0]?.message?.content || "";
  return JSON.parse(content.replace(/^```json\s*/i,"").replace(/```$/,"").trim());
}
export async function POST(req) {
  try {
    const body = await req.json();
    if (body.action === "create") {
      const {topic, kind, count} = body;
      const format = kind === "MCQ"
        ? "Each question must include exactly four options and correctAnswer matching one option."
        : "Each question must include an idealAnswer and no options.";
      const data = await ask(
        "You are the Exam Designer agent. Create fair, clear assessment questions. Return only valid JSON.",
        `Create ${count} ${kind} questions about ${topic}. ${format}
         JSON shape: {"title":"...","questions":[{"question":"...","options":["A","B","C","D"],"correctAnswer":"A","idealAnswer":"..."}]}.
         For non-MCQ omit options and include idealAnswer.`
      );
      if (!Array.isArray(data.questions) || !data.questions.length) throw new Error("AI returned no questions. Try again.");
      return Response.json(data);
    }
    if (body.action === "grade") {
      const {exam, answers} = body;
      const data = await ask(
        "You are the Grading agent. Grade fairly against the ideal answers. Return only valid JSON.",
        `Grade this exam. Questions: ${JSON.stringify(exam.questions)}. Candidate answers: ${JSON.stringify(answers)}.
         For MCQ, compare exactly to correctAnswer. For written answers, judge correctness and relevance.
         Return {"score":number,"total":number,"summary":"short result","feedback":["feedback per question"]}.
         Score must be between 0 and total.`
      );
      return Response.json(data);
    }
    return Response.json({error:"Unknown action"}, {status:400});
  } catch (e) {
    return Response.json({error:e.message || "Server error"}, {status:500});
  }
}
