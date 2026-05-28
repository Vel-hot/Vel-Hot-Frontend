import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion - Vél'Hot",
  description: "Connectez-vous à votre compte Vél'Hot",
};

export default function LoginPage() {
  return (
    <>
      <h2 className="text-xl font-semibold text-center mb-4">Connexion</h2>
      <LoginForm />
    </>
  );
}
