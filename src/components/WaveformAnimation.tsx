import React from 'react';

export function WaveformAnimation() {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-primary rounded-full animate-pulse"
          style={{
            height: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}
    </div>
  );
}