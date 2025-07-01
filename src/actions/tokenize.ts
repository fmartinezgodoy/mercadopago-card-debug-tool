'use server';

import { createCardTokenClient, getPaymentMethodFromCardNumber, validateAccessToken } from '@/lib/mercadopago';
import { getCurrentTimestamp } from '@/lib/utils';
import { TokenizeRequest, TokenizeResponse } from '@/lib/types';

export async function tokenizeCard(request: TokenizeRequest): Promise<TokenizeResponse> {
  try {
    // Validate access token
    if (!validateAccessToken(request.accessToken)) {
      return {
        success: false,
        timestamp: getCurrentTimestamp(),
        error: 'Invalid access token format. Must start with TEST- or APP_USR-'
      };
    }

    // Validate required fields
    if (!request.cardNumber || !request.cvv || !request.expMonth || !request.expYear || !request.holderName) {
      return {
        success: false,
        timestamp: getCurrentTimestamp(),
        error: 'Missing required card information'
      };
    }

    // Try MercadoPago SDK first
    try {
      return await tryMercadoPagoSDK(request);
    } catch (sdkError) {
      console.log('SDK failed, trying direct HTTP request...', sdkError);
      return await tryDirectHTTPRequest(request);
    }

  } catch (error: any) {
    console.error('All tokenization methods failed:', error);
    
    // Generate a mock token for demonstration purposes
    return generateMockToken(request);
  }
}

async function tryMercadoPagoSDK(request: TokenizeRequest): Promise<TokenizeResponse> {
    // Initialize MercadoPago client
    const cardTokenClient = createCardTokenClient(request.accessToken);

    // Prepare card data for tokenization - SDK expects strings
    const cardData = {
      card_number: request.cardNumber.replace(/\s/g, ''),
      security_code: request.cvv,
      expiration_month: request.expMonth,
      expiration_year: `20${request.expYear}`,
      cardholder: {
        name: request.holderName,
        identification: {
          type: request.docType,
          number: request.docNumber
        }
      }
    };

    console.log('Tokenizing card with data:', {
      ...cardData,
      card_number: `****${cardData.card_number.slice(-4)}`,
      security_code: '***'
    });

    // Create token using the correct method
    console.log('Calling cardTokenClient.create with:', cardData);
    const response = await cardTokenClient.create({
      body: cardData
    });
    
    console.log('MercadoPago response:', response);

    if (!response || !response.id) {
      return {
        success: false,
        timestamp: getCurrentTimestamp(),
        error: 'Failed to create card token'
      };
    }

    // Determine card type from selected card
    const cardType = request.cardNumber.startsWith('5031') ? 'Mastercard Crédito' :
                    request.cardNumber.startsWith('4509') ? 'Visa Crédito' :
                    request.cardNumber.startsWith('3711') ? 'American Express' :
                    request.cardNumber.startsWith('5287') ? 'Mastercard Débito' :
                    request.cardNumber.startsWith('4002') ? 'Visa Débito' : 'Unknown';

    const result: TokenizeResponse = {
      success: true,
      timestamp: getCurrentTimestamp(),
      token: {
        id: response.id,
        first_six_digits: (response as any).first_six_digits || request.cardNumber.substring(0, 6),
        last_four_digits: (response as any).last_four_digits || request.cardNumber.slice(-4),
        payment_method_id: getPaymentMethodFromCardNumber(request.cardNumber),
        expiration_month: parseInt(request.expMonth),
        expiration_year: parseInt(`20${request.expYear}`),
        cardholder: {
          name: request.holderName,
          identification: {
            type: request.docType,
            number: request.docNumber
          }
        },
        security_code: {
          length: request.cvv.length,
          card_location: 'back'
        },
        date_created: (response as any).date_created || getCurrentTimestamp(),
        date_last_updated: (response as any).date_last_updated || getCurrentTimestamp(),
        date_due: (response as any).date_due || ''
      },
      cardInfo: {
        type: cardType,
        holderName: request.holderName,
        expirationDate: `${request.expMonth}/${request.expYear}`
      },
      paymentData: {
        token: response.id,
        payment_method_id: getPaymentMethodFromCardNumber(request.cardNumber),
        transaction_amount: 100.00,
        installments: 1,
        payer: {
          email: 'test@test.com',
          identification: {
            type: request.docType,
            number: request.docNumber
          }
        }
      }
    };

    return result;
}

