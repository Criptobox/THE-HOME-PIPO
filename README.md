# 🍕 THE HOME PIPO - Pizzería Artesanal PWA

Aplicación web progresiva (PWA) de alta gama para pizzería artesanal al horno de piedra volcánica (450°C), con armador de pizzas en 2D, sommelier inteligente con IA, seguimiento de pedidos en tiempo real y notificaciones push.

---

## 🚀 ¿Por qué dejaba de cargar la página al subir el ZIP?

Cuando descargas el **código fuente**, los archivos están escritos en **React + TypeScript (`.tsx`)**. Los navegadores y servicios de hosting estático (como GitHub Pages) **no pueden ejecutar archivos `.tsx` sin antes compilarlos** a HTML, CSS y JavaScript estándar.

### 🛠️ Solución Implementada:

Hemos configurado **2 métodos definitivos** para que la página funcione al 100% y se actualice automáticamente:

---

### OPCIÓN 1 (Recomendada): Despliegue Automático con GitHub Actions (CI/CD)

Ya hemos incluido el archivo de automatización en:
`.github/workflows/deploy.yml`

**Cómo funciona:**
1. Sube los archivos del ZIP del código fuente a tu repositorio en GitHub.
2. En tu repositorio en GitHub, ve a **Settings** > **Pages**.
3. En **Source** (Origen), selecciona: **GitHub Actions**.
4. ¡Listo! **Cada vez que subas cambios o actualices archivos, GitHub compilará y montará la página automáticamente en segundos** sin que tengas que hacer nada manual.

---

### OPCIÓN 2: Subir la Web Ya Compilada (Sin necesidad de compilar)

Si prefieres no usar GitHub Actions y subir los archivos directamente a GitHub Pages, Netlify o cualquier hosting:

1. Descarga el archivo **`THE-HOME-PIPO-WEB-LISTA.zip`** desde el enlace directo `/api/download-web-zip` o desde el botón en la web.
2. Descomprime ese ZIP: contiene la carpeta `dist` con los archivos HTML, CSS y JavaScript ya compilados y listos.
3. Sube esos archivos directamente a la raíz de tu repositorio o hosting.

---

## 💻 Desarrollo Local

Para correr el proyecto en tu máquina local:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 📱 Características de la PWA
- **Service Worker (`sw.js`)**: Notificaciones push con branding oficial y funcionamiento offline.
- **Manifest (`manifest.json`)**: Instalable en Android, iOS, Windows y macOS.
- **Iconos de Marca**: En resoluciones de 192x192 y 512x512 con insignia de notificaciones.
- **Chef Pipo AI**: Asistente y sommelier con Google Gemini.
