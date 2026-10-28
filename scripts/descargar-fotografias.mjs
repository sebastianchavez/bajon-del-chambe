import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Fotografías de referencia; autorías y licencias en assets/img/CREDITOS.md.
// Descarga explícita: no se ejecuta durante el build ni depende de un CDN en producción.
const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=85`;
const fotos = [
  [unsplash('photo-1568901346375-23c9450c58cd'), ['hero.jpg', 'productos/chambe-clasica.jpg', 'placeholder.jpg', 'og-cover.jpg']],
  [unsplash('photo-1550547660-d9450f859349'), ['productos/chambe-doble.jpg']],
  [unsplash('photo-1561758033-d89a9ad46330'), ['productos/chambe-chorizo.jpg']],
  [unsplash('photo-1571091718767-18b5b1457add'), ['productos/chambe-champinones.jpg']],
  ['https://upload.wikimedia.org/wikipedia/commons/e/e0/Completo_italiano.jpg', ['productos/completo-italiano.jpg', 'productos/completo-chambe.jpg']],
  [unsplash('photo-1573080496219-bb080dd4f877'), ['productos/papas-fritas.jpg']],
  ['https://upload.wikimedia.org/wikipedia/commons/7/70/Chorrillana_del_J_Cruz.jpg', ['productos/chorrillana.jpg', 'productos/chorrillana-completa.jpg', 'productos/papas-chorizo.jpg', 'productos/papas-chambre.jpg', 'local.jpg']],
  [unsplash('photo-1510707577719-ae7c14805e3a'), ['productos/cafe.jpg']],
  [unsplash('photo-1572442388796-11668a67e53d'), ['productos/cappuccino.jpg']],
  [unsplash('photo-1622483767028-3f66f32aef97'), ['productos/bebida.jpg']],
];

for (const [url, destinos] of fotos) {
  const respuesta = await fetch(url, { headers: { 'User-Agent': 'ChambeWebsite/1.0 (reference food photography)' } });
  if (!respuesta.ok) throw new Error(`Descarga fallida: ${respuesta.status} ${url}`);
  const original = Buffer.from(await respuesta.arrayBuffer());
  for (const destino of destinos) {
    const ancho = destino === 'og-cover.jpg' ? 1200 : destino === 'hero.jpg' ? 1100 : 900;
    const foto = await sharp(original).rotate().resize({ width: ancho, withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
    await writeFile(new URL(`../assets/img/${destino}`, import.meta.url), foto);
    console.log(`${destino}: ${Math.round(foto.length / 1024)} KB`);
  }
}
