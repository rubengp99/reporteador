import _ from 'lodash';
import w from '@/services/variables'
import reports from '@/plugins/reports';
import accounting from 'accounting';
import moment from "moment";
import concept from "@/services/Conceptos";

//EXTRAEMOS 8 CONCEPTOS ANALIZADOS PARA MOSTRAR EN LA TABLA
const getConcept = _.debounce(async function(search = false, input = "", pConcept = null) {
    let aux = [];
    //este metodo solo procesa el limite por pagina, por eso se corta el arreglo segun lo calculado en paginate()
    let apiConcepts = (pConcept.length > this.table.itemsPerPage) ? 
      pConcept.slice(this.table.dataOffset, this.table.dataOffset + this.table.itemsPerPage) : pConcept;
    //si se ha habilitado alguna busqueda por nombre entonces  
    if (search && typeof this.$route.params.id === 'undefined'){
      //se filtran los resultados del arreglo general si no hay grupos acti vos, sino, se filtran desde el arreglo previamente filtrado
      this.filteredConcepts = ((this.grupo !== "" || this.subgrupo !== "") ? this.filteredConcepts : this.apiConcepts.data.data)
        .filter(concept => concept.nombre.toLowerCase().includes(input.toLowerCase()));
      apiConcepts = this.filteredConcepts.slice(this.table.dataOffset, this.table.dataOffset + this.table.itemsPerPage);
      this.table.totalConceptos = ((this.grupo !== "" || this.subgrupo !== "") ? this.filteredConcepts : this.apiConcepts.data.data)
        .filter(concept => concept.nombre.toLowerCase().includes(input.toLowerCase())).length;
    }else if(typeof this.$route.params.id !== 'undefined'){
      this.filteredConcepts = ((this.grupo !== "" || this.subgrupo !== "") ? this.filteredConcepts : this.apiConcepts.data.data)
        .filter(concept => concept.id === this.$route.params.id);
      apiConcepts = this.filteredConcepts.slice(this.table.dataOffset, this.table.dataOffset + this.table.itemsPerPage);
      this.table.totalConceptos = ((this.grupo !== "" || this.subgrupo !== "") ? this.filteredConcepts : this.apiConcepts.data.data)
        .filter(concept => concept.adm_grupos_id === this.$route.params.grupo && concept.adm_subgrupos_id === this.$route.params.subgrupo && concept.nombre === this.$route.params.nombre).length;
    }
    this.table.pageCount = Math.ceil(this.table.totalConceptos / this.table.itemsPerPage);
    //procesamos los productos que apareceran en la página
    //aunado a ello, construimos nuestro propio objecto debido a que el modulo requiere una estructura diferente
    //a la planteada en la base de datos
    for(let concept of apiConcepts){
      aux.push(
        await this.configStockDays(
          await this.configMovements({
            image: concept.imagen,
            icon: {
              img: '/images/box.svg',
              toggled: false,
            },
            reference: concept.referencia,
            id: concept.id,
            codigo: concept.codigo,
            name: concept.nombre,
            stock: Array.isArray(concept.existencias) ? concept.existencias.length > 0 ? concept.existencias.map(a => Math.trunc(+a.existencia)).reduce((a,b) => a+b) : 0 : concept.existencias ,
            sold: 0,
            stockMin: concept.existencia_minima,
            stockMax: concept.existencia_maxima,
            description: concept.descripcion,
            returned: 0,
            sale: +concept.precio_dolar,
            cost: +concept.costo_dolar,
            category: {
              id: (typeof this.apiGroups.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id) !== 'undefined')?
                    this.apiGroups.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id).id:0,
              name: (typeof this.apiGroups.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id) !== 'undefined')?
                      this.apiGroups.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id).nombre:'-',
            },
            subCategory: {
              id: (typeof this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id) !== 'undefined')?
                    typeof this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0] !== 'undefined' ? this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0].id : 0 : 0,
              name: (typeof this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id) !== 'undefined')?
                      typeof this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0] !== 'undefined' ? this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0].nombre : '-' :'-'
            },
            stock_daily_sells: [0,0,0,0,0,0],
            stock_end: [],
            stock_lastDay: "",
            stock_rotation: null,
            stock_demand: null,
            stock_devolution: null,
            stock_claims: null,
            stock_days: null,
            stock_costs: null,
          })
        )
      );
    }
    this.table.products = aux.sort((a, b) => a.id + b.id);   
    this.loading = false;
  },555);

  /* ----------------------------
      Diseñado para configurar:
        -- Inventario
        -- Días de Inventario
        -- Rotación de Stock (50%)
        -- Rentabilidad
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
          moment(w.test).locale("es").add(i, "days").format("MMM Do YYYY").charAt(0).toUpperCase() + moment(w.test).locale("es").add(i, "days").format("MMM Do YYYY").slice(1)
        );
      }
      //este es el día que representa el final de las existencias de un producto
      product.stock_lastDay = moment(w.test).locale("ES").add(stock_dates.length - 1, "days").format("LL");
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
    product.stock_costs = reports.chart__donut([+product.sale, +product.cost], "Beneficios del", ["Precio", "Costo"], ["#15b7b9","#f73859"], "benefits");
    product.stock_rotation = reports.chart__donut([product.sold, product.stock + product.sold], "Rotación del", ["Consumo", "Existencias"], ["#ffc93c","#15b7b9"]);
    
    //esto da formato de BSF + Precio (formato español -> Bs1.000,00)
    product.sale = accounting.formatMoney(+product.sale, { symbol   : "$", thousand : ".", decimal  : ",", });
    return product;
  };

  /* ----------------------------
      Diseñado para configurar:
        -- Demanda Diaria
        -- Rotación de Stock (50%)
        -- Devoluciones
        -- Reclamos??
    */

   //PARA PRUEBAS USAR moment('2019/10/29') o cualquier fecha inferior
