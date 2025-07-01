export function formatCardNumberDisplay(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ');
}

export function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }

  // Fallback for older browsers
  return new Promise((resolve, reject) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        resolve();
      } else {
        reject(new Error('Failed to copy'));
      }
    } catch (err) {
      document.body.removeChild(textArea);
      reject(err);
    }
  });
}

export function formatJSON(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateDocumentNumber(docNumber: string, docType: string): boolean {
  if (!docNumber || docNumber.trim().length === 0) return false;
  
  // Basic validation - just check if it's not empty and contains only numbers
  if (docType === 'DNI' || docType === 'CI') {
    return /^\d{7,8}$/.test(docNumber.trim());
  }
  
  return docNumber.trim().length >= 6;
}