/**
 * Utility for client-side image validation, scaling, and compression
 * Keeps LocalStorage footprint minimal (typically 15KB - 40KB per avatar)
 */

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
export const MAX_INPUT_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12 MB max upload before compression

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates file type and size before processing
 */
export function validateImageFile(file: File): ImageValidationResult {
  if (!file) {
    return { valid: false, error: 'No file was selected.' };
  }

  const fileType = file.type.toLowerCase();
  const isValidType = ALLOWED_IMAGE_TYPES.includes(fileType) || 
    file.name.match(/\.(jpe?g|png|webp)$/i);

  if (!isValidType) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a JPG, JPEG, PNG, or WEBP image.'
    };
  }

  if (file.size > MAX_INPUT_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select an image under 12 MB.`
    };
  }

  return { valid: true };
}

/**
 * Resizes and compresses an image file to a lightweight data URL string.
 * Default max dimensions 300x300 at 0.85 quality ensures crystal clear mobile/desktop
 * avatar rendering with an ultra-low storage consumption (~20-40 KB).
 */
export function compressAndResizeImage(
  file: File, 
  maxWidth: number = 320, 
  maxHeight: number = 320, 
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return reject(new Error(validation.error || 'Invalid image file.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read selected image file.'));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image data.'));
      img.onload = () => {
        try {
          // Calculate proportional scaled dimensions
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Could not initialize canvas context for compression.'));
          }

          // Enable high-quality smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw scaled image
          ctx.drawImage(img, 0, 0, width, height);

          // Attempt WebP compression first, fallback to JPEG
          let dataUrl = '';
          try {
            dataUrl = canvas.toDataURL('image/webp', quality);
            if (!dataUrl.startsWith('data:image/webp')) {
              dataUrl = canvas.toDataURL('image/jpeg', quality);
            }
          } catch {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(dataUrl);
        } catch (err) {
          reject(new Error('Failed to compress profile image.'));
        }
      };

      if (readerEvent.target?.result) {
        img.src = readerEvent.target.result as string;
      } else {
        reject(new Error('Empty image result.'));
      }
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Returns initials from a user's name for fallback avatar display (e.g. "Demo User" -> "DU")
 */
export function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
