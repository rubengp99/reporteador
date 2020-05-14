import w from '@/services/variables'
import reports from '@/plugins/reports';
import accounting from 'accounting';
import moment from "moment";
import _ from 'lodash';

/**
 *  CAMBIA UN ICONO DE LA TABLA Y ABRE UN MODAL
 * @param {Object} item // CONCEPTO QUE PROPORCIONA EL FLAG PARA ABRIR EL MODAL
 */
const open = async function (item) {
    //este metodo abre la pestaña más detalles de cada producto.
    if (typeof item !== 'undefined') {
        if (item === null) {
            this.table.concepts.map(p => p.icon.toggled = p.icon.toggled ? !p.icon.toggled : p.icon.toggled);
            this.dialog = false;
        } else {
            item.icon.toggled = !item.icon.toggled;
            this.selectedItem = item;
            this.selectedItem.sold = accounting.formatMoney(this.selectedItem.sold, {
                symbol: '',
                thousand: '.',
                decimal: ','
            }).split(',')[0];
            this.dialog = true;
        }
    }
};

/**
 * DETERMINA QUE CONCEPTOS SE MONSTRARAN SEGÚN LA PÁGINA
 * @param {Number} page //INT QUE RELACIONA EL NÚMERO DE PÁGINA AL QUE SE MUEVE 
 */
const paginate = async function (page) {
    this.loading = true;
    //esta seccion determinar las posiciones del arreglo general que se tomarán mas adelante, un limite inferior y uno superior
    if (page === 1) this.table.dataOffset = 0;
    else if (page > this.table.page_old)
        this.table.dataOffset += Math.abs(page - this.table.page_old) === 0 ? this.table.itemsPerPage : Math.abs(page - this.table.page_old) * this.table.itemsPerPage;
    else if (page < this.table.page_old)
        this.table.dataOffset -= Math.abs(page - this.table.page_old) === 0 ? this.table.itemsPerPage : Math.abs(page - this.table.page_old) * this.table.itemsPerPage;
    //guardamos un historial de la página anterior para mayor precision al paginar.
    this.table.page_old = page;
    //si hay datos filtrados entonces se utiliza ese arreglo, sino, se usa el arreglo general
    if (this.grupo === "" && this.subgrupo === "") {
        await this.getConcept((this.search !== ""), this.search, this.apiConcepts.data.data);
    } else {
        await this.getConcept((this.search !== ""), this.search, this.filteredConcepts);
    }
}

//CREA EL INVENTARIO
const createInventory = async function() {
    //se piden las facturas de hoy, y de 6 dias anteriores a este para poder calcular las ventas de X producto en la seman
    this.weeklySales = this.vuexWeeklySales;
    this.apiConceptReturns = this.vuexConceptReturns;
    this.apiConcepts = (this.isExistencia) ? Object.assign({}, { totalCount: this.concepts.length, data: { data: this.concepts, } }) : this.vuexConcepts;
    this.apiConceptSales = this.vuexConceptSales;
    this.apiInvoices = this.vuexInvoices;
    this.apiGroups = this.vuexGroups;
    this.apiGroups = this.apiGroups.data.data;
    this.apiSubGroups = this.vuexSubGroups;
    this.apiSubGroups = this.apiSubGroups.data.data;
    //se crea un arreglo con objectos personalizados de grupos para poder filtrar los subgrupos pertenecientes al mas adelante
    for (let group of this.apiGroups) {
        // si result contiene datos, entonces el grupo tiene subgrupos (hasSubGroups)
        let result = this.apiSubGroups.filter(asg => asg.grupos_id === group.id || asg.adm_grupos_id === group.id);
        let hasSubGroups = true;
        if (result.length === 0) {
            hasSubGroups = false;
        }
        this.grupos.push({
            text: group.nombre,
            value: {
                id: group.id,
                name: group.nombre,
                hasSub: hasSubGroups
            }
        })
    }

    this.gruposAux = this.grupos;

    if (typeof this.$route.params.id !== 'undefined' && this.$route.name === 'concepto') {
        this.search = this.$route.params.nombre;
        this.goSearch = !this.goSearch;
    } else {
        this.table.totalConceptos = this.apiConcepts.data.totalCount;
        await this.getConcept(false, "", this.apiConcepts.data.data);
    }
}

