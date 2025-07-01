'use client';

interface ProgressBarProps {
  isLoading: boolean;
  text?: string;
}

export default function ProgressBar({ isLoading, text = 'Procesando tokenización...' }: ProgressBarProps) {
  if (!isLoading) return null;

  return (
    <div className="w-full bg-gray-50 rounded-lg p-6">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
          <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {text}
        </h3>
        <p className="text-sm text-gray-600">
          Conectando con MercadoPago SDK y generando token...
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
      </div>

      <div className="flex items-center justify-center text-sm text-gray-500">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
} 