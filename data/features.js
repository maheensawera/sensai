import {
  BrainCircuit,
  Briefcase,
  LineChart,
  ScrollText,
} from "lucide-react";

export const features = [
  {
    icon: <ScrollText className="w-8 h-8 text-primary" />,
    title: "Resume Builder",
    short: "AI-Powered Resume Creation",
    stat: "3x More Interviews",
    tags: ["ATS-Optimized", "AI-Generated", "Editable"],
    buttonText: "Try Resume Builder",
    description:
      "Generate ATS-optimized resumes with AI precision. Beat applicant tracking systems and reach human eyes.",
    highlights: [
      { label: "Format", value: "ATS-Friendly" },
      { label: "Speed", value: "2-Minute Setup" },
      { label: "Export", value: "PDF & Docx" },
    ],
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: "Cover Letter Generator",
    short: "Personalized Job Applications",
    stat: "60s Generation",
    tags: ["Personalized", "Role-specific", "Exportable"],
    buttonText: "Try Cover Letter Generator",
    description:
      "Craft personalized, compelling cover letters in seconds. Tailored to each job, each company, and each role.",
    highlights: [
      { label: "Custom", value: "Job-Specific" },
      { label: "Tone", value: "Professional" },
      { label: "AI", value: "Instant Edit" },
    ],
  },
  {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    title: "Mock Interview",
    short: "AI-Guided Interview Prep",
    stat: "1,000+ Questions",
    tags: ["AI Feedback", "Real-time", "Role-based"],
    buttonText: "Try Mock Interview",
    description:
      "Practice with AI-powered mock interviews. Get real-time feedback, score your answers, and build confidence.",
    highlights: [
      { label: "Feedback", value: "Real-time AI" },
      { label: "Coverage", value: "50+ Roles" },
      { label: "Analytics", value: "Score Tracking" },
    ],
  },
  {
    icon: <LineChart className="w-8 h-8 text-primary" />,
    title: "Industry Insights",
    short: "Market Intel & Trends",
    stat: "50+ Industries",
    tags: ["Live Data", "Salary Trends", "Market Intel"],
    buttonText: "Try Industry Insights",
    description:
      "Stay ahead with weekly-updated salary data, market trends, and in-demand skills for your field.",
    highlights: [
      { label: "Salary", value: "Market Trends" },
      { label: "Skills", value: "In-Demand List" },
      { label: "Data", value: "Weekly Updates" },
    ],
  },
];