/**
 * RETORNA UNA N CANTIDAD DE CONCEPTOS PARA LA PÁGINA ACTUAL DE LA TABLA CON SUS RESPECTIVOS ANALISIS
 * 
 * @param {Boolean} search // DETERMINA SI SE ESTÁ BUSCANDO POR NOMBRE DE CONCEPTO
 * @param {String} input // SI SE BUSCA POR NOMBRE DE CONCEPTO, ESTA SERIA LA CADENA CON EL NOMBRE
 * @param {Array of Objects} pConcept // ARREGLO DE CONCEPTOS QUE SERÁ FILTRADO
 */
const getConcept =  _.debounce(async function (search = false, input = "", pConcept = null) {
    let aux = [];
    //este metodo solo procesa el limite por pagina, por eso se corta el arreglo segun lo calculado en paginate()
    let apiConcepts = (pConcept.length > this.table.itemsPerPage) ?
        pConcept.slice(this.table.dataOffset, this.table.dataOffset + this.table.itemsPerPage) : pConcept;
    //si se ha habilitado alguna busqueda por nombre entonces  
    if (search && typeof this.$route.params.id === 'undefined') {
        //se filtran los resultados del arreglo general si no hay grupos acti vos, sino, se filtran desde el arreglo previamente filtrado
        this.filteredConcepts = await this.filterConcepts(input);
        apiConcepts = this.filteredConcepts.slice(this.table.dataOffset, this.table.dataOffset + this.table.itemsPerPage)
        this.table.totalConceptos = await this.filterConcepts(input).length;
    } else if (typeof this.$route.params.id !== 'undefined') {
        this.filteredConcepts = await this.filterConceptsFromRanking();
        apiConcepts = this.filteredConcepts.slice(this.table.dataOffset, this.table.dataOffset + this.table.itemsPerPage);
        this.table.totalConceptos = await this.filterConceptsFromRanking().length;
    }
    //procesamos los productos que apareceran en la página
    //aunado a ello, construimos nuestro propio objecto debido a que el modulo requiere una estructura diferente
    //a la planteada en la base de datos
    for (let concept of apiConcepts) {
        aux.push(
            await this.configData({
                image: concept.imagen,
                icon: {
                    img: '/images/box.svg',
                    toggled: false,
                },
                reference: concept.referencia,
                id: concept.id,
                codigo: concept.codigo,
                name: concept.nombre,
                stock: await this.getExistencias(concept),
                sold: await this.configSales(concept),
                stockMin: concept.existencia_minima,
                stockMax: concept.existencia_maxima,
                description: concept.descripcion,
                returned: 0,
                saleDollar: +concept.precio_dolar,
                cost$: +concept.costo_dolar,
                saleBolivar: +concept.precio_a,
                costBs: +concept.ultimo_costo,
                category: {
                    id: await this.getGrupoId(concept),
                    name: await this.getGrupoName(concept),
                },
                subCategory: {
                    id: await this.getSubGrupoId(concept),
                    name: await this.getSubGrupoName(concept)
                },
                stock_daily_sells: [0, 0, 0, 0, 0, 0],
                stock_end: [],
                stock_lastDay: "",
                stock_rotation: null,
                stock_demand: null,
                stock_devolution: null,
                stock_claims: null,
                stock_days: null,
                stock_costs_dollar: null,
                stock_costs_bolivar: null,
            })
        );
    }
    this.table.concepts = aux.sort((a, b) => a.id + b.id);
    this.loading = false;
}, 555)

/**
 * CREA LOS ANALISIS RESPECTIVOS DEL CONCEPTO
 * @param {Object} product //Concepto a ser modificado 
 */
