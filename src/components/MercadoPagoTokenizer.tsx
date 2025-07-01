'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
  onTokenGenerated: (result: TokenizeResponse) => void;
  onLoading: (loading: boolean) => void;
}

export default function MercadoPagoTokenizer({
  accessToken,
  selectedCard,
  docType,
  docNumber,
  onTokenGenerated,
  onLoading
}: MercadoPagoTokenizerProps) {
  const [mpInstance, setMpInstance] = useState<any>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [hasTokenized, setHasTokenized] = useState(false);
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
      onLoading(false);
    }
  }, [mpInstance, selectedCard, docType, docNumber, onTokenGenerated, onLoading]);

  // Reset tokenization state when card selection changes
  useEffect(() => {
    setHasTokenized(false);
  }, [selectedCard.number, selectedCard.holderName, docType, docNumber]);

  // Auto-generate token when MP instance is ready (only once per card selection)
  useEffect(() => {
    if (!mpInstance || !selectedCard.number || hasTokenized) return;

    // Auto-generate token immediately
    const autoGenerateToken = async () => {
      setHasTokenized(true);
      await generateToken();
    };

    // Small delay to ensure MP is fully initialized
    const timer = setTimeout(autoGenerateToken, 500);
    return () => clearTimeout(timer);
  }, [mpInstance, selectedCard.number, hasTokenized, generateToken]);

  if (!mpInstance) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-blue-800 font-medium">Cargando SDK de MercadoPago...</span>
        </div>
      </div>
    );
  }

  if (hasTokenized) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-green-800 font-medium">
            Token generado para {selectedCard.number.substring(0, 4)}****{selectedCard.number.slice(-4)}
          </span>
        </div>
        <p className="text-sm text-green-700 mt-2">
          Cambia la configuración arriba para generar un nuevo token.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-blue-800 font-medium">
          Generando token para {selectedCard.number.substring(0, 4)}****{selectedCard.number.slice(-4)}...
        </span>
      </div>
      <p className="text-sm text-blue-700 mt-2">
        Enviando datos a MercadoPago automáticamente.
      </p>
    </div>
  );
}