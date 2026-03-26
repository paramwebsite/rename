
import React, { useState } from 'react';

interface NameInputProps {
  onSearch: (name: string) => void;
  isLoading: boolean;
}

const NameInput: React.FC<NameInputProps> = ({ onSearch, isLoading }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSearch(value);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
          placeholder="Search Name Frequency..."
          className="w-96 px-6 py-4 bg-[#f4e4bc] border-4 border-[#5d4037] text-center text-2xl text-[#5d4037] placeholder:text-[#5d4037]/30 focus:outline-none focus:ring-4 focus:ring-[#8a3b2e]/30 antique-texture transition-all disabled:opacity-50 shadow-lg"
          style={{ fontFamily: "'IM Fell English', serif" }}
        />
        <div className="absolute -bottom-2 -right-2 w-full h-full border-2 border-[#5d4037] -z-10 group-focus-within:translate-x-1 group-focus-within:translate-y-1 transition-transform"></div>
      </form>
      <p className="text-[#5d4037]/50 italic text-base tracking-wide uppercase" style={{ fontFamily: "'IM Fell English SC', serif" }}>
        {isLoading ? "Consulting the scrolls..." : "Press Enter to Query the World"}
      </p>
    </div>
  );
};

export default NameInput;
