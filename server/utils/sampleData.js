const sampleRecetas = [
  { Producto: 'Pan Frances', Ingrediente: 'Harina', Cantidad_Gramos: 500 },
  { Producto: 'Pan Frances', Ingrediente: 'Agua', Cantidad_Gramos: 300 },
  { Producto: 'Pan Frances', Ingrediente: 'Sal', Cantidad_Gramos: 10 },
  { Producto: 'Pan Frances', Ingrediente: 'Levadura', Cantidad_Gramos: 5 },
  { Producto: 'Croissant', Ingrediente: 'Harina', Cantidad_Gramos: 400 },
  { Producto: 'Croissant', Ingrediente: 'Mantequilla', Cantidad_Gramos: 250 },
  { Producto: 'Croissant', Ingrediente: 'Agua', Cantidad_Gramos: 150 },
  { Producto: 'Croissant', Ingrediente: 'Azucar', Cantidad_Gramos: 50 },
  { Producto: 'Croissant', Ingrediente: 'Sal', Cantidad_Gramos: 8 }
];

const samplePedidos = [
  { Cliente: 'Cafe Central', Producto: 'Pan Frances', Cantidad_Pedida: 10, Unidad_Pedida: 'unidades' },
  { Cliente: 'Cafe Central', Producto: 'Croissant', Cantidad_Pedida: 5, Unidad_Pedida: 'unidades' },
  { Cliente: 'Restaurante El Faro', Producto: 'Pan Frances', Cantidad_Pedida: 20, Unidad_Pedida: 'unidades' }
];

module.exports = { sampleRecetas, samplePedidos };
