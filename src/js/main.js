/* ==========================================================================
   EL BAJÓN DEL CHAMBE — Lógica del sitio
   ========================================================================== */

import {
  NEGOCIO,
  CATEGORIAS,
  PRODUCTOS,
  formatearPrecio,
  linkWhatsapp,
  mensajePedido,
  mensajeGeneral,
} from './config.js';
import { revelar, initMovimiento } from './motion.js';

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/** Escapa texto para inserción segura en HTML */
function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Capitaliza la primera letra */
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

/** Nombre legible de una categoría a partir de su id */
function nombreCategoria(id) {
  const c = CATEGORIAS.find((x) => x.id === id);
  return c ? c.nombre : cap(id);
}

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
  instagram: svg(
    `<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>`
  ),
  facebook: svg(
    `<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>`
  ),
  tiktok: svg(
    `<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>`
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
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true" class="h-full w-full"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  cerrar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true" class="h-full w-full"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  estrella: svg(
    `<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>`
  ),
};

/* --------------------------------------------------------------------------
   Render: header y footer (compartidos por todas las páginas)
   -------------------------------------------------------------------------- */

function iconRed(nombre, url, extraClases = '') {
  if (!url) return '';
  // `nombre` es el nombre visible ("Instagram"); la clave del icono va en minúsculas.
  const clave = nombre.toLowerCase();
  return `
    <a href="${esc(url)}" target="_blank" rel="noopener noreferrer"
       class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-700 bg-ink-900 text-zinc-300 transition hover:border-brand-500 hover:text-brand-400 ${extraClases}"
       aria-label="${esc(nombre)}">
      <span class="block h-5 w-5 shrink-0">${ICONOS[clave] || ''}</span>
    </a>`;
}

