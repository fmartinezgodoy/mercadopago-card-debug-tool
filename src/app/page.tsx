'use client';

import { useState, useCallback } from 'react';
import { FormData, TokenizeResponse, TEST_CARDS } from '@/lib/types';
import { validateDocumentNumber } from '@/lib/utils';
import AccessTokenInput from '@/components/AccessTokenInput';
import CardSelector from '@/components/CardSelector';
import TokenResult from '@/components/TokenResult';
import MercadoPagoTokenizer from '@/components/MercadoPagoTokenizer';

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

  const handleTokenValidation = useCallback((isValid: boolean) => {
    setIsTokenValid(isValid);
  }, []);

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTokenGenerated = useCallback((response: TokenizeResponse) => {
    setResult(response);
    setHistory(prev => [response, ...prev.slice(0, 9)]);
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

  const clearHistory = () => {
    setHistory([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
            MercadoPago Card Debug Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Herramienta para tokenizar tarjetas de prueba de MercadoPago desde el servidor,
            evitando problemas de CORS y CSP en el desarrollo.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span className="bg-white px-3 py-1 rounded-full border">Next.js 14+</span>
            <span className="bg-white px-3 py-1 rounded-full border">Server Actions</span>
            <span className="bg-white px-3 py-1 rounded-full border">TypeScript</span>
            <span className="bg-white px-3 py-1 rounded-full border">Tailwind CSS</span>
            <span className="bg-white px-3 py-1 rounded-full border">MercadoPago SDK</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Configuration Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Access Token */}
            <div className="form-section">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                1. Access Token
              </h2>
              <AccessTokenInput
                value={formData.accessToken}
                onChange={(value) => updateFormData('accessToken', value)}
                onValidation={handleTokenValidation}
              />
            </div>

            {/* Card and Document Selection */}
            <div className="form-section">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                2. Configuración de Prueba
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
          </div>

          {/* MercadoPago Tokenizer */}
          {isFormValid() && (
            <div className="form-section">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                3. Tokenización Automática
              </h2>
              <MercadoPagoTokenizer
                accessToken={formData.accessToken}
                selectedCard={{
                  ...TEST_CARDS.find(card => card.id === formData.selectedCard)!,
                  holderName: formData.selectedState
                }}
                docType={formData.docType}
                docNumber={formData.docNumber}
                onTokenGenerated={handleTokenGenerated}
                onLoading={handleLoadingChange}
              />
            </div>
          )}

          {/* Validation Message */}
          {!isFormValid() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800">Completa los campos requeridos:</p>
                  <p className="mt-1 text-yellow-700 text-sm">
                    {!isTokenValid && '• Access token válido '}
                    {!formData.selectedCard && '• Tarjeta de prueba '}
                    {!formData.selectedState && '• Estado de prueba '}
                    {!formData.docType && '• Tipo de documento '}
                    {!validateDocumentNumber(formData.docNumber, formData.docType) && '• Número de documento '}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          <TokenResult result={result} loading={loading} />

          {/* Clear History Button */}
          {history.length > 0 && (
            <div className="text-center">
              <button
                type="button"
                onClick={clearHistory}
                className="btn-secondary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpiar Historial ({history.length})
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            Herramienta de desarrollo para tokenización de tarjetas de prueba de MercadoPago.
            <br />
            Construida con Next.js 14+, TypeScript, Tailwind CSS y el SDK oficial de MercadoPago.
          </p>
        </footer>
      </div>
    </div>
  );
}