/**
 * WhatsApp Share Utilities
 * Matches old frontend: mobile = Web Share with files (for WhatsApp/share sheet), desktop = download file (ZIP or PDF).
 */

import { api } from './api';
import { createSupabaseBrowserClient } from './supabase/client';

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function canShareFiles(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    'share' in navigator &&
    'canShare' in navigator &&
    navigator.canShare !== undefined
  );
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
  const response = await fetch(url, { mode: 'cors' });
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType || 'image/jpeg' });
}

/**
 * Open WhatsApp with pre-filled message (works on mobile and desktop)
 */
export function openWhatsAppLink(whatsappUrl: string): void {
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Get WhatsApp link for invoice - opens wa.me with invoice details
 */
export async function sendInvoiceViaWhatsApp(invoiceId: string): Promise<void> {
  const { whatsappUrl } = await api.get<{ whatsappUrl: string | null; phoneNumber?: string }>(
    `/invoices/${invoiceId}/whatsapp-link`
  );

  if (!whatsappUrl) {
    throw new Error('Client has no phone number. Add a phone number to the client to send via WhatsApp.');
  }

  openWhatsAppLink(whatsappUrl);
}

/**
 * Download invoice PDF (desktop fallback, same as old frontend)
 */
export async function downloadInvoicePdf(invoiceId: string, invoiceNumber: string): Promise<void> {
  const baseUrl = api.getBaseUrl();
  const headers = await getAuthHeaders();
  const response = await fetch(`${baseUrl}/invoices/${invoiceId}/pdf`, { headers });
  if (!response.ok) throw new Error('Failed to fetch invoice PDF');

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${invoiceNumber}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Share invoice: mobile = Web Share with PDF (user can pick WhatsApp); desktop = download PDF.
 * Same behaviour as old frontend.
 */
export async function shareInvoiceWithPdf(
  invoiceId: string,
  invoiceNumber: string,
  clientName: string,
  businessName: string,
): Promise<void> {
  const isMobile = isMobileDevice();
  const canShare = canShareFiles();

  if (isMobile && canShare) {
    try {
      const baseUrl = api.getBaseUrl();
      const headers = await getAuthHeaders();
      const response = await fetch(`${baseUrl}/invoices/${invoiceId}/pdf`, { headers });
      if (!response.ok) throw new Error('Failed to fetch invoice PDF');

      const blob = await response.blob();
      const pdfFile = new File([blob], `invoice-${invoiceNumber}.pdf`, { type: 'application/pdf' });
      const message = `📄 Invoice ${invoiceNumber}\n\nHello ${clientName},\n\nPlease find your invoice attached.\n\nThank you for choosing ${businessName}!`;

      const shareData: ShareData = { files: [pdfFile], text: message, title: `Invoice ${invoiceNumber}` };
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // Fall through to download
    }
  }

  await downloadInvoicePdf(invoiceId, invoiceNumber);
}

/**
 * Get WhatsApp link for job photos
 */
export async function getJobPhotosWhatsAppLink(
  jobId: string,
  photoType: 'BEFORE' | 'AFTER' | 'ALL' = 'ALL'
): Promise<{ whatsappUrl: string | null; phoneNumber?: string; error?: string }> {
  const result = await api.get<{
    whatsappUrl: string | null;
    phoneNumber?: string;
    error?: string;
  }>(`/jobs/${jobId}/whatsapp/photos?photoType=${photoType}`);
  return result;
}

/**
 * Share job photos: mobile = Web Share with images (user can pick WhatsApp); desktop = download ZIP.
 * Same behaviour as old frontend.
 */
export async function shareJobPhotosViaWhatsApp(
  jobId: string,
  clientName: string,
  businessName: string,
  photoType?: 'BEFORE' | 'AFTER' | 'ALL',
): Promise<void> {
  const isMobile = isMobileDevice();
  const canShare = canShareFiles();
  const type = photoType ?? 'ALL';

  if (isMobile && canShare) {
    try {
      const job = await api.get<{ photos?: { imageUrl: string; photoType: string }[] }>(`/jobs/${jobId}`);
      const photos = job.photos ?? [];
      const filtered = type === 'ALL'
        ? photos
        : photos.filter((p) => p.photoType === type);

      if (filtered.length === 0) {
        throw new Error(`No ${type.toLowerCase()} photos found`);
      }

      const files = await Promise.all(
        filtered.map((photo, i) =>
          urlToFile(photo.imageUrl, `${photo.photoType.toLowerCase()}-${i + 1}.jpg`, 'image/jpeg')
        )
      );

      const message = `✨ Job Photos\n\nHello ${clientName},\n\nHere are the photos from your cleaning job.\n\nThank you for choosing ${businessName}!`;
      const shareData: ShareData = { files, text: message, title: 'Job Photos' };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // Fall through to download ZIP
    }
  }

  await downloadJobPhotosZip(jobId);
}

/**
 * Get WhatsApp link for job completion message
 */
export async function getJobCompletionWhatsAppLink(
  jobId: string
): Promise<{ whatsappUrl: string | null; phoneNumber?: string; error?: string }> {
  const result = await api.get<{
    whatsappUrl: string | null;
    phoneNumber?: string;
    error?: string;
  }>(`/jobs/${jobId}/whatsapp/completion`);
  return result;
}

/**
 * Download job photos as ZIP
 */
export async function downloadJobPhotosZip(jobId: string): Promise<void> {
  const baseUrl = api.getBaseUrl();
  const headers = await getAuthHeaders();
  const response = await fetch(`${baseUrl}/jobs/${jobId}/photos/download`, { headers });
  if (!response.ok) throw new Error('Failed to download photos');

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `job-${jobId}-photos.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
