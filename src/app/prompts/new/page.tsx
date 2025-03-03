// app/prompts/new/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export default async function NewPromptPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // If no session, redirect or show a sign-in prompt
    return <div>Please sign in to submit a new prompt.</div>;
  }

  // If signed in, render your form
  return <div>Form for new prompt...</div>;
}
