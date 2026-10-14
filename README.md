# Verso for phpMyAdmin v1.0

Modo oscuro profesional y suite de productividad para phpMyAdmin. Manifest V3, sin build, sin dependencias. Compatible con Chromium 120+ (Chrome, Brave, Edge, Opera).

---

## 🚀 Nuevas funcionalidades (v1.0)

### 1. 🛡️ Protección en producción (SQL Guard)
- Marca cualquier servidor como **"Crítico"** en el popup o en las opciones.
- Intercepta consultas destructivas: `DROP`, `TRUNCATE`, `DELETE` sin `WHERE` y `UPDATE` sin `WHERE`.
- Requiere escribir explícitamente el nombre del servidor para desbloquear la ejecución.
- Notificación sutil (toast) al ejecutar cualquier consulta en servidores críticos.

### 2. 📊 Tablas "Pro"
- **Cabecera fija (Sticky header)**: Las cabeceras de columnas permanecen visibles al hacer scroll vertical en tablas largas de resultados.
- **Clic para copiar**: Haz clic en cualquier celda para copiar su contenido al portapapeles con confirmación visual.
- **JSON interactivo**: Formatea automáticamente campos JSON y los vuelve colapsables con `<details>`.
- **URLs clicables**: Convierte cadenas URL en enlaces directos y seguros (`target="_blank"`).
- **Fechas legibles**: Detección de timestamps e ISO-8601 con tooltip de fecha relativa ("hace 2 horas").
- **Columnas redimensionables**: Arrastra los bordes de las cabeceras para ajustar el ancho; se recuerda tu elección por tabla en `localStorage`.
- **Columnas ocultables**: Clic derecho en cualquier cabecera para ocultar columnas innecesarias y restaurarlas cuando quieras.

### 3. 🎨 Tinte total del entorno
- Opción de colorear también el borde exterior de toda la ventana del navegador y la cabecera del sidebar de navegación con el color asignado a ese servidor, para evitar cualquier confusión entre entornos de desarrollo, staging y producción.

### 4. 🏷️ Identificación y fix de bases de datos agrupadas
- Corrección del bug de texto negro en bases de datos agrupadas por prefijo en el árbol de navegación lateral en todos los themes.
- Se añade un badge visual distintivo (`grupo`) y acentuado para reconocer las agrupaciones al instante.

### 5. ⚙️ Página de opciones y sincronización en la nube
- Gestión integral de todos los servidores y ajustes desde `options/options.html`.
- Sincronización en la nube entre diferentes ordenadores mediante `chrome.storage.sync`.
- **Copia de seguridad**: Exportación e importación de la configuración completa en formato JSON.
- Ajustes de accesibilidad: selector de tamaño de fuente (12px–18px), fuente monoespaciada personalizada y modo de alto contraste WCAG AA.

### 6. 🌐 Internacionalización nativa (i18n)
- Soporte bilingüe completo (Inglés como idioma predeterminado, Español según la configuración del navegador).

### 7. 🔄 Compatibilidad amplia
- phpMyAdmin 4.9, 5.1, 5.2+ (Bootstrap 5) y preparación para phpMyAdmin 6.0.
- Soporte para themes nativos: `pmahomme`, `bootstrap`, `metro` y `original`.

---

## 📦 Instalación

1. Descarga o clona este repositorio.
2. Abre `chrome://extensions` o `brave://extensions` en tu navegador.
3. Activa la casilla **Modo de desarrollador** (arriba a la derecha).
4. Haz clic en **Cargar descomprimida** y selecciona la carpeta `phpmyadmin-dark`.
5. Abre tu phpMyAdmin, haz clic en el ícono de la extensión en la barra de herramientas y pulsa **Activar en este sitio**.

---

## ⌨️ Atajos de teclado

- **`Alt+Shift+D`**: Alterna el modo oscuro para el phpMyAdmin de la pestaña activa (configurable en `chrome://extensions/shortcuts`).

---

## 🧪 Pruebas automáticas

Ejecuta el escáner de validación con:

```bash
# Windows
tests\run.bat

# Linux / macOS
bash tests/run.sh
```

El script verifica la integridad del manifest, la simetría de traducciones i18n, los selectores CSS y los content scripts.

---

## 📂 Estructura del proyecto

```text
phpmyadmin-dark/
├── manifest.json            # Manifest V3 con i18n y opciones
├── background.js            # Service worker con inyección dinámica y storage sync
├── lib/
│   └── pdm.js               # Núcleo y modelos de datos compartidos
├── content/
│   ├── boot.js              # Inicialización rápida, caché anti-parpadeo y badges
│   ├── sql-guard.js         # Interceptor y modal de protección para consultas críticas
│   └── tables-pro.js        # Sticky headers, copiar celda, JSON, redimensionado
├── css/
│   ├── themes.css           # Paletas de color (Midnight, Graphite, AMOLED, Nord, Dracula, Mocha)
│   ├── base.css             # Correcciones y reglas del modo oscuro (incluye fix de grupos)
│   ├── modern.css           # Estilos de componentes modernos (pestañas, tarjetas, botones)
│   ├── icons.css            # Sustitución de íconos por SVG modernos
│   ├── env.css              # Etiquetas de servidor y tinte total de ventana
│   ├── tables-pro.css       # Estilos para tablas pro (resizable, sticky, JSON colapsable)
│   └── compat.css           # Compatibilidad con phpMyAdmin 4.9, 5.1, 6.0 y themes nativos
├── popup/                   # Ventana emergente de la extensión
├── options/                 # Panel de configuración completa y respaldo
├── _locales/                # Paquetes de idiomas (en, es)
├── tests/                   # Suite de pruebas automatizadas y escáner
└── tools/                   # Generador de íconos SVG
```

---

## 🔒 Privacidad

La extensión no recolecta, almacena ni transmite ningún dato fuera de tu navegador. Toda la configuración se guarda de forma local en `chrome.storage.local` (y opcionalmente en tu cuenta privada de Google mediante `chrome.storage.sync` si activas la sincronización). Consulta [PRIVACY.md](PRIVACY.md) para más detalles.
