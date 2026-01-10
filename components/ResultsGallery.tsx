import React from 'react';
import { GeneratedResult, MockupScenario } from '../types';

interface ResultsGalleryProps {
  results: GeneratedResult[];
  scenarios: MockupScenario[];
}

const ResultsGallery: React.FC<ResultsGalleryProps> = ({ results, scenarios }) => {
  const getScenario = (id: string) => scenarios.find(s => s.id === id);

  if (results.length === 0) return null;

  return (
    <div className="w-full mt-12">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Generated Mockups</span>
        <span className="text-sm font-normal text-slate-500 ml-auto">Downloads available</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result) => {
          const scenario = getScenario(result.scenarioId);
          if (!scenario) return null;

          return (
            <div key={result.scenarioId} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex flex-col">
              <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{scenario.icon}</span>
                    <h3 className="font-semibold text-slate-200">{scenario.title}</h3>
                </div>
                {result.status === 'success' && result.imageUrl && (
                    <a 
                      href={result.imageUrl} 
                      download={`packgenie-${result.scenarioId}.png`}
                      className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Download
                    </a>
                )}
              </div>
              
              <div className="relative w-full aspect-video bg-slate-900 flex items-center justify-center">
                {result.status === 'generating' ? (
                  <div className="flex flex-col items-center gap-3 animate-pulse">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-indigo-400 font-medium">Generating Scene...</span>
                  </div>
                ) : result.status === 'pending' ? (
                   <div className="flex flex-col items-center gap-2 opacity-50">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-dashed animate-spin-slow"></div>
                    <span className="text-xs text-slate-500 font-medium">In Queue...</span>
                  </div>
                ) : result.status === 'error' ? (
                  <div className="p-6 text-center text-red-400">
                    <p className="font-bold mb-1">Generation Failed</p>
                    <p className="text-xs opacity-80">{result.error}</p>
                  </div>
                ) : result.imageUrl ? (
                  <img 
                    src={result.imageUrl} 
                    alt={scenario.title} 
                    className="w-full h-full object-cover animate-fade-in"
                  />
                ) : (
                  <div className="text-slate-600 text-sm">Waiting to start...</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsGallery;
