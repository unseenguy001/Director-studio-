
import React from 'react';

interface Props {
  concept: string;
  setConcept: (val: string) => void;
  numSegments: number;
  setNumSegments: (val: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const DirectorControls: React.FC<Props> = ({
  concept,
  setConcept,
  numSegments,
  setNumSegments,
  onGenerate,
  isGenerating
}) => {
  return (
    <div className="p-6 flex flex-col h-full space-y-8">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Cinematic Concept</label>
        <textarea
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="e.g., A continuous track of a cybernetic warrior walking through a shifting glass labyrinth at dawn..."
          className="w-full h-48 bg-[#1a1a1a] border border-zinc-800 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none transition-all placeholder:text-zinc-700"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Sequence Duration</label>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-blue-400">{numSegments * 10} seconds</span>
            <span className="text-xs text-zinc-500">{numSegments} blocks</span>
          </div>
          <input
            type="range"
            min="3"
            max="30"
            step="1"
            value={numSegments}
            onChange={(e) => setNumSegments(parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-zinc-600 uppercase font-bold">
            <span>Short (30s)</span>
            <span>Feature (5m)</span>
          </div>
        </div>
      </div>

      <div className="flex-1"></div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || !concept.trim()}
        className={`w-full py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
          isGenerating 
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/10'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-zinc-500 border-t-white rounded-full animate-spin"></div>
            Drafting Script...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.727 2.903a2 2 0 01-3.568.735l-1.314-2.628a2 2 0 00-1.86-1.071l-2.428.121a2 2 0 00-1.814 1.513l-.307 1.538a2 2 0 01-1.945.61l-2.39-.597a2 2 0 00-2.022 1.512l-.307 1.538a2 2 0 01-1.945.61l-2.39-.597" />
            </svg>
            Initialize Pipeline
          </>
        )}
      </button>

      <div className="text-[10px] text-zinc-600 text-center uppercase tracking-widest font-bold">
        Engine: Gemini 3 Pro
      </div>
    </div>
  );
};

export default DirectorControls;
