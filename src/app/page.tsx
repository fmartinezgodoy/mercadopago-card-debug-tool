'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { FormData, TokenizeResponse, TEST_CARDS } from '@/lib/types';
import { validateDocumentNumber } from '@/lib/utils';
import { validateAccessToken } from '@/lib/mercadopago';
import AccessTokenPopup from '@/components/AccessTokenPopup';
import CardSelector from '@/components/CardSelector';
import TokenResult from '@/components/TokenResult';
import ProgressBar from '@/components/ProgressBar';
import MercadoPagoTokenizer, { MercadoPagoTokenizerRef } from '@/components/MercadoPagoTokenizer';

// InfoButton component
function InfoButton() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        title="Información sobre la aplicación"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>

      {showInfo && (
        <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">MercadoPago Card Debug Tool</h3>
            <button
              onClick={() => setShowInfo(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>¿Qué hace?</strong><br />
              Herramienta para tokenizar tarjetas de prueba de MercadoPago desde el servidor, evitando problemas de CORS y CSP en el desarrollo.
            </p>
            <p>
              <strong>Cómo usar:</strong><br />
              1. Configura tu Access Token (se guarda automáticamente)<br />
              2. Selecciona una tarjeta de prueba<br />
              3. Configura el estado de prueba y datos del titular<br />
              4. Presiona "Tokenizar Tarjeta" para generar el token
            </p>
            <p>
              <strong>Tecnologías:</strong><br />
              Next.js 14+, TypeScript, Tailwind CSS, MercadoPago SDK
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    accessToken: '',
    selectedCard: '',
    selectedState: 'APRO',
    docType: 'DNI',
    docNumber: '12345678'
  });

  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TokenizeResponse | null>(null);
  const [history, setHistory] = useState<TokenizeResponse[]>([]);
  const [showTokenPopup, setShowTokenPopup] = useState(false);
  const [shouldGenerate, setShouldGenerate] = useState(false);

  const tokenizerRef = useRef<MercadoPagoTokenizerRef>(null);

  // Check for saved token on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('mp-access-token');
      if (savedToken && validateAccessToken(savedToken)) {
        setFormData(prev => ({ ...prev, accessToken: savedToken }));
        setIsTokenValid(true);
      } else {
        setShowTokenPopup(true);
      }
    }
  }, []);

  const handleTokenSet = useCallback((token: string) => {
    setFormData(prev => ({ ...prev, accessToken: token }));
    setIsTokenValid(validateAccessToken(token));
  }, []);

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Reset any previous results when changing configuration
    if (field !== 'accessToken') {
      setResult(null);
      setShouldGenerate(false);
    }
  }, []);

  const handleTokenGenerated = useCallback((response: TokenizeResponse) => {
    setResult(response);
    setHistory(prev => [response, ...prev.slice(0, 9)]);
    setShouldGenerate(false);
  }, []);

  const handleLoadingChange = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const isFormValid = () => {
    return (
      isTokenValid &&
      formData.selectedCard &&
      formData.selectedState &&
      formData.docType &&
      validateDocumentNumber(formData.docNumber, formData.docType)
    );
  };

  const handleStartTokenization = () => {
    if (isFormValid()) {
      setResult(null);
      setShouldGenerate(true);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setResult(null);
  };

  const changeAccessToken = () => {
    setShowTokenPopup(true);
  };

  const currentCard = TEST_CARDS.find(card => card.id === formData.selectedCard);

  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Info Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-900">MercadoPago Card Debug</h1>
          <InfoButton />
        </div>

        {/* Access Token Status */}
        {isTokenValid && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-800 font-medium text-sm">
                  Access Token configurado {formData.accessToken.startsWith('TEST-') ? '(Test)' : '(Producción)'}
                </span>
              </div>
              <button
                onClick={changeAccessToken}
                className="text-green-700 hover:text-green-900 text-xs underline"
              >
                Cambiar
              </button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Configuration (narrower) */}
          <div className="lg:col-span-1 space-y-4">
            {/* Configuration Section */}
            <div className="form-section">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Configuración de la Tarjeta
              </h2>
              <CardSelector
                selectedCard={formData.selectedCard}
                selectedState={formData.selectedState}
                docType={formData.docType}
                docNumber={formData.docNumber}
                onCardChange={(value) => updateFormData('selectedCard', value)}
                onStateChange={(value) => updateFormData('selectedState', value)}
                onDocTypeChange={(value) => updateFormData('docType', value)}
                onDocNumberChange={(value) => updateFormData('docNumber', value)}
              />
            </div>

            {/* Status Summary */}
            {isFormValid() && currentCard && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-blue-900">Configuración completa</h3>
                  <div className="text-sm text-blue-700 font-mono">
                    {currentCard.number && `${currentCard.number.substring(0, 4)}****${currentCard.number.slice(-4)}`}
                  </div>
                </div>
              </div>
            )}

            {/* Validation Message */}
            {!isFormValid() && isTokenValid && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-yellow-800 text-sm">Completa la configuración:</p>
                    <p className="mt-1 text-yellow-700 text-xs">
                      {!formData.selectedCard && '• Tarjeta de prueba '}
                      {!formData.selectedState && '• Estado de prueba '}
                      {!formData.docType && '• Tipo de documento '}
                      {!validateDocumentNumber(formData.docNumber, formData.docType) && '• Número de documento válido '}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Clear History Button */}
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="btn-secondary w-full text-sm py-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpiar Historial ({history.length})
              </button>
            )}
          </div>

          {/* Right Column - Results (wider) */}
          <div className="lg:col-span-2">
            {/* Tokenization Action */}
            {isFormValid() && !loading && !result && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Listo para Tokenizar
                    </h3>
                    {currentCard && currentCard.brand && currentCard.type && currentCard.number && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <span>{currentCard.brand.charAt(0).toUpperCase() + currentCard.brand.slice(1)} {currentCard.type === 'credit' ? 'Crédito' : 'Débito'}</span>
                        <span className="font-mono">
                          {currentCard.number.substring(0, 4)}****{currentCard.number.slice(-4)}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleStartTokenization}
                    className="btn-primary px-6 py-3 text-base font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Tokenizar Tarjeta
                  </button>
                  <p className="text-sm text-gray-500 mt-3">
                    Presiona para generar el token usando MercadoPago SDK
                  </p>
                </div>
              </div>
            )}

            {/* Empty state when no configuration */}
            {!isFormValid() && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  Completa el formulario y presiona "Generar Token" para ver los resultados aquí.
                </h3>
                <p className="text-gray-500 text-sm">
                  Los resultados de la tokenización aparecerán en este espacio.
                </p>
              </div>
            )}

            {/* Progress Bar */}
            <ProgressBar isLoading={loading} />
            
            {/* Results Section */}
            <TokenResult result={result} loading={loading} />
          </div>
        </div>
      </div>

      {/* Access Token Popup */}
      <AccessTokenPopup
        isOpen={showTokenPopup}
        onTokenSet={handleTokenSet}
        onClose={() => setShowTokenPopup(false)}
      />

      {/* Hidden MercadoPago Tokenizer */}
      {isTokenValid && currentCard && currentCard.number && currentCard.cvv && currentCard.expMonth && currentCard.expYear && (
        <MercadoPagoTokenizer
          ref={tokenizerRef}
          accessToken={formData.accessToken}
          selectedCard={{
            number: currentCard.number,
            cvv: currentCard.cvv,
            expMonth: currentCard.expMonth,
            expYear: currentCard.expYear,
            holderName: formData.selectedState
          }}
          docType={formData.docType}
          docNumber={formData.docNumber}
          shouldGenerate={shouldGenerate}
          onTokenGenerated={handleTokenGenerated}
          onLoading={handleLoadingChange}
        />
      )}
    </div>
  );
}