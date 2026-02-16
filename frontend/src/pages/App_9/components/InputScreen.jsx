// // src/components/InputScreen.jsx
// import { useState } from "react";

// export default function InputScreen({ onSubmit }) {
//   const [name, setName] = useState("");

//   return (
//     <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#f3e2b3] px-4">
//       <h1 className="text-3xl font-bold text-black">Enter Your Name</h1>

//       <input
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Type your name"
//         className="w-[260px] rounded-md border border-black/20 bg-white px-3 py-3 text-[18px] text-black outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10"
//       />

//       <button
//         onClick={() => name.trim() && onSubmit(name)}
//         className="cursor-pointer rounded-md bg-black px-6 py-3 text-[16px] font-semibold text-white transition hover:bg-black/85 active:bg-black"
//       >
//         Generate Glyphs
//       </button>
//     </div>
//   );
// }


// src/components/InputScreen.jsx

export default function InputScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <img
        src="/static.gif"
        alt="glitch"
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}
