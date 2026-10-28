/* ==========================================================================
   EL BAJÓN DEL CHAMBE — Configuración central
   --------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas editar para actualizar la web.
   Cambia los valores aquí y el sitio se actualiza solo.

   - NEGOCIO     → datos de contacto, horarios, redes
   - CATEGORIAS  → categorías del menú (agregar/quitar)
   - PRODUCTOS   → productos del catálogo (agregar/quitar)
   ========================================================================== */

export const NEGOCIO = {
  nombre: 'El Bajón del Chambe',
  Claim: 'El bajón del chambe',
  slogan: 'Comida rápida que te llena el alma',
  descripcion:
    'Hamburguesas, papas fritas, chorrillanas y café. Hecho al momento, para llevar o retirar en el local.',

  // Teléfono / WhatsApp (formato internacional, solo números, con 56)
  telefono: '+56926046878',
  telefonoWhatsapp: '56926046878',
  telefonoLegible: '+56 9 2604 6878',

  direccion: 'Av. Coronel Alejandro Sepúlveda #7218',
  ciudad: 'Santiago, Chile',

  // Link directo a Google Maps (puedes reemplazarlo por el link de Maps de tu local)
  googleMaps:
    'https://www.google.com/maps/search/?api=1&query=Av.+Coronel+Alejandro+Sepulveda+7218+Santiago+Chile',
  googleMapsEmbed:
    'https://www.google.com/maps?q=Av.%20Coronel%20Alejandro%20Sep%C3%BAlveda%207218%2C%20Santiago%2C%20Chile&output=embed',

  instagram: 'elbajondelchambe_',
  instagramUrl: 'https://instagram.com/elbajondelchambe_',
  facebook: '',
  facebookUrl: '',
  tiktok: '',
  tiktokUrl: '',

  email: '',

  horarios: [
    { dia: 'Lunes a Jueves', hora: '11:00 – 22:00' },
    { dia: 'Viernes', hora: '11:00 – 23:00' },
    { dia: 'Sábado', hora: '12:00 – 23:00' },
    { dia: 'Domingo', hora: '12:00 – 21:00' },
  ],

  // Opciones de pedido
  delivery: true,
  retiro: true,
  deliveryMinimo: 3000,
};

/* ==========================================================================
   CATEGORÍAS DEL MENÚ
   --------------------------------------------------------------------------
   El "id" debe coincidir con el "categoria" de cada producto.
   ========================================================================== */

export const CATEGORIAS = [
  { id: 'hamburguesas', nombre: 'Hamburguesas', icono: '🍔' },
  { id: 'completos', nombre: 'Completos', icono: '🥪' },
  { id: 'papas', nombre: 'Papas & Acompañados', icono: '🍟' },
  { id: 'chorros', nombre: 'Chorrillanas', icono: '🌭' },
  { id: 'cafeteria', nombre: 'Cafetería', icono: '☕' },
];

/* ==========================================================================
   PRODUCTOS
   --------------------------------------------------------------------------
   - nombre:      Nombre del producto
   - descripcion: Texto corto (opcional)
   - precio:      Número en pesos chilenos (sin $ ni puntos)
   - imagen:      Ruta a la imagen dentro de /assets/img/
   - categoria:   id de la categoría
   - destacado:   true para que aparezca en la landing page
   - etiquetas:   Chips opcionales (ej: 'Nuevo', 'Más pedido', 'Vegetariano')
   ========================================================================== */

