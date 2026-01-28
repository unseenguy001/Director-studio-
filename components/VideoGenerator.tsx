
import React, { useState } from 'react';
import { VeoSegment, AspectRatio, Resolution } from '../types';
import { generateVeoVideo } from '../geminiService';

interface Props {
  segment: VeoSegment;
}

const VideoGenerator: React.FC<Props> = ({ segment }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [resolution, setResolution] = useState<Resolution>("720p");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    try {
      const url = await generateVeoVideo(segment.visual_prompt, aspectRatio, resolution);
      setVideoUrl(url);
    } catch (err: any) {
      setError(err.message || "Video generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white">Segment Details</h2>
        <p className="text-xs text-zinc-500 font-mono">BLOCK_ID: {segment.segment_id.toString().padStart(3, '0')}</p>
      </div>

      {/* Video Preview Area */}
      <div className="relative aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden border border-zinc-800 shadow-inner group">
        {videoUrl ? (
          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            loop 
            className="w-full h-full object-cover"
          />
        ) : isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="w-12 h-12 relative">
              <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-xs text-zinc-400 font-medium">Veo 3.1 is synthesizing motion pixels...</p>
            <p className="text-[10px] text-zinc-600 italic">This may take up to 2 minutes.</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-zinc-600">
             <svg className="w-10 h-10 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <p className="text-sm">Preview rendering available</p>
          </div>
        )}
      </div>

      {/* Technical Config */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Aspect Ratio</label>
            <div className="flex gap-2">
              {(["16:9", "9:16"] as AspectRatio[]).map((ar) => (
                <button
                  key={ar}
                  onClick={() => setAspectRatio(ar)}
                  className={`flex-1 py-1.5 text-xs font-mono rounded border transition-all ${
                    aspectRatio === ar ? 'bg-zinc-800 border-blue-600 text-blue-400' : 'bg-transparent border-zinc-800 text-zinc-500'
                  }`}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Target Res</label>
            <div className="flex gap-2">
              {(["720p", "1080p"] as Resolution[]).map((res) => (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  className={`flex-1 py-1.5 text-xs font-mono rounded border transition-all ${
                    resolution === res ? 'bg-zinc-800 border-blue-600 text-blue-400' : 'bg-transparent border-zinc-800 text-zinc-500'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-800">
           <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Segment Prompt</label>
              <div className="bg-[#1a1a1a] p-3 rounded-lg border border-zinc-800 text-xs text-zinc-400 font-mono leading-relaxed">
                {segment.visual_prompt}
              </div>
           </div>

           <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Next Frame Anchor</label>
              <div className="bg-[#1a1a1a] p-3 rounded-lg border border-zinc-800 text-xs text-zinc-500 italic">
                {segment.continuity_anchor}
              </div>
           </div>
        </div>

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-xs text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
            isGenerating 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-white text-black hover:bg-zinc-200'
          }`}
        >
          {isGenerating ? 'Rendering High-Fidelity...' : 'Render Segment Visual'}
        </button>
      </div>
    </div>
  );
};

export default VideoGenerator;
