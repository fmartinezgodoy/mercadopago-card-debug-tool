export interface TestCard {
  id: string;
  name: string;
  type: 'credit' | 'debit';
  brand: string;
  number: string;
  cvv: string;
  expMonth: string;
  expYear: string;
  holderName: string;
}

export interface TestState {
  code: string;
  name: string;
  description: string;
}

export interface TokenizeRequest {
  accessToken: string;
  cardNumber: string;
  cvv: string;
  expMonth: string;
  expYear: string;
  holderName: string;
  docType: string;
  docNumber: string;
}

export interface TokenizeResponse {
  success: boolean;
  timestamp: string;
  token?: {
    id: string;
    first_six_digits: string;
    last_four_digits: string;
    payment_method_id: string;
    expiration_month: number;
    expiration_year: number;
    cardholder: {
      name: string;
      identification: {
        type: string;
        number: string;
      };
    };
    security_code: {
      length: number;
      card_location: string;
    };
    date_created: string;
    date_last_updated: string;
    date_due: string;
  };
  cardInfo?: {
    type: string;
    holderName: string;
    expirationDate: string;
  };
  paymentData?: {
    token: string;
    payment_method_id: string;
    transaction_amount: number;
    installments: number;
    payer: {
      email: string;
      identification: {
        type: string;
        number: string;
      };
    };
  };
  error?: string;
}

export interface FormData {
  accessToken: string;
  selectedCard: string;
  selectedState: string;
  docType: string;
  docNumber: string;
}

export const TEST_CARDS: TestCard[] = [
  {
    id: 'mastercard-credit',
    name: 'Mastercard Crédito',
    type: 'credit',
    brand: 'mastercard',
    number: '5031755734530604',
    cvv: '123',
    expMonth: '11',
    expYear: '30',
    holderName: 'APRO'
  },
  {
    id: 'visa-credit',
    name: 'Visa Crédito',
    type: 'credit',
    brand: 'visa',
    number: '4509953566233704',
    cvv: '123',
    expMonth: '11',
    expYear: '30',
    holderName: 'APRO'
  },
  {
    id: 'amex-credit',
    name: 'American Express',
    type: 'credit',
    brand: 'amex',
    number: '371180303257522',
    cvv: '1234',
    expMonth: '11',
    expYear: '30',
    holderName: 'APRO'
  },
  {
    id: 'mastercard-debit',
    name: 'Mastercard Débito',
    type: 'debit',
    brand: 'mastercard',
    number: '5287338310253304',
    cvv: '123',
    expMonth: '11',
    expYear: '30',
    holderName: 'APRO'
  },
  {
    id: 'visa-debit',
    name: 'Visa Débito',
    type: 'debit',
    brand: 'visa',
    number: '4002768694395619',
    cvv: '123',
    expMonth: '11',
    expYear: '30',
    holderName: 'APRO'
  }
];

export const TEST_STATES: TestState[] = [
  {
    code: 'APRO',
    name: 'Aprobado',
    description: 'Pago aprobado'
  },
  {
    code: 'OTHE',
    name: 'Rechazado - Error general',
    description: 'Rechazado por error general'
  },
  {
    code: 'CONT',
    name: 'Pendiente',
    description: 'Pendiente de pago'
  },
  {
    code: 'CALL',
    name: 'Rechazado - Validación',
    description: 'Rechazado con validación'
  },
  {
    code: 'FUND',
    name: 'Rechazado - Fondos',
    description: 'Rechazado por importe insuficiente'
  },
  {
    code: 'SECU',
    name: 'Rechazado - Código de seguridad',
    description: 'Rechazado por código de seguridad inválido'
  },
  {
    code: 'EXPI',
    name: 'Rechazado - Fecha vencimiento',
    description: 'Rechazado por fecha de vencimiento'
  },
  {
    code: 'FORM',
    name: 'Rechazado - Error formulario',
    description: 'Rechazado por error de formulario'
  }
];

export const DOC_TYPES = [
  { value: 'DNI', label: 'DNI (Argentina)' },
  { value: 'CUIL', label: 'CUIL (Argentina)' },
  { value: 'CUIT', label: 'CUIT (Argentina)' },
  { value: 'CPF', label: 'CPF (Brasil)' },
  { value: 'CNPJ', label: 'CNPJ (Brasil)' },
  { value: 'CC', label: 'Cédula de Ciudadanía (Colombia)' },
  { value: 'CE', label: 'Cédula de Extranjería (Colombia)' },
  { value: 'RUT', label: 'RUT (Chile)' },
  { value: 'CI', label: 'Cédula de Identidad' },
  { value: 'Otro', label: 'Otro' }
];