const configData = async function (product) {
    if (this.isExistencia) return product;
    product = await this.configWeeklyDemand(product);
    product = await this.configStockDays(product);
    product = await this.configStockRotation(product);
    product = await this.configClaims(product);
    product = await this.configCostRelation(product);
    product = await this.configDevolutions(product);
    return product;
};

/**
 * RETORNA LOS DATOS DE AGOTAMIENTO DE INVENTARIO
 * @param {Object} product //Concepto a ser modificado 
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

/**
 * RETORNA EL MARGEN DE BENEFICIO
 * @param {Object} product //Concepto a ser modificado 
 */
const configCostRelation = async function(product){
    product.stock_costs_dollar = reports.chart__donut(
        [product.saleDollar, +product.cost$],
        "Beneficios del", 
        ["Precio", "Costo"], 
        ["#15b7b9","#f73859"], 
        "benefits", 
        '$'
    );

    product.stock_costs_bolivar = reports.chart__donut(
        [ product.saleBolivar ,+product.costBs], 
        "Beneficios del", 
        ["Precio", "Costo"], 
        ["#15b7b9","#f73859"], 
        "benefits", 
        'Bs'
    );
    //esto da formato de BSF + Precio (formato español -> Bs1.000,00)
    product.saleDollar = accounting.formatMoney( +product.saleDollar, { symbol: '$', thousand : ".", decimal  : ",", });
    product.saleBolivar = accounting.formatMoney(+product.saleBolivar, { symbol: 'Bs', thousand : ".", decimal  : ",", });
    return product;
}

/**
 * RETORNA LA ROTACION DE INVENTARIO
 * @param {Object} product //Concepto a ser modificado 
 */
const configStockRotation = async function(product){
    product.stock_rotation = reports.chart__donut([product.sold, product.stock + product.sold], "Rotación del", ["Consumo", "Existencias"], ["#f73859", "#009688"]);

    return product;
}

/**
 * RETORNA LA DEMANDA SEMALA EN UN ARREGLO DE 7 PIEZAS
 * @param {Object} product //Concepto a ser modificado 
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

/**
 * RETORNA LAS VENTAS
 * @param {Object} product //Concepto a ser modificado 
 */
const configSales = async function(product){
    let aux = this.apiConceptSales.data.data.find(c => c.id === product.id);
    return (typeof aux !== 'undefined' ? +Math.trunc(+aux.vendidos) : 0);
  };

/**
 * RETORNA LOS RECLAMOS
 * @param {Object} product //Concepto a ser modificado 
 */
const configClaims = async function  (product) {
    product.stock_claims = reports.chart__donut(
        [0, product.sold],
        "Reclamos del",             //esto corresponde a reclamos, aún no está hecho, 
        ["Reclamos", "Compras"],    //solo hay que cambiar el 0 por el Nº de reclamos
        ["#FFC107", "#3F51B5"],
    );

    return product;
}

/**
 * RETORNA LAS DEVOLUCIONES
 * @param {Object} product //Concepto a ser modificado 
 */
const configDevolutions = async function(product){
  //pedimos las devoluciones
  let devolutions = this.apiConceptReturns.data.data.find(i => i.id === product.id)
  //es el mismo caso de las ventas, a veces retorna "empty entity" y eso puede incongruencia en los datos
  product.returned = typeof devolutions !== 'undefined' ? !isNaN(+devolutions.devueltos) ? Math.trunc(+devolutions.devueltos * 100) / 100 : 0 : 0;
  
  product.stock_devolution = reports.chart__donut([product.returned, product.sold], "Devoluciones del", ["Devoluciones", "Compras"], ["#f73859", "#3F51B5", ]);
  return product;
}

/**
 * BUSCA UN CONCEPTO POR GRUPOS, NOMBRE, ETC
 * @param {String} input // DATA PROVENIENTE DE TEXT-FIELD - NOMBRE DEL CONCEPTO
 */
const filterConcepts = async function(input){
    return ((this.grupo !== "" || this.subgrupo !== "") ? this.filteredConcepts : this.apiConcepts.data.data)
        .filter(concept => concept.nombre.toLowerCase().includes(input.toLowerCase()));
}

