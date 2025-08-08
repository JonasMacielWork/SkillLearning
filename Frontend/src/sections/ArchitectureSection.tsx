import { Card } from "@/components/ui/card";
import { Users, Activity, Shield, Database } from "lucide-react";

const ArchitectureSection = () => (
  <section className="mb-16">
    <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Arquitetura do Sistema</h2>

    <Card className="glass-card p-8">
      <div className="grid md:grid-cols-4 gap-6 text-center">
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center glow-primary">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold mb-2">Presentation</h3>
          <p className="text-sm text-muted-foreground">API Controllers & SignalR Hubs</p>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-secondary mx-auto mb-4 flex items-center justify-center glow-secondary">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold mb-2">Application</h3>
          <p className="text-sm text-muted-foreground">CQRS & MediatR Handlers</p>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center glow-primary">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold mb-2">Domain</h3>
          <p className="text-sm text-muted-foreground">Entities & Business Logic</p>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="w-16 h-16 rounded-2xl bg-accent mx-auto mb-4 flex items-center justify-center glow-accent">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold mb-2">Infrastructure</h3>
          <p className="text-sm text-muted-foreground">PostgreSQL & External Services</p>
        </div>
      </div>
    </Card>
  </section>
);

export default ArchitectureSection;
