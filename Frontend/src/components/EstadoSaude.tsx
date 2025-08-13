import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSaude } from "@/hooks/useSaude";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, HeartPulse } from "lucide-react";

const EstadoSaude = () => {
  const { data, isLoading, isError, refetch, isFetching } = useSaude();

  if (isError) {
    toast({
      title: "Falha ao consultar saúde da API",
      description: "Verifique se a API está rodando em https://localhost:7140",
      variant: "destructive",
    });
  }

  const healthy = data?.healthy;

  return (
    <section aria-labelledby="api-health-heading" className="mb-8">
      <h2 id="api-health-heading" className="sr-only">Saúde da API</h2>
      <Card className="glass-card p-4 border-glass-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isLoading ? 'bg-muted' : healthy ? 'bg-accent' : 'bg-destructive'}`}></div>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Checando saúde da API…' : healthy ? 'API saudável' : 'API indisponível'}
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="glass-card border-glass-border" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </Card>
    </section>
  );
};

export default EstadoSaude;
