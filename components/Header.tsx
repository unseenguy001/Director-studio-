
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#0f0f0f] shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          Veo Pipeline Director
          <span className="text-[10px] uppercase tracking-widest bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">Pro v3.1</span>
        </h1>
      </div>
      <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          AI Cinematographer Online
        </div>
      </div>
    </header>
  );
};

export default Header;
