import { MercadoPagoConfig, CardToken } from 'mercadopago';

let mercadoPagoClient: MercadoPagoConfig | null = null;

export function initializeMercadoPago(accessToken: string): MercadoPagoConfig {
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  if (!accessToken.startsWith('TEST-') && !accessToken.startsWith('APP_USR-')) {
    throw new Error('Invalid access token format. Must start with TEST- or APP_USR-');
  }

  mercadoPagoClient = new MercadoPagoConfig({
    accessToken,
    options: {
      timeout: 30000
    }
  });

  return mercadoPagoClient;
}

export function getMercadoPagoClient(): MercadoPagoConfig {
  if (!mercadoPagoClient) {
    throw new Error('MercadoPago client not initialized. Call initializeMercadoPago first.');
  }
  return mercadoPagoClient;
}

export function createCardTokenClient(accessToken: string): CardToken {
  // Create a fresh client for each request to avoid caching issues
  const client = new MercadoPagoConfig({
    accessToken,
    options: {
      timeout: 30000
    }
  });
  return new CardToken(client);
}

export function formatCardNumber(cardNumber: string): string {
  return cardNumber.replace(/\s/g, '');
}

export function getPaymentMethodFromCardNumber(cardNumber: string): string {
  const number = formatCardNumber(cardNumber);
  const firstDigit = number.charAt(0);
  const firstTwoDigits = number.substring(0, 2);
  const firstFourDigits = number.substring(0, 4);

  // Visa
  if (firstDigit === '4') {
    return 'visa';
  }

  // Mastercard
  if (parseInt(firstTwoDigits) >= 51 && parseInt(firstTwoDigits) <= 55) {
    return 'master';
  }
  if (parseInt(firstFourDigits) >= 2221 && parseInt(firstFourDigits) <= 2720) {
    return 'master';
  }

  // American Express
  if (firstTwoDigits === '34' || firstTwoDigits === '37') {
    return 'amex';
  }

  // Default fallback
  return 'visa';
}

export function validateAccessToken(accessToken: string): boolean {
  if (!accessToken) return false;
  return accessToken.startsWith('TEST-') || accessToken.startsWith('APP_USR-');
}

export function isTestEnvironment(accessToken: string): boolean {
  return accessToken.startsWith('TEST-');
}