/* ==========================================================================
   Iconos inline + inicialización de la landing page
   --------------------------------------------------------------------------
   - Inyecta los SVG en los elementos con [data-icon]
   - Renderiza la grilla de categorías
   - Conecta los botones [data-wa-general] al WhatsApp real
   ========================================================================== */

import { NEGOCIO, CATEGORIAS, PRODUCTOS, formatearPrecio, linkWhatsapp, mensajeGeneral } from './config.js';

/* --------------------------------------------------------------------------
   Iconos SVG (inline, sin dependencias)
   --------------------------------------------------------------------------
   Nota: NO se aplica `class="w-full h-full"` en el SVG. El tamaño lo controla
   el elemento contenedor, de modo que el SVG se escala con él.
   -------------------------------------------------------------------------- */

const svg = (paths, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" ${extra} class="h-full w-full">${paths}</svg>`;

const ICONOS = {
  whatsapp: svg(
    `<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.549 4.142 1.595 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.465 3.488"/>`
  ),
  telefono: svg(
    `<path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a.996.996 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1A17.01 17.01 0 0 1 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>`
  ),
  ubicacion: svg(
    `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>`
  ),
  reloj: svg(
    `<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>`
  ),
  delivery: svg(
    `<path d="M18 6h-2V4c0-1.1-.9-2-2-2H8C6.9 2 6 2.9 6 4v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-2h2l3-4v-2l-3-2zM8 4h8v12H8V4zm8 16H8v-2h8v2zm6.5-6.5-.5 1h-2v-4h2.5l1.5 2-.5 1zM4 6H2v14c0 1.1.9 2 2 2h1v-2H4V6zm10 5.5c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5z"/>`
  ),
  retiro: svg(
    `<path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1 1.24L13.5 8H20v6z"/>`
  ),
  flecha: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-full w-full"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  estrella: svg(
    `<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>`
  ),
};

/* --------------------------------------------------------------------------
   Inyecta iconos
   -------------------------------------------------------------------------- */

function inyectarIconos() {
  document.querySelectorAll('[data-icon]').forEach((el) => {
    const svg = ICONOS[el.dataset.icon];
    if (svg) el.innerHTML = svg;
  });
}

/* --------------------------------------------------------------------------
   Botones de WhatsApp general
   -------------------------------------------------------------------------- */

function conectarWhatsapp() {
  const href = linkWhatsapp(mensajeGeneral());
  document.querySelectorAll('[data-wa-general]').forEach((a) => {
    a.href = href;
  });
}

/* --------------------------------------------------------------------------
   Grilla de categorías
   -------------------------------------------------------------------------- */

function renderCategorias() {
  const grid = document.getElementById('grid-categorias');
  if (!grid) return;

  grid.innerHTML = CATEGORIAS.map((c) => {
    const productos = PRODUCTOS.filter((p) => p.categoria === c.id);
    const desde = productos.length
      ? Math.min(...productos.map((p) => p.precio))
      : null;

    return `
      <a href="catalogo.html?categoria=${encodeURIComponent(c.id)}"
         class="category-photo group relative flex flex-col items-center overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 p-6 text-center transition hover:-translate-y-1 hover:border-brand-600 hover:bg-ink-800" data-reveal>
        ${productos.length ? `<img src="${productos[0].imagen}" alt="" loading="lazy" decoding="async" width="450" height="600" class="category-background" />` : ''}
        <span class="relative text-3xl transition duration-300 group-hover:scale-110" aria-hidden="true">${c.icono}</span>
        <h3 class="mt-4 font-display text-base uppercase text-white">${c.nombre}</h3>
        ${
          desde
            ? `<p class="mt-1.5 text-xs text-zinc-500">desde ${formatearPrecio(desde)}</p>`
            : ''
        }
      </a>
    `;
  }).join('');
}

/* --------------------------------------------------------------------------
   Init
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  inyectarIconos();
  conectarWhatsapp();
  renderCategorias();
});
