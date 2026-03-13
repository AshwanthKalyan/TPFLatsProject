// pages/sign-in.tsx
import { SignIn } from "@clerk/react";

export default function SignInPage() {
  return <SignIn routing="path" path="/sign-in" />;
}