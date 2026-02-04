'use client';

import { useState } from 'react';
import PDFUploader from '@/components/PDFUploader';
import RoastResults from '@/components/RoastResults';
import { RoastResult, ApiResponse } from '@/lib/types';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/roast', {
        method: 'POST',
        body: formData,
      });

      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get Your Proposal Roasted <span className="inline-block">🔥</span>
          </h1>
          <p className="text-xl text-panda-text/70 max-w-2xl mx-auto">
            Upload your sales proposal. Get brutally honest feedback. Close more deals.
          </p>
        </div>

        {/* Main Content */}
        {result ? (
          <RoastResults result={result} onReset={handleReset} />
        ) : (
          <>
            <PDFUploader onUpload={handleUpload} isProcessing={isProcessing} />

            {error && (
              <div className="mt-6 max-w-xl mx-auto">
                <div className="bg-panda-error/10 border border-panda-error/30 text-panda-error rounded-lg p-4 text-center">
                  {error}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-panda-text/50 text-sm">
          <p>Built for April Fools. Accidentally useful.</p>
          <p className="mt-1">
            Powered by{' '}
            <a
              href="https://pandadoc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-panda-green hover:underline"
            >
              PandaDoc
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