function renderHeader() {
  const host = $('#header');
  if (!host) return;

  const rutas = [
    { href: 'index.html', label: 'Inicio' },
    { href: 'catalogo.html', label: 'Catálogo' },
    { href: 'contacto.html', label: 'Contacto' },
  ];

  // Detecta la página actual
  const actual = window.location.pathname.split('/').pop() || 'index.html';

  host.innerHTML = `
    <div class="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

      <!-- Logo -->
      <a href="index.html" class="group flex shrink-0 items-center gap-3" aria-label="El Bajón del Chambe — Inicio">
        <img src="assets/img/logo-chambe-ilustrado.webp" alt="El Bajón del Chambe" width="64" height="64"
             class="h-16 w-16 shrink-0 object-contain transition group-hover:scale-105" />
        <span class="hidden leading-none sm:block">
          <span class="block font-display text-lg text-white uppercase">El Bajón</span>
          <span class="block font-display text-lg text-brand-500 uppercase">del Chambe</span>
        </span>
      </a>

      <!-- Nav desktop -->
      <nav class="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
        ${rutas
          .map(
            (r) =>
              `<a href="${r.href}" class="nav-link text-sm" ${
                actual === r.href ? 'aria-current="page"' : ''
              }>${r.label}</a>`
          )
          .join('')}
      </nav>

      <!-- Acciones -->
      <div class="flex items-center gap-2 sm:gap-3">
        <a href="${esc(linkWhatsapp(mensajeGeneral()))}" target="_blank" rel="noopener noreferrer"
           class="btn-whatsapp !px-4 !py-2.5 text-sm sm:!px-6 sm:!py-3">
          <span class="block h-5 w-5 shrink-0">${ICONOS.whatsapp}</span>
          <span class="hidden sm:inline">Pedir ahora</span>
          <span class="sm:hidden">Pedir</span>
        </a>

        <!-- Botón menú móvil -->
        <button type="button" id="btn-menu"
                class="flex h-11 w-11 items-center justify-center rounded-xl border border-ink-700 bg-ink-900 text-zinc-200 transition hover:border-brand-500 md:hidden"
                aria-label="Abrir menú" aria-expanded="false" aria-controls="menu-movil">
          <span class="h-6 w-6" id="icono-menu">${ICONOS.menu}</span>
        </button>
      </div>
    </div>

    <!-- Menú móvil -->
    <div id="menu-movil" class="hidden border-t border-ink-800 bg-ink-950 md:hidden">
      <nav class="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Navegación móvil">
        ${rutas
          .map(
            (r) =>
              `<a href="${r.href}" class="rounded-lg px-4 py-3 font-semibold transition hover:bg-ink-900 hover:text-brand-400 ${
                actual === r.href ? 'bg-ink-900 text-brand-400' : 'text-zinc-300'
              }">${r.label}</a>`
          )
          .join('')}
        <a href="tel:${esc(NEGOCIO.telefono)}"
           class="mt-2 flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-zinc-300 transition hover:bg-ink-900 hover:text-brand-400">
          <span class="block h-5 w-5 shrink-0">${ICONOS.telefono}</span>
          ${esc(NEGOCIO.telefonoLegible)}
        </a>
      </nav>
    </div>
  `;

  // Toggle menú móvil
  const btn = $('#btn-menu');
  const menu = $('#menu-movil');
  const icono = $('#icono-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const abierto = menu.classList.toggle('hidden') === false;
      btn.setAttribute('aria-expanded', String(abierto));
      btn.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      icono.innerHTML = abierto ? ICONOS.cerrar : ICONOS.menu;
    });
  }
}

function renderFooter() {
  const host = $('#footer');
  if (!host) return;

  const redes = [
    { id: 'instagram', nombre: 'Instagram', url: NEGOCIO.instagramUrl },
    { id: 'facebook', nombre: 'Facebook', url: NEGOCIO.facebookUrl },
    { id: 'tiktok', nombre: 'TikTok', url: NEGOCIO.tiktokUrl },
  ].filter((r) => r.url);

  host.innerHTML = `
    <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

        <!-- Marca -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3">
            <img src="assets/img/logo-chambe-ilustrado.webp" alt="Logo ilustrado de El Bajón del Chambe" width="80" height="80"
                 loading="lazy" decoding="async" class="h-20 w-20 shrink-0 object-contain" />
            <span class="leading-none">
              <span class="block font-display text-lg text-white uppercase">El Bajón</span>
              <span class="block font-display text-lg text-brand-500 uppercase">del Chambe</span>
            </span>
          </div>
          <p class="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
            ${esc(NEGOCIO.descripcion)}
          </p>
          ${
            redes.length
              ? `<div class="mt-5 flex gap-2">${redes
                  .map((r) => iconRed(r.nombre, r.url))
                  .join('')}</div>`
              : ''
          }
        </div>

        <!-- Navegación -->
        <div>
          <h2 class="font-display text-base uppercase text-white">Navegación</h2>
          <ul class="mt-4 space-y-2.5 text-sm">
            <li><a href="index.html" class="text-zinc-400 transition hover:text-brand-400">Inicio</a></li>
            <li><a href="catalogo.html" class="text-zinc-400 transition hover:text-brand-400">Catálogo</a></li>
            <li><a href="contacto.html" class="text-zinc-400 transition hover:text-brand-400">Contacto y ubicación</a></li>
            <li><a href="${esc(linkWhatsapp(mensajeGeneral()))}" target="_blank" rel="noopener noreferrer" class="text-zinc-400 transition hover:text-brand-400">Hacer un pedido</a></li>
          </ul>
        </div>

        <!-- Contacto -->
        <div>
          <h2 class="font-display text-base uppercase text-white">Contacto</h2>
          <ul class="mt-4 space-y-3.5 text-sm">
            <li class="flex gap-3">
              <span class="mt-0.5 h-4 w-4 shrink-0 text-brand-500">${ICONOS.ubicacion}</span>
              <a href="${esc(NEGOCIO.googleMaps)}" target="_blank" rel="noopener noreferrer" class="text-zinc-400 transition hover:text-brand-400">
                ${esc(NEGOCIO.direccion)}<br>${esc(NEGOCIO.ciudad)}
              </a>
            </li>
            <li class="flex gap-3">
              <span class="mt-0.5 h-4 w-4 shrink-0 text-brand-500">${ICONOS.telefono}</span>
              <a href="tel:${esc(NEGOCIO.telefono)}" class="text-zinc-400 transition hover:text-brand-400">${esc(NEGOCIO.telefonoLegible)}</a>
            </li>
            <li class="flex gap-3">
              <span class="mt-0.5 h-4 w-4 shrink-0 text-brand-500">${ICONOS.whatsapp}</span>
              <a href="${esc(linkWhatsapp(mensajeGeneral()))}" target="_blank" rel="noopener noreferrer" class="text-zinc-400 transition hover:text-brand-400">WhatsApp</a>
            </li>
          </ul>
        </div>

        <!-- Horarios -->
        <div>
          <h2 class="font-display text-base uppercase text-white">Horarios</h2>
          <ul class="mt-4 space-y-2 text-sm text-zinc-400">
            ${NEGOCIO.horarios
              .map(
                (h) =>
                  `<li class="flex justify-between gap-4 border-b border-ink-800 pb-2">
                     <span>${esc(h.dia)}</span>
                     <span class="whitespace-nowrap font-semibold text-zinc-300">${esc(h.hora)}</span>
                   </li>`
              )
              .join('')}
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t border-ink-800">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:px-6 lg:px-8">
        <div><p>© ${new Date().getFullYear()} ${esc(NEGOCIO.nombre)}. Todos los derechos reservados.</p>
        <details class="photo-credits mt-3">
          <summary>Fotografías de referencia y créditos</summary>
          <p class="mt-3 max-w-xl leading-relaxed">Las fotografías ilustran las categorías del menú; no corresponden a preparaciones del local. Hamburguesas, papas y cafetería: <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash</a>.
          Completo: <a href="https://commons.wikimedia.org/wiki/File:Completo_italiano.jpg" target="_blank" rel="noopener noreferrer">Paul Lowry</a> (<a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</a>).
          Chorrillana: <a href="https://commons.wikimedia.org/wiki/File:Chorrillana_del_J_Cruz.jpg" target="_blank" rel="noopener noreferrer">Osmar Valdebenito</a> (<a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 2.0</a>). Imágenes redimensionadas y comprimidas; recorte visual para el diseño.</p>
        </details></div>
        <p>Hecho con <span class="text-brand-500">♥</span> en ${esc(NEGOCIO.ciudad.split(',')[0])}</p>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   Render: botón flotante de WhatsApp
   -------------------------------------------------------------------------- */

