import React, { useEffect } from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RegisterPage: React.FC = () => {
  useEffect(() => {
    document.title = "Cadastrar | Skill Learning";
  }, []);

  return (
    <main className="container mx-auto px-6 py-10">
      <nav className="mb-6 flex">
        <Button asChild variant="outline" className="glass-card border-glass-border hover:border-primary">
          <Link to="/">← Voltar para a inicial</Link>
        </Button>
      </nav>
      <section className="flex items-center justify-center min-h-[60vh]">
        <RegisterForm />
      </section>
    </main>
  );
};

export default RegisterPage;
