import React, { useState } from 'react';
import { UploadedImage, GeneratedResult } from './types';
import { SCENARIOS } from './constants';
import { generateMockupImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ResultsGallery from './components/ResultsGallery';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<{
    front: UploadedImage | null;
    side: UploadedImage | null;
    top: UploadedImage | null;
  }>({
    front: null,
    side: null,
    top: null
  });

  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,") to get raw base64
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async (id: string, file: File) => {
    try {
      const base64Data = await fileToBase64(file);
      const newImage: UploadedImage = {
        id: id as 'front' | 'side' | 'top',
        label: id.charAt(0).toUpperCase() + id.slice(1) + ' View',
        data: base64Data,
        mimeType: file.type
      };

      setInputs(prev => ({ ...prev, [id]: newImage }));
    } catch (err) {
      console.error("Error reading file", err);
    }
  };

  const handleRemove = (id: string) => {
    setInputs(prev => ({ ...prev, [id]: null }));
  };

  const handleGenerate = async () => {
    if (!inputs.front || !inputs.side || !inputs.top) {
      alert("Please upload all three images (Front, Side, and Top) to proceed.");
      return;
    }

    setIsGenerating(true);
    
    // Initialize results with 'pending' state
    const initialResults: GeneratedResult[] = SCENARIOS.map(s => ({
      scenarioId: s.id,
      imageUrl: null,
      status: 'pending',
      error: null
    }));
    setResults(initialResults);

    const uploadedImages = [inputs.front, inputs.side, inputs.top];

    // Process Sequentially to avoid Rate Limiting (429 errors)
    for (let i = 0; i < SCENARIOS.length; i++) {
      const scenario = SCENARIOS[i];
      let isRateLimitError = false;

      // Update current item to 'generating'
      setResults(prev => prev.map(r => 
        r.scenarioId === scenario.id ? { ...r, status: 'generating' } : r
      ));

      try {
        const imageUrl = await generateMockupImage(uploadedImages, scenario.promptSuffix);
        
        // Update to success
        setResults(prev => prev.map(r => 
          r.scenarioId === scenario.id ? { ...r, status: 'success', imageUrl } : r
        ));
      } catch (error: any) {
        console.error(`Failed to generate ${scenario.id}:`, error);
        
        const is429 = error.message?.includes('429') || error.status === 429 || error.code === 429;
        if (is429) {
          isRateLimitError = true;
        }

        // Update to error
        setResults(prev => prev.map(r => 
          r.scenarioId === scenario.id ? { ...r, status: 'error', error: error.message || "Failed to generate" } : r
        ));
      }

      // Add delay between requests
      if (i < SCENARIOS.length - 1) {
        // Default delay: 10 seconds to stay within generous RPM limits
        let delay = 10000; 

        // If we hit a hard rate limit error despite internal retries, 
        // pause for 60 seconds to let the quota bucket completely refill/reset.
        if (isRateLimitError) {
          console.warn("Rate limit exhausted. Pausing queue for 60 seconds...");
          delay = 60000;
        }

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    setIsGenerating(false);
  };

  const isReady = inputs.front && inputs.side && inputs.top;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
              🎁
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">PackGenie</h1>
              <p className="text-xs text-slate-400">AI Mockup Generator • Nano Banana</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-slate-400 border border-slate-700">
              Model: gemini-2.5-flash-image
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Turn Flat Designs into <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Realistic Mockups
            </span>
          </h2>
          <p className="text-lg text-slate-400">
            Upload your packaging layout files (Front, Side, Top), and our AI will generate professional product shots in seconds.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700 backdrop-blur-sm shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <ImageUploader 
                    id="front" 
                    label="Front View" 
                    image={inputs.front?.data || null} 
                    onUpload={handleUpload} 
                    onRemove={handleRemove}
                />
                <ImageUploader 
                    id="side" 
                    label="Side View" 
                    image={inputs.side?.data || null} 
                    onUpload={handleUpload} 
                    onRemove={handleRemove}
                />
                <ImageUploader 
                    id="top" 
                    label="Top View" 
                    image={inputs.top?.data || null} 
                    onUpload={handleUpload} 
                    onRemove={handleRemove}
                />
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleGenerate}
                    disabled={!isReady || isGenerating}
                    className={`
                        relative px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform
                        ${isReady && !isGenerating
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 cursor-pointer' 
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                    `}
                >
                    {isGenerating ? (
                        <span className="flex items-center gap-2">
                           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing 10 Scenes...
                        </span>
                    ) : (
                        "Generate 10 Mockups"
                    )}
                </button>
            </div>
            
            {!isReady && (
                <p className="text-center text-slate-500 text-sm mt-4">
                    * Please upload all 3 views to start generation
                </p>
            )}
        </div>

        {/* Results Section */}
        <ResultsGallery results={results} scenarios={SCENARIOS} />

      </main>

    </div>
  );
};

export default App;