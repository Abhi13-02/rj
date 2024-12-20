'use client';

import { useState } from 'react';

export default function MultiImageUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file first');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const urls: string[] = [];

      for (const file of files) {
        // Get presigned URL
        const presignedUrlResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
          }),
        });

        const { presignedUrl, publicUrl } = await presignedUrlResponse.json();

        // Upload file using presigned URL
        await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        urls.push(publicUrl);
      }

      setUploadedUrls(urls);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Multiple Image Upload to R2</h1>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {files.length > 0 && (
            <div className="text-sm text-gray-600">
              Selected files:
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className={`w-full py-2 px-4 rounded-md text-white ${
              files.length === 0 || uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {uploadedUrls.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Uploaded Images:</h2>
              <div className="grid grid-cols-2 gap-4">
                {uploadedUrls.map((url, index) => (
                  <div key={index}>
                    <img src={url} alt={`Uploaded ${index}`} className="max-w-full rounded-lg" />
                    <div className="mt-2 text-sm text-gray-600">Public URL: {url}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
