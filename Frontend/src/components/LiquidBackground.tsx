import React from "react";

const LiquidBackground: React.FC = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 liquid-bg"
    />
  );
};

export default LiquidBackground;