export const PRODUCTOS = [
  {
    id: 'chambe-clasica',
    nombre: 'Chambe Clásica',
    descripcion:
      'Carne de res 150g, queso cheddar, lechuga, tomate y nuestra salsa especial.',
    precio: 4990,
    imagen: 'assets/img/productos/chambe-clasica.jpg',
    categoria: 'hamburguesas',
    destacado: true,
    etiquetas: ['Más pedido'],
  },
  {
    id: 'chambe-doble',
    nombre: 'Chambe Doble',
    descripcion:
      'Doble carne de res, doble queso, cebolla caramelizada y tocino.',
    precio: 6990,
    imagen: 'assets/img/productos/chambe-doble.jpg',
    categoria: 'hamburguesas',
    destacado: true,
    etiquetas: ['Premium'],
  },
  {
    id: 'chambe-chorizo',
    nombre: 'Chambe con Chorizo',
    descripcion:
      'Carne de res con chorizo artesanal, queso y ají rojo en su punto.',
    precio: 5990,
    imagen: 'assets/img/productos/chambe-chorizo.jpg',
    categoria: 'hamburguesas',
    destacado: false,
    etiquetas: [],
  },
  {
    id: 'chambe-champinones',
    nombre: 'Chambe Champiñones',
    descripcion:
      'Carne de res, queso mantecoso, champiñones salteados y salsa de la casa.',
    precio: 5690,
    imagen: 'assets/img/productos/chambe-champinones.jpg',
    categoria: 'hamburguesas',
    destacado: false,
    etiquetas: [],
  },
  {
    id: 'completo-chambe',
    nombre: 'Completo Chambe',
    descripcion:
      'Completo con ingredientes de la casa, papas y palta a elección.',
    precio: 3990,
    imagen: 'assets/img/productos/completo-chambe.jpg',
    categoria: 'completos',
    destacado: true,
    etiquetas: [],
  },
  {
    id: 'completo-italiano',
    nombre: 'Completo Italiano',
    descripcion: 'Salami, palta, tomate, mayo y ají de la casa.',
    precio: 3490,
    imagen: 'assets/img/productos/completo-italiano.jpg',
    categoria: 'completos',
    destacado: false,
    etiquetas: [],
  },
  {
    id: 'papas-fritas',
    nombre: 'Papas Fritas',
    descripcion: 'Porción de papas fritas crujientes con sal de mar.',
    precio: 2490,
    imagen: 'assets/img/productos/papas-fritas.jpg',
    categoria: 'papas',
    destacado: true,
    etiquetas: [],
  },
  {
    id: 'papas-chorizo',
    nombre: 'Papas con Chorizo',
    descripcion: 'Papas fritas, chorizo, queso cheddar y cebollita.',
    precio: 3990,
    imagen: 'assets/img/productos/papas-chorizo.jpg',
    categoria: 'papas',
    destacado: false,
    etiquetas: [],
  },
  {
    id: 'papas-chambre',
    nombre: 'Papas al estilo Chambe',
    descripcion:
      'Papas fritas, carne Mechada, palta, crema y un toque de ají.',
    precio: 4290,
    imagen: 'assets/img/productos/papas-chambre.jpg',
    categoria: 'papas',
    destacado: false,
    etiquetas: ['Favorito'],
  },
  {
    id: 'chorrillana',
    nombre: 'Chorrillana',
    descripcion:
      'Salchicha artesanal en pan con palta, tomate, mayo y salame.',
    precio: 2990,
    imagen: 'assets/img/productos/chorrillana.jpg',
    categoria: 'chorros',
    destacado: true,
    etiquetas: [],
  },
  {
    id: 'chorrillana-completa',
    nombre: 'Chorrillana Completa',
    descripcion:
      'Chorrillana con toppings de la casa, queso y papas fritas.',
    precio: 4290,
    imagen: 'assets/img/productos/chorrillana-completa.jpg',
    categoria: 'chorros',
    destacado: false,
    etiquetas: [],
  },
  {
    id: 'cafe',
    nombre: 'Café',
    descripcion: 'Café espresso de tueste medio, servido con agua caliente.',
    precio: 1490,
    imagen: 'assets/img/productos/cafe.jpg',
    categoria: 'cafeteria',
    destacado: false,
    etiquetas: [],
  },
  {
    id: 'cappuccino',
    nombre: 'Cappuccino',
    descripcion: 'Espresso con leche vaporizada y espuma cremosa.',
    precio: 2190,
    imagen: 'assets/img/productos/cappuccino.jpg',
    categoria: 'cafeteria',
    destacado: false,
    etiquetas: [],
  },
  {
    id: 'bebida',
    nombre: 'Bebida',
    descripcion: 'Gaseosa, jugo o agua mineral. Pregunta por los sabores del día.',
    precio: 1290,
    imagen: 'assets/img/productos/bebida.jpg',
    categoria: 'cafeteria',
    destacado: false,
    etiquetas: [],
  },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

export const formatearPrecio = (precio) =>
  '$' + precio.toLocaleString('es-CL', { maximumFractionDigits: 0 });

export const linkWhatsapp = (mensaje) =>
  `https://wa.me/${NEGOCIO.telefonoWhatsapp}?text=${encodeURIComponent(mensaje)}`;

export const mensajePedido = (producto) =>
  `¡Hola ${NEGOCIO.nombre}! 👋 Quiero pedir:\n\n` +
  `• ${producto.nombre}${producto.precio ? ` — ${formatearPrecio(producto.precio)}` : ''}\n\n` +
  `¿Me confirmas disponibilidad y tiempo de entrega?`;

export const mensajeGeneral = () =>
  `¡Hola ${NEGOCIO.nombre}! 👋 Quiero hacer un pedido.`;