const configMovements = async function(product){
    let fechas = [];
    //caculamos el día actual y 6 días anteriores a este para determinar la semana de ventas en transcurso
    for (let i = 0; i < 7; i++) fechas.push(moment(w.test).locale('es').subtract(i,'days').format('MMM Do YYYY').charAt(0).toUpperCase() + moment(w.test).locale('es').subtract(i,'days').format('MMM Do YYYY').slice(1));
    fechas.reverse(); //revertimos el arreglo por fines de ordenamiento
    let sales = [0,0,0,0,0,0,0];
    // pedimos a la api las ventas del producto entrante
    //product.sold = await concept().get(product.id+'/sell/?limit='+this.apiInvoices.data.totalCount);
    //la api puede retornar "empty entity" en ocasiones, por eso es necesario que la data es de typeof object, sino, asignar 0 en su lugar
    //para evitar errores
    let aux = this.apiConceptSales.data.data.find(c => c.id === product.id);
    product.sold = typeof aux !== 'undefined' ? +Math.trunc(+aux.vendidos) : 0;
    //pedimos las devoluciones
    let devolutions = await concept().get(product.id+'/devolutions/?limit='+this.apiInvoices.data.totalCount);
    //es el mismo caso de las ventas, a veces retorna "empty entity" y eso puede incongruencia en los datos
    product.returned = typeof devolutions.data === 'object' ? !isNaN(+devolutions.data.devoluciones) ? +devolutions.data.devoluciones : 0 : 0;
    
    //WeekylySales es un arreglo de 7 posiciones que almacena las facturas de 1 semana, por dias.
    for(let j = 6; j > -1; j--){
      //a veces arroja "empty entity", es decir, .data === string, por lo que se debe checkear su typeof
      if (typeof this.weeklySales[j].data === 'object'){
        //si pasa la prueba, entonces se debe filtrar cada factura donde aparezca un detalle en específico
        //luego se mapea solo la cantidad vendida de ese detalle en específico, y como resulado tenemos un arreglo
        //de cadenas así ["1.000", "2.000", "4.000"]
        let aux = [].concat(...this.weeklySales[j].data.data
                    .filter(i => i.detalles.some(d => d.adm_conceptos_id === product.id || d.conceptos_id === product.id)))
                    .map(i => +i.detalles.filter(d => d.adm_conceptos_id === product.id || d.conceptos_id === product.id)[0].cantidad);
        //si al filtrar arriba se consiguieron ventas de ese detalle en un día, entonces se trunca el valor para eliminar imperfecciones en los datos
        //y se transforma a numero.
        sales[j] = aux.length > 0 ? aux.reduce((a,b) => a+= +Math.trunc(+b)) : 0;
      }
    }

    product.stock_daily_sells = sales;
    product.stock_devolution = reports.chart__donut([product.returned, product.sold], "Devoluciones del", ["Devoluciones", "Compras"], ["#E91E63", "#3f72af"]);
    product.stock_claims = reports.chart__donut(
        [0, product.sold],
        "Reclamos del",             //esto corresponde a reclamos, aún no está hecho, 
        ["Reclamos", "Compras"],    //solo hay que cambiar el 0 por el Nº de reclamos
        ["#FFC107", "#3f72af"]
    );
    fechas = [];
    for (let i = 0; i < 7; i++) fechas.push(moment().locale('es').subtract(i,'days').format('MMM Do').charAt(0).toUpperCase() + moment(w.test).locale('es').subtract(i,'days').format('MMM Do').slice(1));
    fechas.reverse();
    product.stock_demand = reports.chart__area(product.stock_daily_sells,fechas);

    return product;
  };


export default {getConcept , configStockDays, configMovements};