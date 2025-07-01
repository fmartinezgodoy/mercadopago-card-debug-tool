'use client';

import { useState, useEffect, useRef } from 'react';
import { TEST_CARDS, TEST_STATES, DOC_TYPES, TestCard, TestState } from '@/lib/types';
import { formatCardNumberDisplay } from '@/lib/utils';

interface CardSelectorProps {
  selectedCard: string;
  selectedState: string;
  docType: string;
  docNumber: string;
  onCardChange: (cardId: string) => void;
  onStateChange: (stateCode: string) => void;
  onDocTypeChange: (docType: string) => void;
  onDocNumberChange: (docNumber: string) => void;
}

export default function CardSelector({
  selectedCard,
  selectedState,
  docType,
  docNumber,
  onCardChange,
  onStateChange,
  onDocTypeChange,
  onDocNumberChange
}: CardSelectorProps) {
  const [isCardDropdownOpen, setIsCardDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCard = TEST_CARDS.find(card => card.id === selectedCard);
  const currentState = TEST_STATES.find(state => state.code === selectedState);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCardDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCardBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return (
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            V
          </div>
        );
      case 'mastercard':
        return (
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            MC
          </div>
        );
      case 'amex':
        return (
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            AE
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            ?
          </div>
        );
    }
  };

  const handleCardSelect = (card: TestCard) => {
    onCardChange(card.id);
    setIsCardDropdownOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Datos de Prueba</h3>
        </div>
        <p className="text-sm text-gray-600">
          Selecciona una tarjeta de prueba y configura los datos del titular
        </p>
      </div>

      {/* Custom Card Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Tarjeta de Prueba
          <span className="text-red-500 ml-1">*</span>
        </label>
        
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsCardDropdownOpen(!isCardDropdownOpen)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
          >
            {currentCard ? (
              <div className="flex items-center gap-3">
                {getCardBrandIcon(currentCard.brand)}
                <div>
                  <div className="font-medium text-gray-900">
                    {currentCard.brand.charAt(0).toUpperCase() + currentCard.brand.slice(1)} {currentCard.type === 'credit' ? 'Crédito' : 'Débito'}
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {formatCardNumberDisplay(currentCard.number)}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-gray-500">Selecciona una tarjeta de prueba</span>
            )}
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isCardDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isCardDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {TEST_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleCardSelect(card)}
                  className="w-full px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-3 text-left border-b border-gray-100 last:border-b-0"
                >
                  {getCardBrandIcon(card.brand)}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} {card.type === 'credit' ? 'Crédito' : 'Débito'}
                    </div>
                    <div className="text-sm text-gray-500 font-mono">
                      {formatCardNumberDisplay(card.number)}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    card.type === 'credit' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-600 text-white'
                  }`}>
                    {card.type === 'credit' ? 'Crédito' : 'Débito'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Test State Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Estado de Prueba (Nombre del Titular)
          <span className="text-red-500 ml-1">*</span>
        </label>
        
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Seleccionar estado...</option>
          {TEST_STATES.map((state) => (
            <option key={state.code} value={state.code}>
              {state.code} - {state.name}
            </option>
          ))}
        </select>

        {currentState && (
          <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
            <strong>{currentState.name}:</strong> {currentState.description}
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <span className="font-medium">Códigos disponibles:</span> APRO (aprobado), OTHE (rechazado), CONT (pendiente)
        </div>
      </div>

      {/* Document Information */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Documento
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={docType}
            onChange={(e) => onDocTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Seleccionar...</option>
            {DOC_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Número de Documento
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={docNumber}
            onChange={(e) => onDocNumberChange(e.target.value.replace(/\D/g, ''))}
            placeholder="12345678"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}