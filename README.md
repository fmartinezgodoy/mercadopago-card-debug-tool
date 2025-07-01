# MercadoPago Card Debug Tool

Una herramienta de debugging para tokenizar tarjetas de prueba de MercadoPago desde el lado del servidor, evitando problemas de CORS y CSP durante el desarrollo.

## Características

- ✅ **Tokenización server-side**: Evita problemas de CORS y CSP
- ✅ **Tarjetas de prueba predefinidas**: Incluye tarjetas de crédito y débito
- ✅ **Estados de prueba**: Simula diferentes escenarios (APRO, OTHE, CONT, etc.)
- ✅ **Interfaz moderna**: Diseño responsive con Tailwind CSS
- ✅ **Historial de tokenizaciones**: Mantiene un registro de las últimas tokenizaciones
- ✅ **Copia de resultados**: Copia fácil de tokens y datos de pago
- ✅ **Validaciones**: Validación de access tokens y datos de entrada

## Stack Tecnológico

- **Next.js 14+** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **Server Actions** para tokenización
- **SDK oficial de MercadoPago** (v2.8.0)

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd mercadopago-card-debug-tool
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Uso

### 1. Configura tu Access Token

Ingresa tu access token de MercadoPago (debe comenzar con `TEST-` para testing o `APP_USR-` para producción). El token se guarda automáticamente en localStorage.

### 2. Selecciona una Tarjeta de Prueba

Elige entre las tarjetas predefinidas:

**Tarjetas de Crédito:**
- Mastercard: 5031 7557 3453 0604
- Visa: 4509 9535 6623 3704  
- American Express: 3711 803032 57522

**Tarjetas de Débito:**
- Mastercard: 5287 3383 1025 3304
- Visa: 4002 7686 9439 5619

### 3. Configura el Estado de Prueba

Selecciona el estado que determinará el resultado de la tokenización:

- **APRO**: Pago aprobado
- **OTHE**: Rechazado por error general
- **CONT**: Pendiente de pago
- **CALL**: Rechazado con validación
- **FUND**: Rechazado por importe insuficiente
- **SECU**: Rechazado por código de seguridad inválido
- **EXPI**: Rechazado por fecha de vencimiento
- **FORM**: Rechazado por error de formulario

### 4. Ingresa los Datos del Documento

Completa el tipo y número de documento (DNI, CI, etc.).

### 5. Genera el Token

Haz clic en "Generar Token" para tokenizar la tarjeta. Los resultados incluyen:

- **Token completo** con todos los metadatos
- **Datos de la tarjeta** (primeros 6 y últimos 4 dígitos)
- **Ejemplo de payload** para pagos
- **Historial** de tokenizaciones

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout global
│   └── globals.css        # Estilos globales
├── components/
│   ├── AccessTokenInput.tsx    # Input para access token
│   ├── CardSelector.tsx        # Selector de tarjetas
│   └── TokenResult.tsx         # Visualización de resultados
├── lib/
│   ├── mercadopago.ts     # Configuración SDK MercadoPago
│   ├── types.ts           # Tipos TypeScript
│   └── utils.ts           # Utilidades generales
└── actions/
    └── tokenize.ts        # Server Action para tokenización
```

## API Reference

### Server Action: `tokenizeCard`

```typescript
interface TokenizeRequest {
  accessToken: string;
  cardNumber: string;
  cvv: string;
  expMonth: string;
  expYear: string;
  holderName: string;
  docType: string;
  docNumber: string;
}

interface TokenizeResponse {
  success: boolean;
  timestamp: string;
  token?: CardToken;
  cardInfo?: CardInfo;
  paymentData?: PaymentData;
  error?: string;
}
```

## Configuración

### Variables de Entorno

No se requieren variables de entorno adicionales. El access token se configura a través de la interfaz.

### Personalización

Para personalizar los colores o estilos, edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#667eea',  // Color principal
      success: '#28a745',  // Color de éxito
      error: '#dc3545',    // Color de error
    },
  },
}
```

## Desarrollo

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

### Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.

## Soporte

Para soporte o preguntas, por favor abre un issue en el repositorio.