/**
 * BOM Engine
 * PURA MATEMÁTICA, sin IA.
 */

const explodeBOM = (recetas, pedidos) => {
  // I. Consolida pedidos: suma Cantidad_Pedida por Producto
  const consolidatedOrders = pedidos.reduce((acc, current) => {
    const { Producto, Cantidad_Pedida } = current;
    const qty = parseFloat(Cantidad_Pedida);
    acc[Producto] = (acc[Producto] || 0) + qty;
    return acc;
  }, {});

  const productosResumen = Object.entries(consolidatedOrders).map(([nombre, cantidadTotal]) => ({
    nombre,
    cantidadTotal
  }));

  // II. Para cada producto demandado, multiplica cada Ingrediente × cantidad total del producto
  // III. Agrupa por Ingrediente y suma total por ingrediente
  const ingredientTotals = {};

  productosResumen.forEach(order => {
    const recipe = recetas.filter(r => r.Producto === order.nombre);
    
    if (recipe.length === 0) {
      console.warn(`No se encontró receta para: ${order.nombre}`);
      return;
    }

    recipe.forEach(item => {
      const ingredient = item.Ingrediente;
      const amountPerUnit = parseFloat(item.Cantidad_Gramos);
      const totalAmount = amountPerUnit * order.cantidadTotal;

      ingredientTotals[ingredient] = (ingredientTotals[ingredient] || 0) + totalAmount;
    });
  });

  const ingredientesResumen = Object.entries(ingredientTotals).map(([nombre, cantidadTotalGramos]) => ({
    nombre,
    cantidadTotalGramos
  }));

  // IV. Devuelve resultado estructurado
  return {
    productos: productosResumen,
    ingredientes: ingredientesResumen,
    totalPedidos: pedidos.length,
    totalProductosUnicos: productosResumen.length
  };
};

module.exports = { explodeBOM };
