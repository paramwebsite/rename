import React, { useState } from 'react';

export function LetterImage({ data, totalLetters, index, isSpace }) {
  const [isLoaded, setIsLoaded] = useState(false); // Track image load state

  const baseWidth = Math.min(300, Math.max(100, 800 / totalLetters));
  const baseHeight = (baseWidth * 1920) / 1080;

  if (isSpace) {
    return <div style={{ width: baseWidth * 0.5 }} />;
  }

  return (
    <div
      className="flex flex-col items-center group"
      style={{
        animation: `fadeSlideIn 0.5s ease-out forwards`,
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
        transform: 'translateY(20px)',
      }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 shadow-lg transition-transform duration-300 group-hover:scale-105">
        {/* Placeholder Skeleton while Image Loads */}
        {!isLoaded && (
          <div
            className="absolute inset-0 bg-gray-800 animate-pulse"
            style={{ width: baseWidth, height: baseHeight }}
          />
        )}

        {/* Image with Fade-in Effect */}
        <img
          src={data.image}
          alt={`Landsat imagery from ${data.location}`}
          className={`transition-transform duration-300 group-hover:scale-110 ${
            isLoaded ? 'opacity-100' : 'opacity-100'
          }`}
          style={{ width: baseWidth, height: baseHeight }}
          onLoad={() => setIsLoaded(true)} // Show image when loaded
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Text Containers */}
      <div
        className="w-36 max-w-full whitespace-normal text-sm text-blue-300 hover:text-blue-200 transition-colors mt-2 group-hover:underline text-center"
        style={{ width: baseWidth }}
      >
        {data.location}
      </div>
      <div
        className="w-36 max-w-full whitespace-normal text-sm text-blue-300 hover:text-blue-200 transition-colors mt-2 group-hover:underline text-center"
        style={{ width: baseWidth }}
      >
        {data.coordinates}
      </div>
    </div>
  );
}
