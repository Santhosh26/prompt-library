// Define common use cases for prompts
export const PROMPT_USE_CASES = [
    "Creative Writing",
    "Data Analysis",
    "Education",
    "Email & Communication",
    "LLM Evaluation",
    "Marketing",
    "Personal Assistant",
    "Programming",
    "Research",
    "Sales",
    "SEO & Content",
    "Social Media",
    "Summarization",
    "Translation",
    "Other"
  ] as const;
  
  export type PromptUseCase = typeof PROMPT_USE_CASES[number];