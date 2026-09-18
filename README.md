# 🤝 Pronto – Asistencia al Extranjero

Pronto es una aplicación web móvil (mobile-first) y responsiva diseñada para brindar asistencia inmediata a extranjeros en situaciones de emergencia o trámites burocráticos en Brasil. Su principal valor es romper la barrera del idioma en momentos críticos, proporcionando rutas de acción paso a paso y checklists interactivos de supervivencia con traducciones precisas al portugués, español e inglés.

Este proyecto fue desarrollado bajo una arquitectura ágil y eficiente, optimizado para ejecutarse al 100% en el cliente (Frontend-only) y apoyándose en herramientas sin servidores (Serverless) de bajo o nulo costo.

---

## 🚀 Características Clave

*   **⚡ Acceso Inmediato (Sin Fricción):** El usuario no necesita registrarse ni iniciar sesión en momentos de estrés. La aplicación es totalmente accesible de inmediato de forma anónima.
*   **🩺 8 Categorías de Emergencia y Cotidianidad:** Salud, Policía/Denuncias, Registro Migratorio (Polícia Federal), Bancos, Restaurantes, Transporte Público, Supermercado y Telefonía.
*   **🧠 Checklist Interactivo Off-line:** Permite marcar frases y preguntas frecuentes. El estado se guarda localmente en el dispositivo mediante `localStorage`, de modo que no se pierden los avances al cambiar de pantalla o si hay fallas en la red.
*   **🗺️ Integración Nativa de Mapas (Sin Costo de API):** Un botón de búsqueda que abre la aplicación o el sitio de Google Maps en un hilo externo mediante deep linking para trazar la ruta de los centros más cercanos.
*   **🌎 Idiomas & Colores:** Soporta el cambio ágil de idioma en la UI y cuenta con un tema de alto contraste (Modo Claro/Oscuro).
*   **💬 Propuesta Colaborativa (Formulario de Sugerencias):** Los usuarios pueden sugerir frases basadas en su experiencia. El formulario se envía directamente a una hoja de cálculo de Google Sheets de forma asíncrona.
*   **🧹 Botón Inteligente de Limpieza:** Para reutilizar las secciones, se activa un botón de "Limpiar Todo" únicamente cuando el usuario ha completado el 100% de los pasos o frases de esa sección específica.

---

## 🛠️ Arquitectura Técnica

El MVP está diseñado para no requerir servidores activos, bases de datos complejas ni costos de mantenimiento (100% gratuito):

1.  **Frontend:** React con Tailwind CSS (Mobile-First / Desktop-Fluid) y Lucide Icons.
2.  **Estado Local:** `localStorage` para la persistencia del checklist.
3.  **Captura de Datos (No-Code/Serverless):** Formulario asíncrono con `fetch` (`mode: 'no-cors'`) y parseado JSON, que envía los datos a un Webhook en Google Apps Script en formato `text/plain` para evitar conflictos de CORS.
4.  **Base de Datos:** Google Sheets actúa como el backend de recepción de sugerencias de los usuarios.

---

## 📂 Estructura del Proyecto

```text
├── public/                # Recursos públicos (íconos, favicons, etc.)
├── src/
│   ├── components/        # Componentes reutilizables (Navbar, Cards, Modals)
│   ├── data/              # Datos estáticos de las categorías y frases
│   ├── App.jsx            # Punto de entrada y enrutamiento (o HashRouter)
│   ├── index.css          # Configuraciones de Tailwind CSS
│   └── main.jsx           # Renderizado principal
├── .env.example           # Variables de entorno de ejemplo
├── package.json           # Dependencias del proyecto
└── README.md              # Documentación
```

---

## ⚙️ Configuración del Servidor sin Servidores (Google Sheets Backend)

Para conectar el formulario de sugerencias de frases a tu Google Sheet sin pagar pasarelas o base de datos:

1.  Crea un nuevo **Google Sheet** y agrega en la primera fila estos encabezados de la columna `A` a la `F`:  
    `Fecha` | `Categoría` | `Idioma Origen` | `Frase ES` | `Frase PT` | `Frase EN`
2.  Ve a **Extensiones > Apps Script**, borra el código por defecto y pega el siguiente script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (typeof e === 'undefined' || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "No data received" })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(), 
      data.categoria || "Sin categoría", 
      data.idiomaOrigen || "No especificado",
      data.fraseES || "", 
      data.frasePT || "", 
      data.fraseEN || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3.  Presiona **Guardar**.
4.  Haz clic en **Implementar > Nueva implementación**.
    *   Selecciona tipo: **Aplicación web**.
    *   Ejecutar como: **Yo** (tu correo de Google).
    *   Quién tiene acceso: **Cualquier persona** (Es de suma importancia para que el frontend pueda enviar datos).
5.  Copia la URL generada (`https://script.google.com/.../exec`).
6.  Crea un archivo `.env` en la raíz de tu proyecto e inyecta la URL de esta forma (o configúrala en tu servicio de hosting):

```env
VITE_GOOGLE_SCRIPT_URL=TU_URL_DE_APPS_SCRIPT_AQUI
```

---

## 📦 Desarrollo Local e Instalación

Para correr y probar Pronto localmente en tu máquina:

1.  Clona este repositorio:
    ```bash
    git clone https://github.com/TU_USUARIO/pronto-asistencia.git
    cd pronto-asistencia
    ```
2.  Instala las dependencias necesarias:
    ```bash
    npm install
    ```
3.  Ejecuta el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 🌍 Despliegue en Producción

Dado que esta aplicación es 100% del lado del cliente, puedes desplegarla de manera gratuita en los mejores servidores estáticos del mundo:

*   **Vercel (Recomendado):** Simplemente importa este repositorio de GitHub en Vercel. Detectará que usas React/Vite y completará la configuración de forma automática, resolviendo además el enrutamiento. Recuerda agregar tu variable `VITE_GOOGLE_SCRIPT_URL` en las configuraciones de entorno (Environment Variables) de Vercel.
*   **GitHub Pages:** Si decides utilizar GitHub Pages, asegúrate de que el router del proyecto esté configurado para usar `HashRouter` en lugar de `BrowserRouter` en `src/App.jsx` para evitar que las recargas de página (refreshes) causen errores 404 (puesto que es un host estático).

---

## 🤝 Contribuciones

¿Quieres sugerir mejoras o agregar nuevas frases de supervivencia? ¡Suma tu aporte a través de la propia aplicación! Si eres desarrollador y deseas mejorar la experiencia, los Pull Requests son bienvenidos.

Diseñado con empatía para los extranjeros que inician una nueva etapa. ¡Hacia adelante! 🚀