import { Card } from "@/components/ui/card";
import type { Feature } from "@/data/features";

interface FeaturesGridProps {
  features: Feature[];
}

const FeaturesGrid = ({ features }: FeaturesGridProps) => (
  <section className="mb-16">
    <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Features Principais</h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <Card
          key={index}
          className="glass-card p-6 text-center hover-lift animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-${feature.color} flex items-center justify-center mx-auto mb-4 glow-${feature.color}`}>
            {feature.icon}
          </div>
          <h3 className="font-semibold mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </Card>
      ))}
    </div>
  </section>
);

export default FeaturesGrid;
