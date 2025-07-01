'use client';

import { useState, useEffect } from 'react';
import { validateAccessToken } from '@/lib/mercadopago';

interface AccessTokenPopupProps {
  isOpen: boolean;
  onTokenSet: (token: string) => void;
  onClose: () => void;
}

export default function AccessTokenPopup({ isOpen, onTokenSet, onClose }: AccessTokenPopupProps) {
  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const valid = validateAccessToken(token);
    setIsValid(valid);
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('mp-access-token', token);
      }
      onTokenSet(token);
      onClose();
    }
  };

  const getDisplayValue = () => {
    if (!token || showToken) return token;
    if (token.length <= 10) return token;
    return `${token.substring(0, 8)}${'*'.repeat(Math.max(0, token.length - 16))}${token.substring(token.length - 8)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Configuración Inicial
          </h2>
          <p className="text-gray-600 text-sm">
            Para comenzar a tokenizar tarjetas, necesitas proporcionar tu Access Token de MercadoPago.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Token de MercadoPago
              <span className="text-red-500 ml-1">*</span>
            </label>
            
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={getDisplayValue()}
                onChange={(e) => setToken(e.target.value.trim())}
                placeholder="TEST-... o APP_USR-..."
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  token 
                    ? isValid 
                      ? 'border-green-300 focus:ring-green-500 bg-green-50' 
                      : 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                autoFocus
              />
              
              {token && (
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                  title={showToken ? 'Ocultar token' : 'Mostrar token'}
                >
                  {showToken ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {token && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                {isValid ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Token válido {token.startsWith('TEST-') ? '(Test)' : '(Producción)'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Token inválido</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="mb-1">El token se guardará automáticamente en tu navegador para futuros usos.</p>
            <p>Formato: <code className="bg-gray-200 px-1 rounded">TEST-...</code> para testing o <code className="bg-gray-200 px-1 rounded">APP_USR-...</code> para producción.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!isValid}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                isValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Guardar y Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 