function renderFlotante() {
  const host = $('#whatsapp-flotante');
  if (!host) return;

  host.innerHTML = `
    <a href="${esc(linkWhatsapp(mensajeGeneral()))}" target="_blank" rel="noopener noreferrer"
       class="group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25d366] px-4 py-4 font-bold text-[#052e16] shadow-[0_10px_30px_-8px_rgb(37_211_102/0.7)] transition hover:scale-105 hover:bg-[#22c55e] sm:px-5"
       aria-label="Pedir por WhatsApp">
      <span class="block h-7 w-7 shrink-0">${ICONOS.whatsapp}</span>
      <span class="hidden text-sm leading-tight sm:block">Pedir por WhatsApp</span>
      <span class="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/40"></span>
    </a>
  `;
}

/* --------------------------------------------------------------------------
   Render: tarjeta de producto
   -------------------------------------------------------------------------- */

function tarjetaProducto(p) {
  const etiquetas = (p.etiquetas || [])
    .map((e) => `<span class="chip">${esc(e)}</span>`)
    .join('');

  return `
    <article class="card-producto group flex flex-col" data-reveal>
      <div class="relative aspect-[4/3] overflow-hidden bg-ink-800">
        <img src="${esc(p.imagen)}" alt="Fotografía de referencia: ${esc(p.nombre)}" loading="lazy" decoding="async" width="900" height="675"
             class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
             onerror="this.onerror=null;this.src='assets/img/placeholder.jpg'">
        ${
          etiquetas
            ? `<div class="absolute left-3 top-3 flex flex-wrap gap-1.5">${etiquetas}</div>`
            : ''
        }
      </div>

      <div class="flex flex-1 flex-col p-5">
        <p class="mb-2 text-[0.65rem] uppercase tracking-wider text-zinc-500">Foto referencial</p>
        <h2 class="font-display text-lg uppercase text-white">${esc(p.nombre)}</h2>
        ${
          p.descripcion
            ? `<p class="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">${esc(p.descripcion)}</p>`
            : ''
        }
        <div class="mt-4 flex items-center justify-between gap-3">
          <span class="font-display text-xl text-brand-500">${formatearPrecio(p.precio)}</span>
          <span class="rounded-full border border-ink-700 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-500">
            ${esc(nombreCategoria(p.categoria))}
          </span>
        </div>
        <a href="${esc(linkWhatsapp(mensajePedido(p)))}" target="_blank" rel="noopener noreferrer"
           class="btn-whatsapp mt-4 w-full !py-3 text-sm">
          <span class="block h-5 w-5 shrink-0">${ICONOS.whatsapp}</span>
          Pedir por WhatsApp
        </a>
      </div>
    </article>
  `;
}

