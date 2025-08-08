import React from "react";
import { Shield, MessageSquare, Database, Code } from "lucide-react";

export type FeatureColor = "primary" | "secondary" | "accent";

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: FeatureColor;
}

export const features: Feature[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Autenticação JWT",
    description: "Sistema completo com refresh tokens",
    color: "primary",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "SignalR Real-time",
    description: "Notificações em tempo real",
    color: "secondary",
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "CQRS + Redis",
    description: "Cache distribuído e performance",
    color: "accent",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Clean Architecture",
    description: "DDD e padrões avançados",
    color: "primary",
  },
];
