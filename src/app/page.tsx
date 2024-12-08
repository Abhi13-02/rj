'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setError(null);

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
      let response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      console.log(response);
      

      setUploadedUrl(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Image Upload to R2</h1>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {file && <div className="text-sm text-gray-600">Selected file: {file.name}</div>}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-2 px-4 rounded-md text-white ${
              !file || uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {uploadedUrl && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Uploaded Image:</h2>
              <img src={uploadedUrl} alt="Uploaded" className="max-w-full rounded-lg" />
              <div className="mt-2 text-sm text-gray-600">Public URL: {uploadedUrl}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
