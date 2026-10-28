/* ==========================================================================
   Generador de imágenes placeholder
   --------------------------------------------------------------------------
   Crea una imagen JPG/PNG por cada producto, con el nombre del producto
   y un ícono temático, usando los colores de la marca.

   Uso:  node scripts/generar-placeholders.mjs
   ========================================================================== */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (!process.argv.includes('--sobrescribir-fotos')) {
  console.error('El sitio ya contiene fotografías. Para reemplazarlas por placeholders, usa --sobrescribir-fotos.');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, '..');
const DIR_IMG = path.join(RAIZ, 'assets', 'img');
const DIR_PROD = path.join(DIR_IMG, 'productos');

/* Colores de la marca */
const FONDO_1 = '#18181b';
const FONDO_2 = '#0b0b0d';
const MOSTAZA = '#f5b301';
const NARANJA = '#ff6b35';

/* Iconos vectoriales por categoría (SVG, no emojis: sin fuente de color) */
const ICONOS = {
  hamburguesas: `<g fill="none" stroke="${MOSTAZA}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round">
      <path d="M120 175c0-38 66-68 180-68s180 30 180 68" fill="${MOSTAZA}" fill-opacity="0.18"/>
      <path d="M120 175h360"/>
      <path d="M140 225c22-18 44-18 66 0s44 18 66 0 44-18 66 0 44 18 66 0" stroke="${NARANJA}"/>
      <path d="M140 275c22-18 44-18 66 0s44 18 66 0 44-18 66 0 44 18 66 0" stroke="${NARANJA}"/>
      <path d="M150 330h300a24 24 0 0 1 24 24v10a24 24 0 0 1-24 24H150a24 24 0 0 1-24-24v-10a24 24 0 0 1 24-24z" fill="${MOSTAZA}" fill-opacity="0.22"/>
      <circle cx="180" cy="120" r="12" fill="${MOSTAZA}"/>
      <circle cx="240" cy="104" r="12" fill="${MOSTAZA}"/>
      <circle cx="300" cy="98" r="12" fill="${MOSTAZA}"/>
      <circle cx="360" cy="104" r="12" fill="${MOSTAZA}"/>
      <circle cx="420" cy="120" r="12" fill="${MOSTAZA}"/>
    </g>`,
  completos: `<g fill="none" stroke="${MOSTAZA}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round">
      <path d="M110 260c0-70 80-125 190-125s190 55 190 125c0 30-20 50-50 50H160c-30 0-50-20-50-50z" fill="${MOSTAZA}" fill-opacity="0.18"/>
      <path d="M110 260c0-70 80-125 190-125s190 55 190 125c0 30-20 50-50 50H160c-30 0-50-20-50-50z"/>
      <path d="M150 200c30 12 60-6 90 6s60 18 90 0 60-12 90 0" stroke="${NARANJA}"/>
      <path d="M170 260c40 18 80-14 120 4s80 22 120 0" stroke="${NARANJA}"/>
      <circle cx="230" cy="150" r="14" fill="${MOSTAZA}"/>
      <circle cx="300" cy="128" r="14" fill="${MOSTAZA}"/>
      <circle cx="370" cy="150" r="14" fill="${MOSTAZA}"/>
    </g>`,
  papas: `<g fill="none" stroke="${MOSTAZA}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round">
      <path d="M160 330l60-160M240 330V150M320 330l-60-160M400 330V150" stroke="${NARANJA}" stroke-width="20"/>
      <path d="M120 330h360l-40 90H160z" fill="${MOSTAZA}" fill-opacity="0.2"/>
      <path d="M120 330h360l-40 90H160z"/>
    </g>`,
  chorros: `<g fill="none" stroke="${MOSTAZA}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round">
      <rect x="140" y="220" width="320" height="120" rx="60" fill="${MOSTAZA}" fill-opacity="0.18"/>
      <rect x="140" y="220" width="320" height="120" rx="60"/>
      <path d="M460 250c40-10 60 40 20 50" stroke="${NARANJA}"/>
      <path d="M200 260h200M200 300h160" stroke="${NARANJA}"/>
    </g>`,
  cafeteria: `<g fill="none" stroke="${MOSTAZA}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round">
      <path d="M150 190h220v100a70 70 0 0 1-70 70h-80a70 70 0 0 1-70-70z" fill="${MOSTAZA}" fill-opacity="0.18"/>
      <path d="M150 190h220v100a70 70 0 0 1-70 70h-80a70 70 0 0 1-70-70z"/>
      <path d="M370 230h30a36 36 0 0 1 0 72h-30"/>
      <path d="M120 380h290" stroke="${NARANJA}"/>
      <path d="M210 150c-14-18 14-30 0-50M280 150c-14-18 14-30 0-50" stroke="${NARANJA}"/>
    </g>`,
  local: `<g fill="none" stroke="${MOSTAZA}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round">
      <path d="M140 380V200l160-90 160 90v180" fill="${MOSTAZA}" fill-opacity="0.16"/>
      <path d="M140 380V200l160-90 160 90v180"/>
      <path d="M110 200h380" stroke="${NARANJA}"/>
      <rect x="255" y="270" width="90" height="110" rx="8" fill="${MOSTAZA}" fill-opacity="0.3"/>
      <rect x="255" y="270" width="90" height="110" rx="8"/>
      <rect x="175" y="240" width="55" height="55" rx="8"/>
      <rect x="370" y="240" width="55" height="55" rx="8"/>
    </g>`,
};

