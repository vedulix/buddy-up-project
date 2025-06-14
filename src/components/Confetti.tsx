
import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: {
    x: number;
    y: number;
    rotation: number;
  };
}

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(true);

  const colors = ['#FECD02', '#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

  useEffect(() => {
    // Create initial confetti pieces
    const initialPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      initialPieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2,
          rotation: (Math.random() - 0.5) * 10,
        },
      });
    }
    setPieces(initialPieces);

    // Animation loop
    const animate = () => {
      setPieces(prevPieces => 
        prevPieces.map(piece => ({
          ...piece,
          x: piece.x + piece.velocity.x,
          y: piece.y + piece.velocity.y,
          rotation: piece.rotation + piece.velocity.rotation,
        })).filter(piece => piece.y < window.innerHeight + 20)
      );
    };

    const interval = setInterval(animate, 16);

    // Stop after 4 seconds
    const timeout = setTimeout(() => {
      setIsActive(false);
      clearInterval(interval);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!isActive && pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 opacity-90"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
