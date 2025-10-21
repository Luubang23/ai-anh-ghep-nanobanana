
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { ImageData } from '../types';

interface ImageUploaderProps {
  title: string;
  onImageUpload: (imageData: ImageData | null) => void;
}

const fileToBase64 = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (base64) {
        resolve({ base64, mimeType: file.type });
      } else {
        reject(new Error('Failed to read file as base64.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageData = await fileToBase64(file);
        onImageUpload(imageData);
        setPreview(URL.createObjectURL(file));
        setFileName(file.name);
      } catch (error) {
        console.error("Error converting file:", error);
        onImageUpload(null);
        setPreview(null);
        setFileName(null);
      }
    }
  }, [onImageUpload]);

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-300 mb-4">{title}</h2>
      <div 
        className="flex-grow border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-purple-400 hover:bg-gray-700/50 transition-colors"
        onClick={handleAreaClick}
      >
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        {preview ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <img src={preview} alt="Preview" className="max-h-64 w-auto object-contain rounded-md" />
            {fileName && <p className="text-sm text-gray-400 mt-2 truncate max-w-full px-2">{fileName}</p>}
          </div>
        ) : (
          <div className="text-gray-500">
            <UploadIcon className="w-12 h-12 mx-auto mb-3" />
            <p className="font-semibold">Nhấn để tải lên</p>
            <p className="text-sm">hoặc kéo và thả</p>
            <p className="text-xs mt-2">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};
