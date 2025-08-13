import * as React from "react";
import { cn } from "@/lib/utils";

interface InteractiveGlassProps extends React.HTMLAttributes<HTMLDivElement> {}

const InteractiveGlass: React.FC<InteractiveGlassProps> = ({ className, children, ...props }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);

    const rotateX = ((y / rect.height) - 0.5) * -2; // sutil
    const rotateY = ((x / rect.width) - 0.5) * 2;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
    el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("glass-interactive", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default InteractiveGlass;
