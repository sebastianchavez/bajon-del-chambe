/* ==========================================================================
   Página de contacto — horarios, redes y estado abierto/cerrado
   ========================================================================== */

import { NEGOCIO } from './config.js';

/* --------------------------------------------------------------------------
   Horarios
   -------------------------------------------------------------------------- */

function renderHorarios() {
  const lista = document.getElementById('lista-horarios');
  if (!lista) return;

  lista.innerHTML = NEGOCIO.horarios
    .map(
      (h) => `
      <li class="flex items-center justify-between gap-4 border-b border-ink-800 pb-3 last:border-0 last:pb-0">
        <span class="text-sm text-zinc-300">${h.dia}</span>
        <span class="whitespace-nowrap font-display text-sm uppercase text-brand-400">${h.hora}</span>
      </li>`
    )
    .join('');
}

/* --------------------------------------------------------------------------
   Redes sociales
   -------------------------------------------------------------------------- */

function renderRedes() {
  const cont = document.getElementById('lista-redes');
  if (!cont) return;

  const redes = [
    {
      nombre: 'Instagram',
      url: NEGOCIO.instagramUrl,
      usuario: `@${NEGOCIO.instagram}`,
      color: 'hover:border-pink-500 hover:text-pink-400',
    },
    {
      nombre: 'Facebook',
      url: NEGOCIO.facebookUrl,
      usuario: NEGOCIO.facebook ? `@${NEGOCIO.facebook}` : '',
      color: 'hover:border-blue-500 hover:text-blue-400',
    },
    {
      nombre: 'TikTok',
      url: NEGOCIO.tiktokUrl,
      usuario: NEGOCIO.tiktok ? `@${NEGOCIO.tiktok}` : '',
      color: 'hover:border-cyan-400 hover:text-cyan-300',
    },
  ].filter((r) => r.url);

  if (!redes.length) {
    cont.innerHTML = `<p class="text-sm text-zinc-500">Próximamente.</p>`;
    return;
  }

  cont.innerHTML = redes
    .map(
      (r) => `
      <a href="${r.url}" target="_blank" rel="noopener noreferrer"
         class="inline-flex items-center gap-2.5 rounded-full border border-ink-700 bg-ink-950 px-5 py-3 font-semibold transition ${r.color}">
        <span class="h-5 w-5 shrink-0">
          ${
            r.nombre === 'Instagram'
              ? `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-full h-full"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`
              : r.nombre === 'Facebook'
                ? `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-full h-full"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
                : `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-full h-full"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`
          }
        </span>
        <span>${r.nombre}${r.usuario ? ` · ${r.usuario}` : ''}</span>
      </a>`
    )
    .join('');
}

/* --------------------------------------------------------------------------
   Estado abierto / cerrado
   --------------------------------------------------------------------------
   Los horarios en NEGOCIO.horarios usan el formato "11:00 – 22:00".
   El cálculo es una aproximación por día de la semana (0 = domingo).
   -------------------------------------------------------------------------- */

function parseHora(h) {
  const m = String(h).match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

/** Devuelve true si la hora actual está dentro del rango del día */
function estaAbiertoAhora(horario, diaSemana) {
  if (!horario) return false;
  const rango = horario.toLowerCase();

  // Detecta el día al que aplica el bloque
  let aplica = false;
  if (rango.includes('lunes') && rango.includes('jueves')) {
    aplica = diaSemana >= 1 && diaSemana <= 4;
  } else if (rango.includes('lunes') && rango.includes('viernes')) {
    aplica = diaSemana >= 1 && diaSemana <= 5;
  } else if (rango.includes('sábado')) {
    aplica = diaSemana === 6;
  } else if (rango.includes('domingo')) {
    aplica = diaSemana === 0;
  } else {
    // Bloque de un solo día
    const dia = horario.split(' ')[0].toLowerCase();
    const mapa = {
      lunes: 1, martes: 2, 'miércoles': 3, miercoles: 3,
      jueves: 4, viernes: 5, sábado: 6, sabado: 6, domingo: 0,
    };
    aplica = mapa[dia] === diaSemana;
  }

  if (!aplica) return false;

  const [ini, fin] = horario.split('–').map((s) => s.trim());
  const desde = parseHora(ini);
  const hasta = parseHora(fin);
  if (desde === null || hasta === null) return false;

  const ahora = new Date();
  const minutos = ahora.getHours() * 60 + ahora.getMinutes();

  // Si el cierre es menor que la apertura, el bloque cruza la medianoche
  return hasta > desde
    ? minutos >= desde && minutos <= hasta
    : minutos >= desde || minutos <= hasta;
}

function actualizarEstado() {
  const p = document.querySelector('#estado-horario');
  if (!p) return;

  const ahora = new Date();
  const diaSemana = ahora.getDay();
  const abierto = NEGOCIO.horarios.some((h) => estaAbiertoAhora(h.hora, diaSemana));

  p.innerHTML = abierto
    ? `<span class="h-2 w-2 animate-pulse rounded-full bg-[#25d366]"></span>
       <span class="font-semibold text-[#25d366]">Abierto ahora</span>
       <span class="text-zinc-500">· We're OPEN</span>`
    : `<span class="h-2 w-2 rounded-full bg-zinc-600"></span>
       <span class="font-semibold text-zinc-400">Cerrado ahora</span>
       <span class="text-zinc-500">· We're CLOSED</span>`;
}

/* --------------------------------------------------------------------------
   Mapa
   -------------------------------------------------------------------------- */

function renderMapa() {
  const iframe = document.querySelector('#mapa');
  if (iframe && NEGOCIO.googleMapsEmbed) {
    iframe.src = NEGOCIO.googleMapsEmbed;
  }
}

/* --------------------------------------------------------------------------
   Init
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  renderHorarios();
  renderRedes();
  renderMapa();
  actualizarEstado();
  setInterval(actualizarEstado, 60000);
});