/* --------------------------------------------------------------------------
   Render: grilla de productos (usada en landing y catálogo)
   -------------------------------------------------------------------------- */

function renderProductosGrid(host, productos, columnas = 'sm:grid-cols-2 lg:grid-cols-3') {
  if (!host) return;
  if (!productos.length) {
    host.innerHTML = `<p class="col-span-full py-12 text-center text-zinc-500">No hay productos en esta categoría.</p>`;
    return;
  }
  host.innerHTML = `
    <div class="grid grid-cols-1 gap-6 ${columnas}">
      ${productos.map(tarjetaProducto).join('')}
    </div>
  `;
  revelar(host);
}

/* --------------------------------------------------------------------------
   Catálogo: filtros por categoría
   -------------------------------------------------------------------------- */

function initCatalogo() {
  const tabs = $('#tabs-categoria');
  const grid = $('#grid-productos');
  const contador = $('#contador-productos');
  if (!tabs || !grid) return;

  const todos = [{ id: 'todos', nombre: 'Todos', icono: '✨' }, ...CATEGORIAS];

  tabs.innerHTML = todos
    .map(
      (c, i) => `
      <button type="button" data-cat="${esc(c.id)}"
        class="cat-tab shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
          i === 0
            ? 'border-brand-500 bg-brand-500 text-ink-950'
            : 'border-ink-700 bg-ink-900 text-zinc-300 hover:border-brand-500 hover:text-brand-400'
        }">
        <span class="mr-1">${c.icono}</span>${esc(c.nombre)}
      </button>`
    )
    .join('');

  function aplicar(catId) {
    const lista =
      catId === 'todos'
        ? PRODUCTOS
        : PRODUCTOS.filter((p) => p.categoria === catId);

    renderProductosGrid(grid, lista);
    if (contador) {
      contador.textContent = `${lista.length} ${
        lista.length === 1 ? 'producto' : 'productos'
      }`;
    }

    $$('.cat-tab', tabs).forEach((b) => {
      const activo = b.dataset.cat === catId;
      b.setAttribute('aria-pressed', String(activo));
      b.className =
        'cat-tab shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition ' +
        (activo
          ? 'border-brand-500 bg-brand-500 text-ink-950'
          : 'border-ink-700 bg-ink-900 text-zinc-300 hover:border-brand-500 hover:text-brand-400');
    });

    // Actualiza el query string sin recargar
    const url = new URL(window.location.href);
    if (catId === 'todos') url.searchParams.delete('categoria');
    else url.searchParams.set('categoria', catId);
    history.replaceState({}, '', url);
  }

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-tab');
    if (btn) aplicar(btn.dataset.cat);
  });

  // Categoría inicial desde ?categoria=
  const inicial = new URLSearchParams(window.location.search).get('categoria');
  aplicar(inicial && CATEGORIAS.some((c) => c.id === inicial) ? inicial : 'todos');
}

/* --------------------------------------------------------------------------
   Inicio: productos destacados
   -------------------------------------------------------------------------- */

function initDestacados() {
  const grid = $('#grid-destacados');
  if (!grid) return;
  const destacados = PRODUCTOS.filter((p) => p.destacado);
  renderProductosGrid(grid, destacados, 'sm:grid-cols-2 lg:grid-cols-3');
}

/* --------------------------------------------------------------------------
   Smooth scroll + offset para header fijo
   -------------------------------------------------------------------------- */

function initScrollSuave() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   Init
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  renderFlotante();
  initDestacados();
  initCatalogo();
  initScrollSuave();
  requestAnimationFrame(initMovimiento);
});
