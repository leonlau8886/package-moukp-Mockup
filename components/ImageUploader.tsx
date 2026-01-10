import React, { useCallback } from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  image: string | null;
  onUpload: (id: string, file: File) => void;
  onRemove: (id: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, image, onUpload, onRemove }) => {
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(id, e.target.files[0]);
    }
  }, [id, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(id, e.dataTransfer.files[0]);
    }
  }, [id, onUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-300 uppercase tracking-wide">{label}</span>
      <div 
        className={`
          relative w-full aspect-square rounded-xl border-2 border-dashed transition-all duration-300
          ${image ? 'border-indigo-500 bg-slate-800' : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-800/50 bg-slate-900'}
          flex flex-col items-center justify-center overflow-hidden group
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {image ? (
          <>
            <img src={`data:image/jpeg;base64,${image}`} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => onRemove(id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </>
        ) : (
          <>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center text-slate-400 pointer-events-none p-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-xs">Click or Drop</span>
              <span className="text-[10px] opacity-70 mt-1">PNG, JPG</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
