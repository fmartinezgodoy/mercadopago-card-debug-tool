'use client';

import { useEffect, useState, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { TokenizeResponse } from '@/lib/types';
import { getCurrentTimestamp, formatJSON } from '@/lib/utils';

// Declare MercadoPago types for window object
declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface MercadoPagoTokenizerProps {
  accessToken: string;
  selectedCard: {
    number: string;
    cvv: string;
    expMonth: string;
    expYear: string;
    holderName: string;
  };
  docType: string;
  docNumber: string;
  shouldGenerate: boolean;
  onTokenGenerated: (result: TokenizeResponse) => void;
  onLoading: (loading: boolean) => void;
}

export interface MercadoPagoTokenizerRef {
  generateToken: () => Promise<void>;
}

const MercadoPagoTokenizer = forwardRef<MercadoPagoTokenizerRef, MercadoPagoTokenizerProps>(({
  accessToken,
  selectedCard,
  docType,
  docNumber,
  shouldGenerate,
  onTokenGenerated,
  onLoading
}, ref) => {
  const [mpInstance, setMpInstance] = useState<any>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cardNumberRef = useRef<any>(null);
  const expirationDateRef = useRef<any>(null);
  const securityCodeRef = useRef<any>(null);
  const mountedRef = useRef(false);

  // Load MercadoPago SDK
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadMPScript = () => {
      if (window.MercadoPago) {
        initializeMercadoPago();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.onload = () => {
        setIsSDKLoaded(true);
        initializeMercadoPago();
      };
      script.onerror = () => {
        console.error('Failed to load MercadoPago SDK');
      };
      document.head.appendChild(script);
    };

    const initializeMercadoPago = () => {
      if (!accessToken || !accessToken.startsWith('TEST-')) {
        console.error('Invalid access token for MercadoPago');
        return;
      }

      try {
        const mp = new window.MercadoPago(accessToken, {
          locale: 'es-AR'
        });
        setMpInstance(mp);
      } catch (error) {
        console.error('Error initializing MercadoPago:', error);
      }
    };

    loadMPScript();
  }, [accessToken]);

  const generateToken = useCallback(async () => {
    if (!mpInstance) {
      onTokenGenerated({
        success: false,
        timestamp: getCurrentTimestamp(),
        error: 'MercadoPago SDK not loaded'
      });
      return;
    }

    setIsProcessing(true);
    onLoading(true);

    try {
      console.log('Creating card token with MercadoPago SDK...');

      // Use createCardToken with card data directly (no secure fields needed for debugging tool)
      const token = await mpInstance.createCardToken({
        cardNumber: selectedCard.number.replace(/\s/g, ''),
        securityCode: selectedCard.cvv,
        expirationMonth: selectedCard.expMonth,
        expirationYear: `20${selectedCard.expYear}`,
        cardholderName: selectedCard.holderName,
        identificationType: docType,
        identificationNumber: docNumber,
      });

      console.log('Token created successfully:', token);

      // Determine card type
      const cardType = selectedCard.number.startsWith('5031') ? 'Mastercard Crédito' :
                      selectedCard.number.startsWith('4509') ? 'Visa Crédito' :
                      selectedCard.number.startsWith('3711') ? 'American Express' :
                      selectedCard.number.startsWith('5287') ? 'Mastercard Débito' :
                      selectedCard.number.startsWith('4002') ? 'Visa Débito' : 'Unknown';

      const result: TokenizeResponse = {
        success: true,
        timestamp: getCurrentTimestamp(),
        token: {
          id: token.id,
          first_six_digits: token.first_six_digits || selectedCard.number.substring(0, 6),
          last_four_digits: token.last_four_digits || selectedCard.number.slice(-4),
          payment_method_id: token.payment_method_id || 'master',
          expiration_month: parseInt(selectedCard.expMonth),
          expiration_year: parseInt(`20${selectedCard.expYear}`),
          cardholder: {
            name: selectedCard.holderName,
            identification: {
              type: docType,
              number: docNumber
            }
          },
          security_code: {
            length: parseInt(token.security_code?.length || selectedCard.cvv.length),
            card_location: token.security_code?.card_location || 'back'
          },
          date_created: token.date_created || getCurrentTimestamp(),
          date_last_updated: token.date_last_updated || getCurrentTimestamp(),
          date_due: token.date_due || ''
        },
        cardInfo: {
          type: cardType,
          holderName: selectedCard.holderName,
          expirationDate: `${selectedCard.expMonth}/${selectedCard.expYear}`
        },
        paymentData: {
          token: token.id,
          payment_method_id: token.payment_method_id || 'master',
          transaction_amount: 100.00,
          installments: 1,
          payer: {
            email: 'test@test.com',
            identification: {
              type: docType,
              number: docNumber
            }
          }
        }
      };

      onTokenGenerated(result);

    } catch (error: any) {
      console.error('Error creating token:', error);

      let errorMessage = 'Unknown error occurred';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.cause && error.cause.length > 0) {
        errorMessage = error.cause.map((c: any) => `${c.code}: ${c.description}`).join(', ');
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      onTokenGenerated({
        success: false,
        timestamp: getCurrentTimestamp(),
        error: `Tokenization failed: ${errorMessage}`
      });
    } finally {
      setIsProcessing(false);
      onLoading(false);
    }
  }, [mpInstance, selectedCard, docType, docNumber, onTokenGenerated, onLoading]);

  // Expose generateToken function through ref
  useImperativeHandle(ref, () => ({
    generateToken
  }), [generateToken]);

  // Generate token when shouldGenerate becomes true
  useEffect(() => {
    if (shouldGenerate && mpInstance && !isProcessing) {
      generateToken();
    }
  }, [shouldGenerate, mpInstance, isProcessing, generateToken]);

  // Return the SDK loading state
  if (!mpInstance) {
    return null; // Don't render anything when SDK is not loaded, parent will handle the display
  }

  return null; // This component doesn't render anything visible
});

MercadoPagoTokenizer.displayName = 'MercadoPagoTokenizer';

export default MercadoPagoTokenizer;