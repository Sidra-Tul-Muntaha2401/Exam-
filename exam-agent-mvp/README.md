# ExamPilot — minimal MVP

## Included
- AI-generated MCQ, short-answer, long-answer and oral-transcript questions
- Groq-powered question creation and grading
- Small two-role agent workflow: Exam Designer and Grading agent
- Basic focus-loss warning (not reliable proctoring)

## Run locally
1. Install Node.js 20 or later.
2. Extract this ZIP and open the folder in VS Code.
3. Open Terminal in VS Code and run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. Create a Groq API key and place it in `.env.local` as `GROQ_API_KEY=...`.
6. Run `npm run dev` and open http://localhost:3000.

## Deploy
1. Create a new empty GitHub repository.
2. Upload the extracted project files and folders (not the ZIP itself).
3. Sign in to Vercel and choose Add New → Project.
4. Import the GitHub repository. Keep the detected Next.js settings.
5. In Vercel Project → Settings → Environment Variables, add `GROQ_API_KEY` and optionally `GROQ_MODEL`.
6. Redeploy after adding the variables.

## Important limitations
This is a fast portfolio MVP, not a secure examination platform. It does not save exams/results in a database, authenticate candidates, enforce timers, or provide real proctoring. Browser focus warnings cannot stop AI use on another device. Do not use it for high-stakes exams until authentication, database storage, server-side answer keys, rate limits, audit logs and human-reviewed proctoring are added.

Keep your API key private. Never use a `NEXT_PUBLIC_` prefix for it and never commit `.env.local`.
