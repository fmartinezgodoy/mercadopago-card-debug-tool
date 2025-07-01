'use client';

import { useState } from 'react';
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
  const [showCardDetails, setShowCardDetails] = useState(false);

  const currentCard = TEST_CARDS.find(card => card.id === selectedCard);
  const currentState = TEST_STATES.find(state => state.code === selectedState);

  const getCardBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return (
          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
            VISA
          </div>
        );
      case 'mastercard':
        return (
          <div className="w-8 h-5 bg-red-500 rounded text-white text-xs font-bold flex items-center justify-center">
            MC
          </div>
        );
      case 'amex':
        return (
          <div className="w-8 h-5 bg-green-600 rounded text-white text-xs font-bold flex items-center justify-center">
            AMEX
          </div>
        );
      default:
        return null;
    }
  };

  const getCardTypeColor = (type: 'credit' | 'debit') => {
    return type === 'credit' ? 'text-blue-600 bg-blue-50' : 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6">
      {/* Card Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Tarjeta de Prueba
          <span className="text-red-500 ml-1">*</span>
        </label>
        
        <select
          value={selectedCard}
          onChange={(e) => onCardChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Seleccionar tarjeta...</option>
          {TEST_CARDS.map((card) => (
            <option key={card.id} value={card.id}>
              {card.brand.toUpperCase()} {card.type === 'credit' ? 'Crédito' : 'Débito'} - {card.number}
            </option>
          ))}
        </select>

        {currentCard && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Número:</span>
                <div className="font-mono">{formatCardNumberDisplay(currentCard.number)}</div>
              </div>
              <div>
                <span className="text-gray-600">CVV:</span>
                <div className="font-mono">{currentCard.cvv}</div>
              </div>
              <div>
                <span className="text-gray-600">Vencimiento:</span>
                <div className="font-mono">{currentCard.expMonth}/{currentCard.expYear}</div>
              </div>
              <div>
                <span className="text-gray-600">Titular:</span>
                <div>{currentCard.holderName}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test State Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Estado de Prueba (Nombre del Titular)
          <span className="text-red-500 ml-1">*</span>
        </label>
        
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Seleccionar estado...</option>
          {TEST_STATES.map((state) => (
            <option key={state.code} value={state.code}>
              {state.code} - {state.name}
            </option>
          ))}
        </select>

        {currentState && (
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>{currentState.name}:</strong> {currentState.description}
          </div>
        )}
      </div>

      {/* Document Information */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
        <p><strong>Nota:</strong> Estas son tarjetas de prueba de MercadoPago. El nombre del titular determina el resultado de la tokenización:</p>
        <ul className="mt-1 ml-4 list-disc">
          <li><code>APRO</code> = Aprobado</li>
          <li><code>OTHE</code> = Rechazado por error general</li>
          <li><code>CONT</code> = Pendiente de pago</li>
          <li>Y otros códigos para diferentes escenarios de prueba</li>
        </ul>
      </div>
    </div>
  );
}