
import React, { useEffect } from "react";

const generateFirework = (id: number) => ({
  id,
  style: {
    left: `${Math.random() * 90 + 5}%`,
    animationDelay: `${Math.random() * 0.5}s`,
    background: `hsl(${Math.floor(Math.random() * 360)}, 90%, 54%)`,
  },
});

export const Fireworks: React.FC = () => {
  const [fireworks, setFireworks] = React.useState(
    Array.from({ length: 17 }, (_, i) => generateFirework(i))
  );

  useEffect(() => {
    // regenerate fireworks occasionally for a repeating salyut!
    const interval = setInterval(() => {
      setFireworks(Array.from({ length: 17 }, (_, i) => generateFirework(i)));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed pointer-events-none left-0 top-0 w-full h-full z-50">
      {fireworks.map(firework => (
        <div
          key={firework.id}
          className="absolute bottom-0"
          style={{ left: firework.style.left, animation: "firework-explode 1.1s cubic-bezier(.21,1.11,.81,-0.11) forwards", animationDelay: firework.style.animationDelay }}
        >
          <span
            className="block rounded-full w-4 h-4"
            style={{
              background: firework.style.background,
              filter: "brightness(1.16) blur(1.8px)",
            }}
          ></span>
        </div>
      ))}
      <style>
        {`
          @keyframes firework-explode {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0.6;
              filter: blur(2px);
            }
            10% {
              opacity: 1;
              filter: blur(0.5px);
            }
            70% {
              transform: translateY(-230px) scale(1.7);
              opacity: 1;
              filter: blur(0.8px);
            }
            100% {
              transform: translateY(-285px) scale(2.3);
              opacity: 0;
              filter: blur(2px);
            }
          }
        `}
      </style>
    </div>
  );
};
