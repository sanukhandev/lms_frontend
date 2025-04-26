import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | LMS Platform",
  description:
    "Secure login to access your personalized LMS dashboard. Whether you're a student, instructor, or admin – track your courses, manage sessions, and monitor progress from one place.",
};

export default function SignIn() {
   
  return <SignInForm />;
}
