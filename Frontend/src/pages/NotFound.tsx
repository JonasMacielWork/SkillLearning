import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Helmet>
        <title>404 | Página não encontrada</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <main className="text-center">
        <h1 className="text-5xl font-bold mb-3">404</h1>
        <p className="text-lg text-muted-foreground mb-6">Oops! Página não encontrada.</p>
        <Button asChild variant="glass">
          <a href="/">Voltar para o início</a>
        </Button>
      </main>
    </div>
  );
};

export default NotFound;
