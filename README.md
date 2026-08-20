# 🍕 Pizzas Pipo - Plataforma Web Interactiva & Sistema de Delivery

Plataforma web moderna, rápida e interactiva para **Pizzas Pipo**. Permite a los clientes explorar el menú, personalizar pizzas en un canvas 2D interactivo, recibir recomendaciones con inteligencia artificial (**Pipo AI Sommelier**), consultar zonas de cobertura, realizar pedidos con cálculo de envío y cupones, y rastrear el estado del pedido en tiempo real. Además, incluye un **Panel de Administración protegido por contraseña** para gestionar todo el restaurante.

---

## 🚀 Características Principales

- 🍕 **Menú Interactivo Completo**: Pizzería, entradas, combos, bebidas y postres con filtros por categorías, vegetarianas, picantes y de alta demanda.
- 🎨 **Creador Visual de Pizzas (Canvas 2D)**: Diseña tu pizza desde cero seleccionando tipo de masa, tamaño, salsa, queso e ingredientes con vista previa en vivo.
- 🤖 **Pipo AI Sommelier**: Recomendador inteligente integrado con el modelo **Gemini AI** para sugerir maridajes de pizzas y bebidas según la ocasión o antojo del cliente.
- 🚚 **Verificador de Zonas de Cobertura**: Consulta de colonias, costos de envío y tiempos estimados de entrega.
- 🎟️ **Sistema de Cupones y Promociones**: Aplicación de códigos de descuento (ej. `PIPO20`, `PIPO100`) y cálculo de propinas opcionales.
- 📱 **Checkout y Rastreador de Pedidos**: Proceso de compra sencillo con simulación en tiempo real de estados del horno (Recibido ➔ En Horno ➔ En Camino ➔ Entregado).
- 🔓 **Panel de Administración Integrado**:
  - **Acceso por Contraseña**: Protegido con pantalla de autenticación.
  - **Activación**: Toca **3 veces** consecutivas el logo de *Pizzas Pipo* en la barra superior.
  - **Contraseña predeterminada**: `pipo2026` (modificable desde el panel).
  - **Gestión completa**: Modifica o agrega platillos, sube imágenes, cambia precios, edita promociones, configura zonas de entrega y actualiza avisos del sitio.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Iconos & Animaciones**: Lucide React, Motion, Canvas Confetti
- **Servidor Backend**: Express.js (Node.js) con bundling esbuild
- **Inteligencia Artificial**: `@google/genai` (Gemini AI SDK)

---

## 📦 Instalación y Ejecución Local

### Pre-requisitos
Asegúrate de tener instalado **Node.js** (versión 18 o superior) y **npm**.

### 1. Clonar o descargar el repositorio
```bash
git clone https://github.com/TU_USUARIO/pizzas-pipo.git
cd pizzas-pipo
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (Opcional)
Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```
Si deseas activar el modelo Gemini AI para el Sommelier, asigna tu API key en el archivo `.env`:
```env
GEMINI_API_KEY=tu_api_key_aqui
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## 🏗️ Compilación para Producción

Para generar los archivos optimizados de producción:

```bash
npm run build
```

Para ejecutar el servidor de producción:

```bash
npm start
```

---

## 🌐 Despliegue Automático en GitHub Pages

El proyecto ya está **100% configurado para GitHub Pages**:

1. **Sube el código a GitHub** usando la guía de abajo.
2. En tu repositorio de GitHub, ve a **Settings** ➔ **Pages**.
3. En **Source** (Fuente), selecciona **GitHub Actions**.
4. ¡Listo! Cada vez que hagas un `git push`, GitHub construirá y desplegará tu página automáticamente en la dirección:
   `https://TU_USUARIO.github.io/pizzas-pipo/`

---

## 📤 Pasos para Subir este Proyecto a GitHub (Paso a Paso)

1. **Descarga el ZIP**: Haz clic en el botón **"ZIP"** en la barra superior o en **"Descargar Proyecto (.ZIP)"** en el pie de página del sitio.
2. **Descomprime el archivo ZIP** en tu computadora.
3. **Crea un nuevo repositorio en GitHub** (ej. `pizzas-pipo`).
4. Abre la terminal en la carpeta descomprimida y ejecuta:

```bash
# 1. Inicializar repositorio git local
git init

# 2. Agregar todos los archivos
git add .

# 3. Crear el primer commit
git commit -m "feat: Lanzamiento inicial de Pizzas Pipo"

# 4. Asignar rama principal
git branch -M main

# 5. Enlazar con tu repositorio de GitHub (reemplaza TU_USUARIO y REPO)
git remote add origin https://github.com/TU_USUARIO/pizzas-pipo.git

# 6. Subir los archivos
git push -u origin main
```

---

## 🔒 Seguridad y Credenciales Admin

- **Contraseña por defecto**: `pipo2026`
- Para modificar la contraseña, ingresa al Panel de Administración (3 toques en el logo), navega a la pestaña **Datos de Pizzería** y actualiza el campo **Contraseña de Acceso**.

---

## 📄 Licencia

Este proyecto es software de código abierto desarrollado para **Pizzas Pipo**.
