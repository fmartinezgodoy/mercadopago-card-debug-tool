# MercadoPago Test Cards Toolkit

Una herramienta de debugging para tokenizar tarjetas de prueba de MercadoPago usando el SDK oficial desde el cliente. Ideal para desarrolladores que necesitan generar tokens de prueba de forma rápida y visual.

## ✨ Características

- 🎯 **Tokenización client-side**: Usa el SDK oficial de MercadoPago v2
- 💳 **Tarjetas de prueba predefinidas**: Incluye tarjetas de crédito y débito con datos completos
- 🎭 **Estados de prueba configurables**: Simula diferentes escenarios (APRO, OTHE, CONT, etc.)
- 🎨 **Interfaz moderna**: Diseño responsive con Tailwind CSS y dropdowns personalizados
- 📱 **Experiencia móvil**: Completamente responsive para dispositivos móviles
- 🔐 **Gestión automática de tokens**: Popup inteligente para configurar access token
- 📋 **Copia con un click**: Copia fácil de tokens y datos de pago
- ✅ **Validaciones inteligentes**: Validación de access tokens y datos de entrada
- 📊 **Vista detallada**: Información completa de CVV, fechas de vencimiento y metadatos

## 🚀 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/fmartinezgodoy/mercadopago-test-cards-toolkit.git
cd mercadopago-test-cards-toolkit
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

## 📖 Uso

### 1. Configura tu Access Token

Al abrir la aplicación, aparecerá un popup para configurar tu access token de MercadoPago:

- **Testing**: Debe comenzar con `TEST-`
- **Producción**: Debe comenzar con `APP_USR-`

El token se guarda automáticamente en localStorage y se validará en cada uso.

### 2. Selecciona una Tarjeta de Prueba

Elige entre las tarjetas predefinidas usando el dropdown personalizado que muestra:

**💳 Tarjetas de Crédito:**

- **Mastercard**: 5031 7557 3453 0604 (CVV: 123)
- **Visa**: 4509 9535 6623 3704 (CVV: 123)
- **American Express**: 3711 803032 57522 (CVV: 1234)

**💳 Tarjetas de Débito:**

- **Mastercard**: 5287 3383 1025 3304 (CVV: 123)
- **Visa**: 4002 7686 9439 5619 (CVV: 123)

> 📝 **Nota**: Al seleccionar una tarjeta, se mostrará automáticamente la fecha de vencimiento (11/30) y el código de seguridad.

### 3. Configura el Estado de Prueba

Selecciona el estado que determinará el comportamiento del titular usando el dropdown visual:

- ✅ **APRO**: Pago aprobado
- ❌ **OTHE**: Rechazado por error general
- ⏱️ **CONT**: Pendiente de pago
- ❌ **CALL**: Rechazado con validación
- ❌ **FUND**: Rechazado por importe insuficiente
- ❌ **SECU**: Rechazado por código de seguridad inválido
- ❌ **EXPI**: Rechazado por fecha de vencimiento
- ❌ **FORM**: Rechazado por error de formulario

### 4. Completa los Datos del Documento

Selecciona el tipo de documento y completa el número:

- **Soportados**: DNI, CUIL, CUIT, CPF, CNPJ, CC, CE, RUT, CI, etc.
- **Validación**: Se valida automáticamente el formato según el tipo

### 5. Tokeniza la Tarjeta

Haz clic en **"Tokenizar Tarjeta"** para generar el token. El proceso incluye:

- ⚡ **Validación previa** de todos los datos
- 🔄 **Indicador de progreso** visual
- 📋 **Resultado completo** con metadatos
- 💾 **Datos de ejemplo** para pagos

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Página principal con lógica de estado
│   ├── layout.tsx            # Layout global con estilos
│   └── globals.css           # Estilos globales con Tailwind
├── components/
│   ├── AccessTokenPopup.tsx      # Popup para configurar access token
│   ├── CardSelector.tsx          # Dropdown personalizado de tarjetas
│   ├── MercadoPagoTokenizer.tsx  # Componente principal de tokenización
│   ├── ProgressBar.tsx           # Barra de progreso animada
│   └── TokenResult.tsx           # Visualización de resultados
└── lib/
    ├── mercadopago.ts        # Utilidades y validaciones
    ├── types.ts              # Tipos TypeScript
    └── utils.ts              # Funciones auxiliares
