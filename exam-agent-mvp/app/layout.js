import "./globals.css";
export const metadata = { title: "ExamPilot", description: "AI-assisted online exams" };
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
