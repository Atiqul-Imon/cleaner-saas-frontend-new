export interface ImageKitUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
}

export async function uploadToImageKit(
  file: File,
  folder: string = 'job-photos',
): Promise<ImageKitUploadResponse> {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !urlEndpoint) {
    throw new Error('ImageKit credentials not configured');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', `${folder}/${Date.now()}-${file.name}`);
  formData.append('folder', folder);
  formData.append('publicKey', publicKey);

  const response = await fetch(`${urlEndpoint}/api/v1/files/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ImageKit upload failed: ${errorText}`);
  }

  const data = await response.json();
  if (!data.url) throw new Error('ImageKit returned no URL');

  return {
    fileId: data.fileId,
    name: data.name,
    url: data.url,
    thumbnailUrl: data.thumbnailUrl || data.url,
    height: data.height,
    width: data.width,
  };
}
