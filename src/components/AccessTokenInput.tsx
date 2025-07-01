'use client';

import { useState, useEffect } from 'react';
import { validateAccessToken } from '@/lib/mercadopago';

interface AccessTokenInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidation: (isValid: boolean) => void;
}

export default function AccessTokenInput({ value, onChange, onValidation }: AccessTokenInputProps) {
  const [isValid, setIsValid] = useState(false);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const valid = validateAccessToken(value);
    setIsValid(valid);
    onValidation(valid);
  }, [value, onValidation]);

  useEffect(() => {
    // Load saved token from localStorage
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('mp-access-token');
      if (savedToken && !value) {
        onChange(savedToken);
      }
    }
  }, [onChange, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim();
    onChange(newValue);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      if (newValue) {
        localStorage.setItem('mp-access-token', newValue);
      } else {
        localStorage.removeItem('mp-access-token');
      }
    }
  };

  const clearToken = () => {
    onChange('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mp-access-token');
    }
  };

  const getDisplayValue = () => {
    if (!value || showToken) return value;
    if (value.length <= 10) return value;
    return `${value.substring(0, 8)}${'*'.repeat(Math.max(0, value.length - 16))}${value.substring(value.length - 8)}`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Access Token de MercadoPago
        <span className="text-red-500 ml-1">*</span>
      </label>
      
      <div className="relative">
        <input
          type={showToken ? 'text' : 'password'}
          value={getDisplayValue()}
          onChange={handleChange}
          placeholder="TEST-... o APP_USR-..."
          className={`w-full px-4 py-3 pr-20 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            value 
              ? isValid 
                ? 'border-green-300 focus:ring-green-500 bg-green-50' 
                : 'border-red-300 focus:ring-red-500 bg-red-50'
              : 'border-gray-300 focus:ring-primary focus:border-primary'
          }`}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {value && (
            <>
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
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
              
              <button
                type="button"
                onClick={clearToken}
                className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                title="Limpiar token"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {value && (
          <div className={`flex items-center gap-1 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Token válido {value.startsWith('TEST-') ? '(Test)' : '(Producción)'}</span>
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

      <div className="text-xs text-gray-500 space-y-2">
        <p>El token se guarda automáticamente en tu navegador para futuros usos.</p>
        <p>Formato: <code className="bg-gray-100 px-1 rounded">TEST-...</code> para testing o <code className="bg-gray-100 px-1 rounded">APP_USR-...</code> para producción.</p>
      </div>
    </div>
  );
}