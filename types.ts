
export interface VeoSegment {
  segment_id: number;
  visual_prompt: string;
  continuity_anchor: string;
  audio_instruction: string;
}

export interface ScriptState {
  segments: VeoSegment[];
  isGenerating: boolean;
  error: string | null;
}

export type AspectRatio = "16:9" | "9:16";
export type Resolution = "720p" | "1080p";
