import w from '@/services/variables'
import reports from '@/plugins/reports';
import accounting from 'accounting';
import moment from "moment";

//Crea los analisis respectivos de cada concepto
const configData = async function(product){
    product = await this.configSales(product);
    product = await this.configWeeklyDemand(product);
    product = await this.configStockDays(product);
    product = await this.configStockRotation(product);
    product = await this.configClaims(product);
    product = await this.configCostRelation(product);
    product = await this.configDevolutions(product);
    return product;
};
  /* ----------------------------
      Diseñado para configurar:
        -- Días de Inventario
    */

const configStockDays = async function(product) {
    //variables auxiliares
    var stock_aux = product.stock;
    var stock_dates = [];

    //si la ventas totales de la semana son mayores a 0 se calculan la decadencia del inventario según esta demanda
    if(product.stock_daily_sells.reduce((a, b) => a + b) > 0){
        do{
            //se resta la demanda al inventario por cada dia transcurrido
            stock_aux -= (Math.round((product.stock_daily_sells.reduce((a, b) => a + b) / 7) * 100 ) / 100);
            product.stock_end.push(Math.trunc(stock_aux));
            if (stock_aux < 0) break;
        }while (stock_aux > 0)  
        //se asignan los dias transcurridos en formato ej: "Feb 13 2020"
        for (let i = 0; i < product.stock_end.length; i++) {
            stock_dates.push(
                moment(w.test).locale("es").add(i, "days").format("MMM Do").charAt(0).toUpperCase() + moment(w.test).locale("es").add(i, "days").format("MMM Do").slice(1)
            );
        }
        //este es el día que representa el final de las existencias de un producto
        product.stock_lastDay = moment(w.test).locale("ES").add(stock_dates.length - 1, "days").format("LL") + (moment(w.test).locale("ES").add(stock_dates.length - 1, "days").format("LL") === moment(w.test).locale('ES').format('LL') ? ' (Hoy)' : '');
    }else{
        //si no hay demanda, se crea un arreglo auxiliar donde no existen movimientos, el valor se repite 7 veces
        //esto con fines visuales en el reporte.
        for (let i = 0; i < 7; i++) {
            product.stock_end.push(stock_aux);
            stock_dates.push(moment(w.test).locale("es").add(i, "days").format("MMM Do").charAt(0).toUpperCase() + moment(w.test).locale("es").add(i, "days").format("MMM Do").slice(1));
        }
        product.stock_lastDay = '';
    }

    //Graficar un arreglo muy grande representa un problema para el rendimiento visual de la APP, por se toma una porcion del arreglo
    let stockEndAux = product.stock_end.length > 1000 ? product.stock_end.slice(Math.ceil(product.stock_end.length/50),product.stock_end.length-1) : product.stock_end;
    let StockDatesAux = stock_dates.length > 1000 ? stock_dates.slice(Math.ceil(product.stock_end.length/50),product.stock_end.length-1) : stock_dates;
    
    product.stock_days = reports.chart__area(stockEndAux, StockDatesAux, false,  "stockdays" );

    return product;
};

   /* ----------------------------
      Diseñado para configurar:
        -- Rentabilidad
    */

const configCostRelation = async function(product){
    product.stock_costs = reports.chart__donut([+product.sale, +product.cost], "Beneficios del", ["Precio", "Costo"], ["#15b7b9","#f73859"], "benefits");
    //esto da formato de BSF + Precio (formato español -> Bs1.000,00)
    product.sale = accounting.formatMoney(+product.sale, { symbol   : "$", thousand : ".", decimal  : ",", });
    
    return product;
}

   /* ----------------------------
      Diseñado para configurar:
        -- Rotacion de Inventario
    */

const configStockRotation = async function(product){
    product.stock_rotation = reports.chart__donut([product.sold, product.stock + product.sold], "Rotación del", ["Consumo", "Existencias"], ["#f73859","#009688"]);

    return product;
}

  /* ----------------------------
      Diseñado para configurar:
        -- Ventas a partir del arreglo retornado por concepts/mostSold
  */

const configWeeklyDemand = async function(product){
    let sales = [0,0,0,0,0,0,0];
    //WeekylySales es un arreglo de 7 posiciones que almacena las facturas de 1 semana, por dias.
    for(let j = 6; j > -1; j--){
        //La puede API arrojar "empty entity", es decir, .data === string, por lo que se debe checkear su typeof
        if (typeof this.weeklySales[j].data === 'object'){
            //si pasa la prueba, entonces se debe filtrar cada factura donde aparezca un detalle en específico
            //luego se mapea solo la cantidad vendida de ese detalle en específico, y como resulado tenemos un arreglo
            //de cadenas así ["1.000", "2.000", "4.000"]
            let aux = [].concat(...this.weeklySales[j].data.data
                        .filter(i => i.detalles.some(d => d.adm_conceptos_id === product.id || d.conceptos_id === product.id)))
                        .map(i => +i.detalles.filter(d => d.adm_conceptos_id === product.id || d.conceptos_id === product.id)[0].cantidad);
            //si al filtrar arriba se consiguieron ventas de ese detalle en un día, entonces se trunca el valor para eliminar imperfecciones en los datos
            //y se transforma a numero.
            sales[j] = aux.length > 0 ? Math.trunc(aux.reduce((a, b) => a += +Math.trunc(+b)) * 100) / 100 : 0;
        }
    }
    product.stock_daily_sells = sales;

    let fechas = [];
    //caculamos el día actual y 6 días anteriores a este para determinar la semana de ventas en transcurso
    for (let i = 0; i < 7; i++) fechas.push(moment(w.test).locale('es').subtract(i,'days').format('MMM Do').charAt(0).toUpperCase() + moment(w.test).locale('es').subtract(i,'days').format('MMM Do').slice(1));
    fechas.reverse(); //revertimos el arreglo por fines de ordenamient
    product.stock_demand = reports.chart__area(product.stock_daily_sells,fechas);

    return product;
}

  /* ----------------------------
      Diseñado para configurar:
        -- Ventas a partir del arreglo retornado por concepts/mostSold
  */
const configSales = async function(product){
    let aux = this.apiConceptSales.data.data.find(c => c.id === product.id);
    product.sold = typeof aux !== 'undefined' ? +Math.trunc(+aux.vendidos) : 0;

    return product;
  };

  /* ----------------------------
      Diseñado para configurar:
        -- Reclamos del concepto
  */

const configClaims = async function  (product) {
    product.stock_claims = reports.chart__donut(
        [0, product.sold],
        "Reclamos del",             //esto corresponde a reclamos, aún no está hecho, 
        ["Reclamos", "Compras"],    //solo hay que cambiar el 0 por el Nº de reclamos
        ["#FFC107", "#3F51B5"]
    );

    return product;
}

const configDevolutions = async function(product){
  //pedimos las devoluciones
  let devolutions = this.apiConceptReturns.data.data.find(i => i.id === product.id)
  //es el mismo caso de las ventas, a veces retorna "empty entity" y eso puede incongruencia en los datos
  product.returned = typeof devolutions !== 'undefined' ? !isNaN(+devolutions.devueltos) ? Math.trunc(+devolutions.devueltos * 100) / 100 : 0 : 0;
  
  product.stock_devolution = reports.chart__donut([product.returned, product.sold], "Devoluciones del", ["Devoluciones", "Compras"], ["#f73859","#3F51B5",]);
  return product;
}

export default {
    configData,
    configStockDays, 
    configSales, 
    configClaims, 
    configCostRelation, 
    configStockRotation, 
    configWeeklyDemand, 
    configDevolutions
};