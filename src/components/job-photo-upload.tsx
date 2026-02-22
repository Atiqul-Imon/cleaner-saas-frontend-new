'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2, Camera } from 'lucide-react';

interface JobPhotoUploadProps {
  jobId: string;
  photoType: 'BEFORE' | 'AFTER';
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export function JobPhotoUpload({ jobId, photoType, onSuccess, onError }: JobPhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { uploadToImageKit } = await import('@/lib/imagekit');
      const result = await uploadToImageKit(file, 'job-photos');
      await api.post(`/jobs/${jobId}/photos`, {
        imageUrl: result.url,
        photoType,
      });
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Camera className="size-4" />
        )}
        <span className="ml-2">{photoType} photo</span>
      </Button>
    </div>
  );
}
