import React, { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

const LoginPage: React.FC = () => {
  useEffect(() => {
    document.title = "Login | Skill Learning";
  }, []);

  return (
    <main className="container mx-auto px-6 py-10">
      <nav className="mb-6 flex">
        <Button asChild variant="outline" className="glass-card border-glass-border hover:border-primary">
          <Link to="/">← Voltar para a inicial</Link>
        </Button>
      </nav>
      <section className="flex items-center justify-center min-h-[60vh]">
        <LoginForm />
      </section>
    </main>
  );
};

export default LoginPage;
