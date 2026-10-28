# El Bajón del Chambe — Sitio web

Sitio web para el local de comida rápida **El Bajón del Chambe**, con landing
page, catálogo y página de contacto. Pedidos directamente por WhatsApp.

---

## Inicio rápido

```bash
npm install       # Instala Tailwind (solo la primera vez)
npm run build     # Genera dist/styles.css
npm run serve     # Levanta el sitio en http://localhost:3000
```

Durante el desarrollo puedes usar `npm run dev` (recompila el CSS
automáticamente al guardar).

---

## 📁 Estructura

```
├── index.html              Landing page
├── catalogo.html           Catálogo con filtros por categoría
├── contacto.html           Contacto y ubicación (sin formulario)
├── src/
│   ├── css/main.css        Tailwind + tema de la marca
│   └── js/
│       ├── config.js       ⭐ ARCHIVO PRINCIPAL — datos y catálogo
│       ├── main.js         Header, footer, grillas, filtros
│       ├── icons.js        Iconos SVG + grilla de categorías
│       └── contacto.js     Horarios, redes, mapa, estado abierto/cerrado
├── assets/img/             Fotografías locales y CREDITOS.md
├── scripts/                Generador de placeholders
├── dist/styles.css         CSS compilado (generado, no editar)
└── manifest.webmanifest, robots.txt, sitemap.xml
```

---

## ✏️ Cómo editar el contenido

### 1. Datos del negocio (teléfono, dirección, redes, horarios)

Abre **`src/js/config.js`** y edita el objeto `NEGOCIO`:

```js
export const NEGOCIO = {
  nombre: 'El Bajón del Chambe',
  telefonoWhatsapp: '56926046878',        // solo números, con 56
  telefonoLegible: '+56 9 2604 6878',    // como se muestra
  direccion: 'Av. Coronel Alejandro Sepúlveda #7218',
  instagram: 'elbajondelchambe_',
  instagramUrl: 'https://instagram.com/elbajondelchambe_',
  facebookUrl: '',                        // vacío = no se muestra
  tiktokUrl: '',
  horarios: [
    { dia: 'Lunes a Jueves', hora: '11:00 – 22:00' },
    // ...
  ],
};
```

> Para agregar Facebook o TikTok, completa `facebookUrl` / `tiktokUrl`
> (y opcionalmente `facebook` / `tiktok` con el nombre de usuario).

### 2. Agregar o quitar productos

En el mismo `config.js`, edita el array `PRODUCTOS`:

```js
{
  id: 'chambe-clasica',                  // identificador único
  nombre: 'Chambe Clásica',
  descripcion: 'Carne de res 150g, queso cheddar...',
  precio: 4990,                          // número, sin $ ni puntos
  imagen: 'assets/img/productos/chambe-clasica.jpg',
  categoria: 'hamburguesas',             // debe existir en CATEGORIAS
  destacado: true,                       // true = aparece en la landing
  etiquetas: ['Más pedido'],             // chips opcionales
}
```

**Agregar una categoría nueva:** edita `CATEGORIAS`:

```js
{ id: 'combos', nombre: 'Combos', icono: '🍱' },
```

### 3. Cambiar los colores de la marca

Abre **`src/css/main.css`** y modifica el bloque `@theme`:

```css
@theme {
  --color-brand-500: #f5b301;   /* mostaza */
  --color-flame-500: #ff6b35;   /* naranja de los CTA */
  --color-ink-950: #0b0b0d;     /* fondo */
}
```

Después ejecuta `npm run build`.

---

## 🖼️ Fotografías reales de referencia

El hero, los productos y las categorías ya utilizan **fotografías reales de
referencia**, descargadas y optimizadas como archivos locales. No son fotos del
negocio. Las fuentes y licencias están en `assets/img/CREDITOS.md` y en el pie
de página. Algunas variantes comparten imagen de su categoría.

Para reemplazarlas por fotografías propias:

