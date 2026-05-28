import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription - Vél'Hot",
  description: "Créez votre compte Vél'Hot",
};

export default function RegisterPage() {
  return (
    <>
      <h2 className="text-xl font-semibold text-center mb-4">Inscription</h2>
      <RegisterForm />
    </>
  );
}
