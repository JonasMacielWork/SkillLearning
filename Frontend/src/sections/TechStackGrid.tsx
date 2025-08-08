import { Card } from "@/components/ui/card";

interface TechStackGridProps {
  techStack: string[];
}

const TechStackGrid = ({ techStack }: TechStackGridProps) => (
  <section className="mb-16">
    <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Stack Tecnológica</h2>

    <Card className="glass-card p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {techStack.map((tech, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl bg-gradient-glass p-4 text-center hover-lift animate-slide-up border border-glass-border/50"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <span className="relative z-10 text-sm font-medium text-foreground group-hover:text-primary-foreground transition-colors">
              {tech}
            </span>
            <div className="absolute inset-0 rounded-xl bg-glass/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </Card>
  </section>
);

export default TechStackGrid;
