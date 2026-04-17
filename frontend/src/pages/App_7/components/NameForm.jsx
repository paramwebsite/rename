import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function NameForm({ onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  console.log("fuck it ")

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-8"
    >
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
            Enter your name
          </h1>
          <p className="text-zinc-400 text-lg">
            Experience it in motion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={16}
              placeholder="Your Name"
              className="w-full bg-zinc-950/50 border-2 border-zinc-800 rounded-2xl px-6 py-5 text-2xl text-center text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              autoFocus
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-white text-black rounded-2xl px-6 py-5 text-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors active:scale-[0.98]"
          >
            Animate <ArrowRight className="w-6 h-6" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
