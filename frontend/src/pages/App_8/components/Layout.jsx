import React from 'react';

export function Layout({ children }) {
  return (
    <div className="min-h-screen">
      {children}
      <footer className="fixed bottom-0 w-full bg-blue-900/90 backdrop-blur-sm text-white text-center py-2 text-xs sm:text-sm">
        <p>Type your question and press Enter</p>
      </footer>
    </div>
  );
}
