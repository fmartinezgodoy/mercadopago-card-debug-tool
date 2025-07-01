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
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isDocTypeDropdownOpen, setIsDocTypeDropdownOpen] = useState(false);
  
  const cardDropdownRef = useRef<HTMLDivElement>(null);
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const docTypeDropdownRef = useRef<HTMLDivElement>(null);

  const currentCard = TEST_CARDS.find(card => card.id === selectedCard);
  const currentState = TEST_STATES.find(state => state.code === selectedState);
  const currentDocType = DOC_TYPES.find(type => type.value === docType);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardDropdownRef.current && !cardDropdownRef.current.contains(event.target as Node)) {
        setIsCardDropdownOpen(false);
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setIsStateDropdownOpen(false);
      }
      if (docTypeDropdownRef.current && !docTypeDropdownRef.current.contains(event.target as Node)) {
        setIsDocTypeDropdownOpen(false);
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

  const getStateIcon = (code: string) => {
    switch (code) {
      case 'APRO':
        return (
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            ✓
          </div>
        );
      case 'OTHE':
      case 'CALL':
      case 'FUND':
      case 'SECU':
      case 'EXPI':
      case 'FORM':
        return (
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            ✕
          </div>
        );
      case 'CONT':
        return (
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            ⏱
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

  const getDocTypeIcon = (type: string) => {
    return (
      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
        ID
      </div>
    );
  };

  const handleCardSelect = (card: TestCard) => {
    onCardChange(card.id);
    setIsCardDropdownOpen(false);
  };

  const handleStateSelect = (state: TestState) => {
    onStateChange(state.code);
    setIsStateDropdownOpen(false);
  };

  const handleDocTypeSelect = (docType: string) => {
    onDocTypeChange(docType);
    setIsDocTypeDropdownOpen(false);
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
        
        <div className="relative" ref={cardDropdownRef}>
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
        
        {/* Card Details when selected */}
        {currentCard && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Fecha de vencimiento:</span>
                <div className="text-blue-600 font-mono">{currentCard.expMonth}/{currentCard.expYear}</div>
              </div>
              <div>
                <span className="font-medium text-blue-800">Código de seguridad:</span>
                <div className="text-blue-600 font-mono">{currentCard.cvv}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom State Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Estado de Prueba (Nombre del Titular)
          <span className="text-red-500 ml-1">*</span>
        </label>
        
        <div className="relative" ref={stateDropdownRef}>
          <button
            type="button"
            onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
          >
            {currentState ? (
              <div className="flex items-center gap-3">
                {getStateIcon(currentState.code)}
                <div>
                  <div className="font-medium text-gray-900">
                    {currentState.code} - {currentState.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentState.description}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-gray-500">Selecciona un estado de prueba</span>
            )}
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isStateDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isStateDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {TEST_STATES.map((state) => (
                <button
                  key={state.code}
                  type="button"
                  onClick={() => handleStateSelect(state)}
                  className="w-full px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-3 text-left border-b border-gray-100 last:border-b-0"
                >
                  {getStateIcon(state.code)}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {state.code} - {state.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {state.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Information */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Custom Doc Type Dropdown */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Documento
            <span className="text-red-500 ml-1">*</span>
          </label>
          
          <div className="relative" ref={docTypeDropdownRef}>
            <button
              type="button"
              onClick={() => setIsDocTypeDropdownOpen(!isDocTypeDropdownOpen)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
            >
              {currentDocType ? (
                <div className="flex items-center gap-3">
                  {getDocTypeIcon(currentDocType.value)}
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {currentDocType.value}
                    </div>
                  </div>
                </div>
              ) : (
                <span className="text-gray-500 text-sm">Seleccionar...</span>
              )}
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${isDocTypeDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDocTypeDropdownOpen && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {DOC_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleDocTypeSelect(type.value)}
                    className="w-full px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-3 text-left border-b border-gray-100 last:border-b-0"
                  >
                    {getDocTypeIcon(type.value)}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {type.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Document Number Input */}
        <div className="space-y-2 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Número de Documento
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={docNumber}
            onChange={(e) => onDocNumberChange(e.target.value.replace(/\D/g, ''))}
            placeholder="12345678"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}