panel de administracion 
poner una tabla de promociones y tiener sus propias reglas(listo)
poner un campo de precios de descuento %(listo)

hacer en la base de datos  una tabla de promociones y descuentos de precios y hacer una api que tenga todos sus crud   (listo)

ACOMODAR 
- la modal de promociones hay que acomodarla ya que tiene que estar como la tiene productDetailmodal
-acomodar cuando paso por el cursor que se vea mas claro en el modo claro ya que ahorita se ve osucro cuando paso el cursor 


tablas nuevas en la base de datos  (listo)
- usuarios
  editar perfil
  ( const [form, setForm] = useState({
    nombre: 'Daniel Barbera',
    email: 'daniel@example.com',
    telefono: '987 654 321',
  });cambio de contraseña (esto es un boton que aun no funciona))

  - pedidos
  (const ORDERS_DATA = [
  {
    id: 'ORD-00123',
    date: '15 Ago, 2026',
    total: 'S/ 245.50',
    status: 'En camino',
    statusType: 'active', // active, completed, cancelled
    items: 3,
  },
  {
    id: 'ORD-00101',
    date: '10 Ago, 2026',
    total: 'S/ 1,200.00',
    status: 'Entregado',
    statusType: 'completed',
    items: 12,
  },
  {
    id: 'ORD-00085',
    date: '25 Jul, 2026',
    total: 'S/ 85.00',
    status: 'Entregado',
    statusType: 'completed',
    items: 1,
  },
  {
    id: 'ORD-00042',
    date: '02 Jul, 2026',
    total: 'S/ 320.00',
    status: 'Cancelado',
    statusType: 'cancelled',
    items: 4,
  },)
    
  - detalle de pedidos 
  // Datos de ejemplo de los productos de cada pedido
    const ORDER_PRODUCTS = {
  'ORD-00123': [
    { id: '1', nombre: 'Taladro Percutor 750W', cantidad: 1, precio: 149.90, categoria: 'Herramientas' },
    { id: '2', nombre: 'Broca HSS Set x10', cantidad: 2, precio: 34.90, categoria: 'Accesorios' },
    { id: '3', nombre: 'Guantes de Trabajo L', cantidad: 1, precio: 25.80, categoria: 'EPP' },
  ],
  'ORD-00101': [
    { id: '4', nombre: 'Cemento Pacasmayo 42.5kg', cantidad: 10, precio: 42.00, categoria: 'Construcción' },
    { id: '5', nombre: 'Varilla Corrugada 3/8"', cantidad: 2, precio: 35.00, categoria: 'Fierros' },
  ],
  'ORD-00085': [
    { id: '6', nombre: 'Llave Inglesa 12"', cantidad: 1, precio: 85.00, categoria: 'Herramientas' },
  ],
  'ORD-00042': [
    { id: '7', nombre: 'Pintura Látex Blanco 4L', cantidad: 2, precio: 68.00, categoria: 'Pinturas' },
    { id: '8', nombre: 'Rodillo de Pintura', cantidad: 1, precio: 22.00, categoria: 'Pinturas' },
    { id: '9', nombre: 'Bandeja para Pintura', cantidad: 1, precio: 12.00, categoria: 'Pinturas' },
    { id: '10', nombre: 'Cinta de Embalaje 50m', cantidad: 2, precio: 9.00, categoria: 'Accesorios' },
  ],

  const TIMELINE_STEPS = {
  active: [
    { label: 'Pedido recibido', done: true, icon: 'checkmark-circle' },
    { label: 'Preparando pedido', done: true, icon: 'cube' },
    { label: 'En camino', done: true, icon: 'bicycle', current: true },
    { label: 'Entregado', done: false, icon: 'home' },
  ],
  completed: [
    { label: 'Pedido recibido', done: true, icon: 'checkmark-circle' },
    { label: 'Preparando pedido', done: true, icon: 'cube' },
    { label: 'En camino', done: true, icon: 'bicycle' },
    { label: 'Entregado', done: true, icon: 'home' },
  ],
  cancelled: [
    { label: 'Pedido recibido', done: true, icon: 'checkmark-circle' },
    { label: 'Cancelado', done: false, icon: 'close-circle', cancelled: true },
  ],
};
    - direcciones de envio 
 const [form, setForm] = useState({
    nombre: '',
    calle: '',
    distrito: '',
    codigoPostal: '',
    referencia: '',
    telefono: '',
  });
  boton de guardar direccion


    - metodos de pago
    const PAYMENT_METHODS = [
  {
    id: '1',
    type: 'visa',
    last4: '4242',
    expiry: '12/25',
  },
  {
    id: '2',
    type: 'mastercard',
    last4: '8888',
    expiry: '08/26',
  },
  {
    id: '3',
    type: 'paypal',
    email: 'daniel@example.com',
  },
];
   - agregar metodos de pago
    const PAYMENT_TYPES = [
  { id: 'visa',       label: 'Visa',        icon: 'card',        color: '#1A1F71' },
  { id: 'mastercard', label: 'Mastercard',  icon: 'card',        color: '#EB001B' },
  { id: 'paypal',     label: 'PayPal',      icon: 'logo-paypal', color: '#003087' },
  { id: 'yape',       label: 'Yape',        icon: 'phone-portrait-outline', color: '#72009B' },
    numero de tarjeta  
    nombre del titular
    fecha de expiracion
    cvv
  boton de agregar metodos 
 
];
};