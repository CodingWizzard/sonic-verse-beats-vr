
import React from 'react';

const AnimatedBubbles = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, index) => {
        const size = 30 + Math.random() * 100;
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 5;
        const animationDuration = 15 + Math.random() * 20;
        
        return (
          <div
            key={index}
            className="absolute rounded-full bg-sonic-blue/10"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${animationDelay}s`,
              animationDuration: `${animationDuration}s`,
              animation: `floating ${animationDuration}s ease-in-out ${animationDelay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
};

export default AnimatedBubbles;
