
import React, { useState, useCallback, useEffect } from 'react';
import { VeoSegment, ScriptState } from './types';
import { generateVeoScript } from './geminiService';
import Header from './components/Header';
import DirectorControls from './components/DirectorControls';
import ScriptTimeline from './components/ScriptTimeline';
import VideoGenerator from './components/VideoGenerator';

const App: React.FC = () => {
  const [scriptState, setScriptState] = useState<ScriptState>({
    segments: [],
    isGenerating: false,
    error: null,
  });
  const [concept, setConcept] = useState('');
  const [numSegments, setNumSegments] = useState(6);
  const [selectedSegment, setSelectedSegment] = useState<VeoSegment | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasApiKey(true);
  };

  const handleGenerateScript = async () => {
    if (!concept.trim()) return;
    
    setScriptState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const segments = await generateVeoScript(concept, numSegments);
      setScriptState({
        segments,
        isGenerating: false,
        error: null,
      });
      setSelectedSegment(null);
    } catch (err: any) {
      setScriptState({
        segments: [],
        isGenerating: false,
        error: err.message || "An unexpected error occurred during script generation.",
      });
    }
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111] border border-zinc-800 rounded-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">API Configuration Required</h1>
          <p className="text-zinc-400">
            To use the Veo Pipeline Director, you must select a valid API key from a paid Google Cloud project.
          </p>
          <button
            onClick={handleOpenKeyDialog}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Select API Key
          </button>
          <div className="pt-4 text-sm">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Learn more about billing & quotas
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar: Controls */}
        <div className="w-80 border-r border-zinc-800 flex flex-col bg-[#0f0f0f]">
          <DirectorControls 
            concept={concept}
            setConcept={setConcept}
            numSegments={numSegments}
            setNumSegments={setNumSegments}
            onGenerate={handleGenerateScript}
            isGenerating={scriptState.isGenerating}
          />
        </div>

        {/* Center: Timeline */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
          <ScriptTimeline 
            segments={scriptState.segments} 
            isGenerating={scriptState.isGenerating}
            error={scriptState.error}
            onSelectSegment={setSelectedSegment}
            selectedSegmentId={selectedSegment?.segment_id}
          />
        </div>

        {/* Right Panel: Preview & Details */}
        <div className="w-96 border-l border-zinc-800 bg-[#0f0f0f] overflow-y-auto">
          {selectedSegment ? (
            <VideoGenerator segment={selectedSegment} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-500 space-y-4">
              <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p>Select a segment from the timeline to view details and generate a visual preview.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