1. Copia tus fotos a `assets/img/productos/` (o a `assets/img/`)
2. Actualiza la ruta en el campo `imagen` de cada producto en `config.js`
3. Para el hero y el local, reemplaza `assets/img/hero.jpg` y
   `assets/img/local.jpg` manteniendo esos nombres. Actualmente `local.jpg` es una
   chorrillana referencial: si lo cambias por una foto del local, actualiza también
   su texto alternativo y el pie de foto en `index.html`.

**Imágenes sugeridas:** 1200×900 px (productos), 1000×1250 px (hero), JPG o WebP.

Si una imagen falta, el sitio muestra `assets/img/placeholder.jpg`
automáticamente.

### Volver a descargar las fotografías de referencia

```bash
node scripts/descargar-fotografias.mjs
```

Requiere conexión y sobreescribe las fotografías actuales. No forma parte del build.

### Regenerar los placeholders (solo si quieres quitar las fotos)

```bash
node scripts/generar-placeholders.mjs --sobrescribir-fotos
```

> Este script solo sirve si quieres volver a los placeholders.
> **No lo ejecutes después de poner tus fotos reales** (las sobreescribe).

---

## Animaciones

`src/js/motion.js` revela las secciones y tarjetas al entrar en pantalla mediante
IntersectionObserver. Los filtros vuelven a registrar las tarjetas recién
renderizadas. La portada usa entradas de foto y badge, y las tarjetas/categorías
tienen zoom y transiciones al pasar el cursor. `prefers-reduced-motion` desactiva
estos movimientos y mantiene todo el contenido visible. No agrega dependencias.

## Pedidos por WhatsApp

Cada producto tiene un botón que abre WhatsApp con el mensaje ya escrito:

```
¡Hola El Bajón del Chambe! 👋 Quiero pedir:

• Chambe Clásica — $4.990

¿Me confirmas disponibilidad y tiempo de entrega?
```

El número de WhatsApp sale de `NEGOCIO.telefonoWhatsapp`. El texto se arma
automáticamente en `mensajePedido()` (al final de `config.js`).

---

## 🚀 Publicar

El sitio es 100% estático. Puedes subirlo a:

- **Netlify** — arrastra la carpeta (o conecta el repo)
- **Vercel** — `vercel deploy`
- **GitHub Pages** — sube el repo y activa Pages en *Settings → Pages*
- **Cloudflare Pages** — conecta el repo, build command `npm run build`,
  output directory `.`

> **Importante:** en `sitemap.xml` y `robots.txt` cambia `/` por tu dominio
> real, por ejemplo `https://tubarrio.com/`.

---

## ✅ Estado actual

- [x] Landing page con hero, servicios, destacados, categorías y CTA
- [x] Catálogo con filtros por categoría (URL actualizable)
- [x] Contacto **sin formulario**: WhatsApp, teléfono, ubicación, mapa, horarios, redes
- [x] Botón flotante de WhatsApp en todas las páginas
- [x] Responsive (mobile-first)
- [x] SEO: meta tags, Open Graph, JSON-LD pendiente de dominio real
- [x] Estado "Abierto ahora / Cerrado ahora" según el horario

### Pendientes de configuración

- [x] Reemplazar los placeholders por fotografías reales de referencia
- [ ] Incorporar fotografías propias de cada producto y del local
- [ ] Confirmar los horarios reales del local
- [ ] Agregar el link exacto de Google Maps de tu local
- [ ] Agregar Facebook / TikTok si existen
- [ ] Ajustar `sitemap.xml` y `robots.txt` con el dominio final
- [ ] Confirmar precios y nombres de los productos

---

## 🎨 Paleta

| Color         | Hex       | Uso                    |
| ------------- | --------- | ---------------------- |
| Mostaza       | `#f5b301` | Acentos, precios, CTA  |
| Naranja flame | `#ff6b35` | Detalles y degradados  |
| Fondo         | `#0b0b0d` | Fondo principal        |
| Card          | `#18181b` | Superficies           |
| Texto         | `#a1a1aa` | Texto secundario       |

**Tipografías:** Anton (títulos) + Inter (texto), desde Google Fonts.
