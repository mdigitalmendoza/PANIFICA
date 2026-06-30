# Panifica 🥖

Asistente Inteligente de Producción para Panaderías Artesanales.

Lee los pedidos de los repartidores y las recetas del negocio, explota la lista de materiales al instante, y entrega a los operarios de cocina un resumen claro de "qué hornear y con cuánto de cada ingrediente".

## Arquitectura Híbrida

- **Motor BOM** — Matemática pura. Sin IA. Sin alucinaciones.
- **IA Asíncrona** — Solo para detectar anomalías en pedidos. Sin almacenamiento de datos.

## Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite (mobile-first)
- **IA**: OpenAI GPT-4o-mini o Anthropic Claude 3.5 Haiku
- **Deploy**: Vercel / Railway

## Desarrollo Local

```bash
# Clonar e instalar
git clone <repo>
cd panifica

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves

# Instalar dependencias
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Iniciar en desarrollo
npm run dev
```

## Estructura del Proyecto

```
panifica/
├── server/                # Backend Express
│   ├── routes/            # Rutas REST
│   ├── services/          # Lógica de negocio (BOM engine, IA)
│   ├── utils/             # Parseo de archivos
│   └── index.js           # Punto de entrada
├── client/                # Frontend React + Vite
│   ├── src/
│   │   ├── components/    # Componentes de UI
│   │   └── App.jsx        # Aplicación principal
│   └── index.html
├── samples/               # Datos de ejemplo
├── .env.example           # Template de variables de entorno
└── vercel.json            # Config de deploy
```

## Seguridad

- 🔒 Cero almacenamiento de datos en servicios de IA (cabeceras de no-entrenamiento)
- 🔒 Variables de entorno obligatorias. Cero hardcode.
- 🔒 Endpoints preparados para webhooks firmados con tokens.