```

## 🔧 API Reference

### Componente Principal: `MercadoPagoTokenizer`

```typescript
interface MercadoPagoTokenizerProps {
  accessToken: string;
  selectedCard: {
    number: string;
    cvv: string;
    expMonth: string;
    expYear: string;
    holderName: string;
  };
  docType: string;
  docNumber: string;
  shouldGenerate: boolean;
  onTokenGenerated: (result: TokenizeResponse) => void;
  onLoading: (loading: boolean) => void;
}
```

### Respuesta de Tokenización

````typescript
interface TokenizeResponse {
  success: boolean;
  timestamp: string;
  token?: {
    id: string;                    // Token para usar en pagos
    first_six_digits: string;     // Primeros 6 dígitos
    last_four_digits: string;     // Últimos 4 dígitos
    payment_method_id: string;    // ID del método de pago
    expiration_month: number;     // Mes de vencimiento
    expiration_year: number;      // Año de vencimiento
    cardholder: {
      name: string;
      identification: {
        type: string;
        number: string;
          }
        };
        // ... más metadatos
      };
      cardInfo?: {
        type: string;               // Tipo de tarjeta
        holderName: string;         // Nombre del titular
        expirationDate: string;     // Fecha de vencimiento
      };
      paymentData?: {
        token: string;              // Token a usar
        payment_method_id: string;  // Método de pago
        transaction_amount: number; // Monto de ejemplo
        installments: number;       // Cuotas
        payer: {
          email: string;
          identification: {
            type: string;
            number: string;
          }
        }
      };
      error?: string;               // Error si falla
    }
    ```

## ⚙️ Configuración

### Variables de Entorno

No se requieren variables de entorno. La configuración se maneja completamente desde la interfaz.

### Personalización de Estilos

Puedes personalizar los colores editando `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#667eea',    // Color principal (azul)
      success: '#28a745',    // Color de éxito (verde)
      error: '#dc3545',      // Color de error (rojo)
    },
  },
}
````

### Estilos Personalizados

La aplicación incluye componentes personalizados definidos en `globals.css`:

- `.btn-primary` - Botón principal
- `.btn-secondary` - Botón secundario
- `.card` - Tarjetas de contenido
- `.input-field` - Campos de entrada
- `.form-section` - Secciones de formulario

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (localhost:3000)
npm run build    # Build para producción
npm run start    # Servidor de producción
npm run lint     # Linter y verificación de tipos
```

### Flujo de Desarrollo

1. **Desarrollo local**: `npm run dev`
2. **Validación**: `npm run lint`
3. **Build**: `npm run build`
4. **Deploy**: Los cambios se despliegan automáticamente via GitHub Actions

### Tecnologías Utilizadas

- **Framework**: Next.js 15.3.4 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **SDK**: MercadoPago SDK v2 (client-side)
- **Deploy**: GitHub Pages con GitHub Actions

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'Add: nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crea un Pull Request

### Guidelines

- Usa TypeScript para type safety
- Sigue las convenciones de Tailwind CSS
- Añade validaciones apropiadas
- Documenta cambios significativos

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 🆘 Soporte

Para soporte, preguntas o reportar bugs:

- 🐛 [Abrir un Issue](https://github.com/fmartinezgodoy/mercadopago-test-cards-toolkit/issues)
- 💬 [Discussions](https://github.com/fmartinezgodoy/mercadopago-test-cards-toolkit/discussions)

## 🌟 Roadmap

- [ ] Soporte para más tipos de documento
- [ ] Configuración de ambientes (sandbox/production)
- [ ] Exportar configuraciones
- [ ] Soporte para pagos con billetera
- [ ] Tema oscuro

---

**¿Te resulta útil?** ¡Dale una ⭐ al repositorio!
