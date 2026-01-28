
import React from 'react';
import { VeoSegment } from '../types';

interface Props {
  segments: VeoSegment[];
  isGenerating: boolean;
  error: string | null;
  onSelectSegment: (segment: VeoSegment) => void;
  selectedSegmentId?: number;
}

const ScriptTimeline: React.FC<Props> = ({
  segments,
  isGenerating,
  error,
  onSelectSegment,
  selectedSegmentId
}) => {
  if (isGenerating && segments.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600/20 rounded-full"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-white">Rendering Creative Strategy</h3>
          <p className="text-zinc-500 max-w-xs mx-auto">Calculating light paths, camera vectors, and audio textures for your continuous sequence...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-white">Director Outage</h3>
          <p className="text-zinc-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (segments.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40 grayscale">
        <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-zinc-500">Awaiting project specifications.</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Production Script</h2>
        <div className="text-xs font-mono bg-zinc-800 px-3 py-1 rounded-full text-zinc-400">
          Total Blocks: {segments.length}
        </div>
      </div>

      <div className="relative border-l-2 border-zinc-800 ml-4 pl-8 space-y-8">
        {segments.map((segment) => (
          <div 
            key={segment.segment_id} 
            className={`group relative bg-[#111] border rounded-xl p-6 transition-all cursor-pointer hover:border-blue-600/50 ${
              selectedSegmentId === segment.segment_id ? 'border-blue-600 ring-1 ring-blue-600 shadow-xl shadow-blue-600/10' : 'border-zinc-800 shadow-sm'
            }`}
            onClick={() => onSelectSegment(segment)}
          >
            {/* Timeline dot */}
            <div className={`absolute -left-[41px] top-8 w-4 h-4 rounded-full border-2 border-[#0a0a0a] transition-colors ${
              selectedSegmentId === segment.segment_id ? 'bg-blue-600' : 'bg-zinc-800 group-hover:bg-zinc-700'
            }`}></div>

            <div className="flex items-start justify-between mb-4">
              <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
                Block {segment.segment_id} / T+{ (segment.segment_id - 1) * 10 }s
              </span>
              <div className="flex gap-2">
                <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono">10.0s</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 block">Visual Strategy</label>
                <p className="text-zinc-300 leading-relaxed text-sm italic">
                  "{segment.visual_prompt}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800 grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1 block">Continuity Anchor</label>
                  <p className="text-zinc-500 text-xs line-clamp-2">
                    {segment.continuity_anchor}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-1 block">Audio Atmosphere</label>
                  <p className="text-zinc-500 text-xs line-clamp-2">
                    {segment.audio_instruction}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptTimeline;