/* Catálogo (nombre de archivo → { nombre, categoria }) */
const PRODUCTOS = [
  { archivo: 'chambe-clasica', nombre: 'Chambe Clásica', categoria: 'hamburguesas' },
  { archivo: 'chambe-doble', nombre: 'Chambe Doble', categoria: 'hamburguesas' },
  { archivo: 'chambe-chorizo', nombre: 'Chambe con Chorizo', categoria: 'hamburguesas' },
  { archivo: 'chambe-champinones', nombre: 'Chambe Champiñones', categoria: 'hamburguesas' },
  { archivo: 'completo-chambe', nombre: 'Completo Chambe', categoria: 'completos' },
  { archivo: 'completo-italiano', nombre: 'Completo Italiano', categoria: 'completos' },
  { archivo: 'papas-fritas', nombre: 'Papas Fritas', categoria: 'papas' },
  { archivo: 'papas-chorizo', nombre: 'Papas con Chorizo', categoria: 'papas' },
  { archivo: 'papas-chambre', nombre: 'Papas al estilo Chambe', categoria: 'papas' },
  { archivo: 'chorrillana', nombre: 'Chorrillana', categoria: 'chorros' },
  { archivo: 'chorrillana-completa', nombre: 'Chorrillana Completa', categoria: 'chorros' },
  { archivo: 'cafe', nombre: 'Café', categoria: 'cafeteria' },
  { archivo: 'cappuccino', nombre: 'Cappuccino', categoria: 'cafeteria' },
  { archivo: 'bebida', nombre: 'Bebida', categoria: 'cafeteria' },
];

/* Función auxiliar: escapa XML */
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Genera el SVG de un placeholder.
 * @param {{nombre:string, categoria:string, icono?:string, sub?:string}} opts
 */