async function tryDirectHTTPRequest(request: TokenizeRequest): Promise<TokenizeResponse> {
  const cardData = {
    card_number: request.cardNumber.replace(/\s/g, ''),
    security_code: request.cvv,
    expiration_month: parseInt(request.expMonth),
    expiration_year: parseInt(`20${request.expYear}`),
    cardholder: {
      name: request.holderName,
      identification: {
        type: request.docType,
        number: request.docNumber
      }
    }
  };

  const response = await fetch('https://api.mercadopago.com/v1/card_tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${request.accessToken}`
    },
    body: JSON.stringify(cardData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
  }

  const tokenData = await response.json();
  
  const cardType = request.cardNumber.startsWith('5031') ? 'Mastercard Crédito' :
                  request.cardNumber.startsWith('4509') ? 'Visa Crédito' :
                  request.cardNumber.startsWith('3711') ? 'American Express' :
                  request.cardNumber.startsWith('5287') ? 'Mastercard Débito' :
                  request.cardNumber.startsWith('4002') ? 'Visa Débito' : 'Unknown';

  return {
    success: true,
    timestamp: getCurrentTimestamp(),
    token: {
      id: tokenData.id,
      first_six_digits: tokenData.first_six_digits || request.cardNumber.substring(0, 6),
      last_four_digits: tokenData.last_four_digits || request.cardNumber.slice(-4),
      payment_method_id: getPaymentMethodFromCardNumber(request.cardNumber),
      expiration_month: parseInt(request.expMonth),
      expiration_year: parseInt(`20${request.expYear}`),
      cardholder: {
        name: request.holderName,
        identification: {
          type: request.docType,
          number: request.docNumber
        }
      },
      security_code: {
        length: request.cvv.length,
        card_location: 'back'
      },
      date_created: tokenData.date_created || getCurrentTimestamp(),
      date_last_updated: tokenData.date_last_updated || getCurrentTimestamp(),
      date_due: tokenData.date_due || ''
    },
    cardInfo: {
      type: cardType,
      holderName: request.holderName,
      expirationDate: `${request.expMonth}/${request.expYear}`
    },
    paymentData: {
      token: tokenData.id,
      payment_method_id: getPaymentMethodFromCardNumber(request.cardNumber),
      transaction_amount: 100.00,
      installments: 1,
      payer: {
        email: 'test@test.com',
        identification: {
          type: request.docType,
          number: request.docNumber
        }
      }
    }
  };
}

function generateMockToken(request: TokenizeRequest): TokenizeResponse {
  const mockTokenId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const cardType = request.cardNumber.startsWith('5031') ? 'Mastercard Crédito' :
                  request.cardNumber.startsWith('4509') ? 'Visa Crédito' :
                  request.cardNumber.startsWith('3711') ? 'American Express' :
                  request.cardNumber.startsWith('5287') ? 'Mastercard Débito' :
                  request.cardNumber.startsWith('4002') ? 'Visa Débito' : 'Unknown';

  console.log('🚨 GENERATED MOCK TOKEN - API calls failed, using simulated data for demonstration');

  return {
    success: true,
    timestamp: getCurrentTimestamp(),
    token: {
      id: mockTokenId,
      first_six_digits: request.cardNumber.substring(0, 6),
      last_four_digits: request.cardNumber.slice(-4),
      payment_method_id: getPaymentMethodFromCardNumber(request.cardNumber),
      expiration_month: parseInt(request.expMonth),
      expiration_year: parseInt(`20${request.expYear}`),
      cardholder: {
        name: request.holderName,
        identification: {
          type: request.docType,
          number: request.docNumber
        }
      },
      security_code: {
        length: request.cvv.length,
        card_location: 'back'
      },
      date_created: getCurrentTimestamp(),
      date_last_updated: getCurrentTimestamp(),
      date_due: ''
    },
    cardInfo: {
      type: cardType,
      holderName: request.holderName,
      expirationDate: `${request.expMonth}/${request.expYear}`
    },
    paymentData: {
      token: mockTokenId,
      payment_method_id: getPaymentMethodFromCardNumber(request.cardNumber),
      transaction_amount: 100.00,
      installments: 1,
      payer: {
        email: 'test@test.com',
        identification: {
          type: request.docType,
          number: request.docNumber
        }
      }
    },
    error: '⚠️ MOCK TOKEN: Las llamadas a la API de MercadoPago fallaron. Este es un token simulado para demostración. Puede haber problemas con el access token o la configuración de la cuenta.'
  };
}