//SI ACCEDES DESDE LA VISTA << VENTAS >> ---> << RANKING >> DEVUELVE EL CONCEPTO SELECCIONADO
const filterConceptsFromRanking = async function(){
    return ((this.grupo !== "" || this.subgrupo !== "") ? this.filteredConcepts : this.apiConcepts.data.data)
        .filter(concept => concept.id === this.$route.params.id);
}

/**
 * 
 * @param {Object} concept // Concepto que proporciona las existencias
 */
//RETORNA LAS EXISTENCIAS DE UN CONCEPTO A PARTIR DEL ARRAY DE DEPOSITOS DEVUELTO POR LA API
const getExistencias = async function (concept) {
    return (Array.isArray(concept.existencias) ? concept.existencias.length > 0 ? concept.existencias.map(a => Math.trunc(+a.existencia)).reduce((a, b) => a + b) : 0 : concept.existencias);
}

/**
 * 
 * @param {Object} concept // Concepto que proporciona los IDs
 */
//OBTIENE EL ID DE UN GRUPO
const getGrupoId = async function (concept){
    return (typeof this.apiGroups.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id) !== 'undefined') ?
        this.apiGroups.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id).id: 0;
}

/**
 * 
 * @param {Object} concept // Concepto que proporciona los IDs
 */
//OBTIENE EL NOMBRE DE UN GRUPO
const getGrupoName = async function (concept){
    return (typeof this.apiGroups.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id) !== 'undefined') ?
        this.apiGroups.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id).nombre : '-';
}

/**
 * 
 * @param {Object} concept // Concepto que proporciona los IDs
 */
//OBTIENE EL ID DE UN SUBGRUPO
const getSubGrupoId = async function (concept){
    return (typeof this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id) !== 'undefined') ?
        typeof this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0] !== 'undefined' ? this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0].id : 0 : 0;
}

/**
 * 
 * @param {Object} concept // Concepto que proporciona los IDs
 */
//OBTIENE EL NOMBRE DE UN SUBGRUPO
const getSubGrupoName = async function (concept){
    return (typeof this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id) !== 'undefined') ?
        typeof this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0] !== 'undefined' ? this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0].nombre : '-' : '-';
}

const filterSubGrupos = async function(){
    //existen conceptos con subgrupos_id = null, esta categoría las engloba para que no se pierdan
    //durante el filtrado
    let subgrupos = [];
    subgrupos.push({
        text: 'Indefinidos',
        value: {
            id: null,
            name: '-',
            hasSub: true
        }
    })
    //al seleccionar un grupo es necesario filtrar los subgrupos pertenecientes a el
    let aux = this.apiSubGroups.filter(e => e.grupos_id === this.grupo.id || e.adm_grupos_id === this.grupo.id);
    //se puede dar el caso de que el grupo no tenga subgrupos, por eso es necesario hacer la verificación
    if (typeof aux !== 'undefined') aux.forEach(i => subgrupos.push({
        text: i.nombre,
        value: {
            id: i.id,
            name: i.nombre
        }
    }));
    else this.subNoData = (this.grupo.hasSub) ? 'Seleccione un «Grupo» primero.' : 'El grupo «' + this.grupo.name + '» no contiene Sub-Grupos.'
    
    return subgrupos;
}


const commonDataReset = async function () {
    this.table.page = 1;
    this.table.page_old = 1;
    this.table.dataOffset = 0;
    this.search = "";
    this.loading = true;
    this.table.products = [];
    this.grupos = this.gruposAux;
}

export default {
    open,
    paginate,
    commonDataReset,
    createInventory,
    configData,
    configStockDays, 
    configSales, 
    configClaims, 
    configCostRelation, 
    configStockRotation, 
    configWeeklyDemand, 
    configDevolutions,
    filterConcepts,
    filterConceptsFromRanking,
    filterSubGrupos,
    getExistencias,
    getGrupoId,
    getConcept,
    getGrupoName,
    getSubGrupoId,
    getSubGrupoName,
};