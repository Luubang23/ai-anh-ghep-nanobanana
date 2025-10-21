
import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { generateImage } from './services/geminiService';
import { ImageData } from './types';
import { PhotoIcon } from './components/icons/PhotoIcon';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<ImageData | null>(null);
  const [productImage, setProductImage] = useState<ImageData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!personImage || !productImage) {
      setError('Vui lòng tải lên cả hai ảnh.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateImage(personImage, productImage);
      setGeneratedImage(`data:image/jpeg;base64,${result}`);
    } catch (e) {
      console.error(e);
      setError('Không thể tạo ảnh. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const canGenerate = personImage && productImage && !isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 flex items-center justify-center gap-3">
          <SparklesIcon className="w-10 h-10"/>
          AI Ảnh Ghép NanoBanana
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          Tải lên ảnh một người và một sản phẩm để AI tạo ra một bức ảnh ghép tự nhiên và chân thực.
        </p>
      </header>

      <main className="w-full max-w-5xl flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ImageUploader title="1. Tải ảnh nhân vật" onImageUpload={setPersonImage} />
          <ImageUploader title="2. Tải ảnh sản phẩm" onImageUpload={setProductImage} />
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-3 mx-auto
              ${canGenerate 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transform hover:scale-105' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
          >
            <SparklesIcon className="w-6 h-6" />
            Tạo Ảnh Ghép
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 min-h-[400px] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">Kết quả</h2>
          <div className="w-full max-w-md aspect-square bg-gray-900/50 rounded-lg flex items-center justify-center overflow-hidden">
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-red-400 text-center px-4">{error}</p>}
            {generatedImage && !isLoading && (
              <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
            )}
            {!isLoading && !generatedImage && !error && (
              <div className="text-center text-gray-500">
                <PhotoIcon className="w-16 h-16 mx-auto mb-2" />
                <p>Ảnh được tạo sẽ xuất hiện ở đây.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full max-w-5xl text-center mt-8 text-gray-500 text-sm">
        <p>Phát triển với Gemini API & React</p>
      </footer>
    </div>
  );
};

export default App;
