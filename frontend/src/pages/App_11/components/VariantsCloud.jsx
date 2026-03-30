import variantBg from "../assets/variantBg.png";

export default function VariantsCloud({ variants }) {
  if (!variants) return null;

  return (
    <div className="w-full " >
      <h2 className="text-4xl mb-8 underline">name-variants.arr</h2>

      <div className="flex flex-wrap justify-center gap-10  px-6">
        {variants.map((variant, index) => {

          // Stable rotation
          const rotation = (index % 2 === 0 ? -1 : 1) * (4 + index * 2);

          // Different scale per item
          const scale = 0.8 + (index % 3) * 0.2;

          // Different text size
          const textSizes = ["text-3xl", "text-3xl", "text-3xl"];
          const textSize = textSizes[index % textSizes.length];

          return (

            
            <div
              key={index}
              className="relative inline-block "
              style={{
                transform: `rotate(${rotation}deg) scale(${scale})`
              }}
            >
              {/* Full image shown without cropping */}
              <img
                src={variantBg}
                alt=""
                className="block"
              />

              {/* Overlay text */}
              <div className={`absolute  inset-0 flex items-center justify-center font-bold text-black ${textSize} `}>
                {variant}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
