import React, { useEffect, useState } from "react";

/* Portrait image ratio */
const IMAGE_ASPECT = 1080 / 1920; // width / height = 0.5625

export function LetterImage({
  data,
  index,
  totalLetters,
  containerWidth,
  containerHeight,
  isSpace,
}) {
  const [showLocation, setShowLocation] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  /* ---------------- Layout constants ---------------- */
  const GAP = containerWidth * 0.01;
  const TEXT_HEIGHT = containerHeight * 0.12;
  const VERTICAL_PADDING = containerHeight * 0.08;

  if (isSpace) {
    return <div style={{ width: containerWidth * 0.03 }} />;
  }

  /* ---------------- Core sizing math ---------------- */
  const usableWidth =
    containerWidth - GAP * (totalLetters - 1);
  const maxWidthPerLetter = usableWidth / totalLetters;

  const maxImageHeight =
    containerHeight - TEXT_HEIGHT - VERTICAL_PADDING;

  /* Candidate sizes */
  const widthFromHeight = maxImageHeight * IMAGE_ASPECT;
  const heightFromWidth = maxWidthPerLetter / IMAGE_ASPECT;

  let imageWidth, imageHeight;

  if (widthFromHeight <= maxWidthPerLetter) {
    imageWidth = widthFromHeight;
    imageHeight = maxImageHeight;
  } else {
    imageWidth = maxWidthPerLetter;
    imageHeight = heightFromWidth;
  }

  /* ---------------- Text toggle ---------------- */
  useEffect(() => {
    const interval = setInterval(
      () => setShowLocation((v) => !v),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-center"
      style={{
        animation: "fadeSlideIn 0.5s ease-out forwards",
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
        transform: "translateY(20px)",
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-lg"
        style={{ width: imageWidth, height: imageHeight }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse" />
        )}

        <img
          src={data.image}
          alt={data.location}
          onLoad={() => setIsLoaded(true)}
          style={{
            width: imageWidth,
            height: imageHeight,
            objectFit: "cover",
          }}
        />
      </div>

      {/* Text */}
      <div
        className="
          mt-2
          flex
          items-center
          justify-center
          text-center
          text-blue-100
          bg-[#06264D]
          rounded-md
          px-2
        "
        style={{
          width: imageWidth,
          height: TEXT_HEIGHT,
          fontSize: containerHeight * 0.035,
          boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.3)",
        }}
      >
        {showLocation ? data.location : data.coordinates}
      </div>
    </div>
  );
}
  