function svgPlaceholder({ nombre, categoria, icono, sub }) {
  const svgIcono = icono || ICONOS[categoria] || ICONOS.hamburguesas;
  const subtitulo = sub || categoria.toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${FONDO_1}"/>
      <stop offset="100%" stop-color="${FONDO_2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="50%">
      <stop offset="0%" stop-color="${MOSTAZA}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${MOSTAZA}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="900" fill="url(#bg)"/>
  <rect width="1200" height="900" fill="url(#grid)"/>
  <rect width="1200" height="900" fill="url(#glow)"/>

  <!-- Icono central -->
  <g transform="translate(400,120) scale(1.0)">${svgIcono}</g>

  <!-- Nombre -->
  <text x="600" y="660" font-size="62" font-weight="800" text-anchor="middle"
        font-family="Segoe UI, Arial, sans-serif" fill="#ffffff">${esc(nombre)}</text>

  <!-- Subtítulo -->
  <text x="600" y="722" font-size="28" font-weight="700" text-anchor="middle"
        letter-spacing="6" font-family="Segoe UI, Arial, sans-serif"
        fill="${MOSTAZA}">${esc(subtitulo)}</text>

  <!-- Franja inferior -->
  <rect x="0" y="880" width="1200" height="20" fill="${MOSTAZA}"/>
  <rect x="700" y="880" width="500" height="20" fill="${NARANJA}"/>

  <!-- Marco -->
  <rect x="24" y="24" width="1152" height="852" fill="none" stroke="${MOSTAZA}"
        stroke-opacity="0.28" stroke-width="3" rx="28"/>
</svg>`;
}

/**
 * Genera el SVG del logo (formato vertical/redondo).
 */
function svgLogo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="l" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${MOSTAZA}"/>
      <stop offset="100%" stop-color="${NARANJA}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" rx="140" fill="${FONDO_2}"/>
  <circle cx="300" cy="300" r="220" fill="none" stroke="url(#l)" stroke-width="14"/>
  <text x="300" y="270" font-size="150" font-weight="900" text-anchor="middle"
        font-family="Arial Black, Segoe UI, sans-serif" fill="url(#l)">EB</text>
  <text x="300" y="370" font-size="52" font-weight="900" text-anchor="middle"
        letter-spacing="3" font-family="Arial Black, Segoe UI, sans-serif" fill="#ffffff">CHAMBE</text>
</svg>`;
}

/**
 * Genera el favicon.
 */
function svgFavicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${FONDO_2}"/>
  <circle cx="256" cy="256" r="200" fill="none" stroke="${MOSTAZA}" stroke-width="20"/>
  <text x="256" y="320" font-size="170" font-weight="900" text-anchor="middle"
        font-family="Arial Black, Segoe UI, sans-serif" fill="${MOSTAZA}">EB</text>
</svg>`;
}

/**
 * Genera la imagen OG (portada para redes).
 */
function svgOgCover() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${FONDO_1}"/>
      <stop offset="100%" stop-color="${FONDO_2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="0%" r="70%">
      <stop offset="0%" stop-color="${MOSTAZA}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${MOSTAZA}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <text x="600" y="230" font-size="64" font-weight="800" text-anchor="middle"
        letter-spacing="8" font-family="Segoe UI, Arial, sans-serif"
        fill="${MOSTAZA}">EL BAJÓN</text>
  <text x="600" y="360" font-size="120" font-weight="900" text-anchor="middle"
        font-family="Arial Black, Segoe UI, sans-serif" fill="#ffffff">DEL CHAMBE</text>
  <text x="600" y="450" font-size="34" font-weight="600" text-anchor="middle"
        font-family="Segoe UI, Arial, sans-serif" fill="#a1a1aa">Comida rápida · Santiago</text>
  <rect x="520" y="510" width="160" height="8" rx="4" fill="${MOSTAZA}"/>
</svg>`;
}

/* --------------------------------------------------------------------------
   Genera todo
   -------------------------------------------------------------------------- */

async function main() {
  await mkdir(DIR_PROD, { recursive: true });

  const tareas = [];

  // Productos
  for (const p of PRODUCTOS) {
    const svg = svgPlaceholder(p);
    tareas.push(
      sharp(Buffer.from(svg))
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(path.join(DIR_PROD, `${p.archivo}.jpg`))
    );
  }

  // Placeholder genérico
  tareas.push(
    sharp(
      Buffer.from(
        svgPlaceholder({ nombre: 'El Bajón del Chambe', categoria: 'hamburguesas', icono: ICONOS.hamburguesas, sub: 'COMIDA RÁPIDA' })
      )
    )
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(DIR_IMG, 'placeholder.jpg'))
  );

  // Hero (vertical 4:5)
  tareas.push(
    sharp(
      Buffer.from(
        svgPlaceholder({ nombre: 'El Bajón del Chambe', categoria: 'hamburguesas', icono: ICONOS.hamburguesas, sub: 'HECHO AL MOMENTO' })
      )
    )
      .resize(1000, 1250, { fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(DIR_IMG, 'hero.jpg'))
  );

  // Local (4:3)
  tareas.push(
    sharp(
      Buffer.from(
        svgPlaceholder({ nombre: 'Nuestro Local', categoria: 'cafeteria', icono: ICONOS.local, sub: 'AV. CORONEL A. SEPÚLVEDA' })
      )
    )
    .resize(1200, 900, { fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(DIR_IMG, 'local.jpg'))
  );

  // Logo
  tareas.push(
    sharp(Buffer.from(svgLogo()))
      .png()
      .toFile(path.join(DIR_IMG, 'logo.png'))
  );

  // Favicon
  tareas.push(
    sharp(Buffer.from(svgFavicon()))
      .resize(512, 512)
      .png()
      .toFile(path.join(DIR_IMG, 'favicon.png'))
  );

  // OG cover
  tareas.push(
    sharp(Buffer.from(svgOgCover()))
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(path.join(DIR_IMG, 'og-cover.jpg'))
  );

  await Promise.all(tareas);

  console.log(`✓ ${PRODUCTOS.length + 5} imágenes generadas en assets/img/`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
