# ExamPilot — clean root-level project

This project is structured for a single Vercel Next.js deployment.

## Correct folder structure

```text
OnlineExam/
├── app/
│   ├── api/
│   │   └── exam/
│   │       └── route.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Important: `package.json` and `app/` must be directly inside the GitHub repository root. Do not put this project inside another `exam-agent-mvp/` folder.

## Deploy on Vercel (no local installs required)

1. Upload the contents of this folder to the root of your GitHub repository.
2. In Vercel, import the repository as a single Next.js project.
3. Set Root Directory to `./`.
4. Add `GROQ_API_KEY` with your Groq API key.
5. Optionally add `GROQ_MODEL` with value `openai/gpt-oss-20b`.
6. Deploy. Vercel installs dependencies in its cloud build environment.

No `vercel.json` or multi-service configuration is required.

## Local development (optional)

Local development is not required for Vercel deployment. If desired, use Node.js 20+, `npm install`, configure `.env.local`, then run `npm run dev`.

## MVP limitations

This is a portfolio prototype. It does not yet include authentication, database persistence, server-side exam session storage, timers, or reliable proctoring. The focus warning is not proof that a candidate did or did not use AI. Oral answers are entered as text transcripts, not captured from a live microphone.

Keep API keys private. Never commit `.env.local` or expose the key in browser-side code.
