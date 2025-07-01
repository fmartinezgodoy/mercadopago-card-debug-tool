'use client';

import { useState } from 'react';
import { TokenizeResponse } from '@/lib/types';
import { copyToClipboard, formatJSON } from '@/lib/utils';

interface TokenResultProps {
  result: TokenizeResponse | null;
  loading: boolean;
}

export default function TokenResult({ result, loading }: TokenResultProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));

  const handleCopy = async (text: string, section: string) => {
    try {
      await copyToClipboard(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const CopyButton = ({ text, section, label }: { text: string; section: string; label: string }) => (
    <button
      onClick={() => handleCopy(text, section)}
      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-all ${
        copiedSection === section
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
      }`}
    >
      {copiedSection === section ? (
        <>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Copiado
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {label}
        </>
      )}
    </button>
  );

  const ExpandableSection = ({ 
    title, 
    section, 
    children, 
    copyData, 
    copyLabel,
    defaultExpanded = false 
  }: { 
    title: string; 
    section: string; 
    children: React.ReactNode; 
    copyData?: string; 
    copyLabel?: string;
    defaultExpanded?: boolean;
  }) => {
    const isExpanded = expandedSections.has(section);
    
    return (
      <div className="border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer" onClick={() => toggleSection(section)}>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <div className="flex items-center gap-2">
            {copyData && copyLabel && isExpanded && (
              <CopyButton text={copyData} section={section} label={copyLabel} />
            )}
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {isExpanded && (
          <div className="p-4 border-t border-gray-200">
            {children}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">Tokenizando tarjeta...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Completa el formulario y presiona &quot;Generar Token&quot; para ver los resultados aquí.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Resultado de Tokenización</h2>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          result.success 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {result.success ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Éxito
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Error
            </>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <span>Timestamp: {new Date(result.timestamp).toLocaleString()}</span>
      </div>

      {result.success ? (
        <div className="space-y-4">
          {/* Summary */}
          <ExpandableSection
            title="Resumen"
            section="summary"
            defaultExpanded={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Token ID</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded font-mono text-sm break-all">
                    {result.token?.id}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Method</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
                    {result.token?.payment_method_id}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Tarjeta</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
                    {result.cardInfo?.type}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Dígitos</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded font-mono text-sm">
                    {result.token?.first_six_digits}****{result.token?.last_four_digits}
                  </div>
                </div>
              </div>
            </div>
          </ExpandableSection>

          {/* Card Token */}
          <ExpandableSection
            title="Card Token (Completo)"
            section="token"
            copyData={formatJSON(result.token)}
            copyLabel="Copiar Token"
          >
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              {formatJSON(result.token)}
            </pre>
          </ExpandableSection>

          {/* Payment Data Example */}
          <ExpandableSection
            title="Ejemplo de Datos de Pago"
            section="payment"
            copyData={formatJSON(result.paymentData)}
            copyLabel="Copiar Payload"
          >
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Ejemplo de cómo usar este token en una transacción de pago:
              </p>
              <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-x-auto text-sm">
                {formatJSON(result.paymentData)}
              </pre>
            </div>
          </ExpandableSection>

          {/* Full Response */}
          <ExpandableSection
            title="Respuesta Completa"
            section="full"
            copyData={formatJSON(result)}
            copyLabel="Copiar Todo"
          >
            <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
              {formatJSON(result)}
            </pre>
          </ExpandableSection>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="font-medium text-red-800">Error en la tokenización</h3>
              <p className="mt-1 text-red-700">{result.error}</p>
              <div className="mt-3">
                <CopyButton text={result.error || ''} section="error" label="Copiar Error" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}