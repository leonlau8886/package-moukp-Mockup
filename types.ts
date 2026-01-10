export interface UploadedImage {
  id: 'front' | 'side' | 'top';
  label: string;
  data: string; // Base64 string
  mimeType: string;
}

export interface MockupScenario {
  id: string;
  title: string;
  description: string;
  promptSuffix: string;
  icon: string;
}

export type GenerationStatus = 'idle' | 'pending' | 'generating' | 'success' | 'error';

export interface GeneratedResult {
  scenarioId: string;
  imageUrl: string | null;
  status: GenerationStatus;
  error: string | null;
}
