<template>
  <div class="home">
    <div class="charts">
      <v-row data-app style="padding:0 2.5vw;">
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                  Análisis de Inventario
                <v-spacer></v-spacer>
              </v-card-title>
              <v-row style="padding:0 20px;">
                <!-- Barra de busqueda por nombre -->
                <v-col cols="12" sm="5">
                  <v-text-field
                    v-model="search"
                    :append-icon="search === '' ? 'search' : 'close'"
                    label="Nombre"
                    outlined
                    hide-details
                    dense
                    :disabled="loading"
                    style="height:39px;"
                    @keyup.enter="goSearch = !goSearch"
                    @click:append="search = ''"
                ></v-text-field>
                </v-col>
                <!-- Select de Grupos -->
                <v-col cols="6" sm="3">
                  <v-select
                    v-model="grupo"
                    :items="grupos"
                    label="Grupo"
                    outlined
                    dense
                    :disabled="loading"
                    style="height:39px;"
                  ></v-select>
                </v-col>
                <!-- Select de Subgrupos -->
                <v-col cols="6" sm="3">
                  <v-select
                    v-model="subgrupo"
                    :items="subgrupos"
                    label="Sub-Grupo"
                    outlined
                    dense
                    :disabled="loading"
                    :no-data-text="subNoData"
                    style="height:39px;"
                  ></v-select>
                </v-col>
                <!-- Limpiar filtros -->
                <v-col cols="12" sm="1">
                  <v-btn style="height:39px;" outlined dense color="error" @click="clear = !clear" :disabled="loading">
                    <p class="d-flex d-sm-none" style="margin:0">Limpiar Filtros </p>
                    <v-icon>mdi-autorenew</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <!--
                Si se va a cargar en modo server side, por página
                añadir las props >>>
                :server-items-length="table.totalConceptos"
                @update:page="paginate"
                y descomentar el código comentado.
              -->
              <v-data-table
                ref="Inventario"
                :loading="loading && '#01579B'"
                :headers="table.headers"
                :items="table.products"
                :search="table.search"
                :single-expand="table.expand"
                :expanded.sync="table.expanded"
                item-key="id"
                show-expand
                :sort-by.sync="table.sortBy"
                :sort-desc.sync="table.sortDesc"
                :page.sync="table.page"
                :items-per-page="table.itemsPerPage"
                :server-items-length="table.totalConceptos"
                hide-default-footer
                class="elevation-1"
                @update:page="paginate"
                @page-count="table.pageCount = $event"
              >
              <!-- Template para el mensaje de "BUSCANDO CONCEPTOS, CALCULANDO DATOS, LOADING, etc..." -->
                <template slot="loading">
                  <p class="body-1" style="margin-top:20px;color:#0d0d0d!important;z-index:1;position:relative;">Procesando estadísticas...</p>
                  <v-spacer></v-spacer>
                  <loader />
                  <br>
                  <v-spacer></v-spacer>
                </template>

                <!-- Template para el mensaje de "NO SE ENCONTRARON CONCEPTOS" -->
                <template slot="no-data">
                  <p class="body-1" style="margin-top:20px;color:#0d0d0d!important;">No se encontraron conceptos.</p>
                  <v-spacer></v-spacer>
                  <img :src="require('@/assets/noresults.svg')" alt="" width="400px" style="margin:20px 0;">
                  <v-spacer></v-spacer>
                </template>

                <!-- Template de la columna MÁS DETALLES, esta es la caja -->
                <template v-slot:item.image="{ item }">
                  <div class="p-2">
                    <v-btn icon height="70px" width="65px" hoverable @focus="open(item)">
                      <v-img
                        :src="(typeof item !== 'undefined') ? item.icon.toggled ? require('@/assets/boxOF.svg'):require('@/assets/box.svg') :  require('@/assets/boxOF.svg')"
                        :alt="item.name"
                        width="60px"
                        height="65px"
                        style="margin: 0 auto;"
                      ></v-img>
                    </v-btn>
                  </div>
                </template>

                <!-- Template de la columna ESTADISTICAS expandida, aqui estanlos graficos -->
                <template v-slot:expanded-item="{headers, item}">
                  <!-- we must remove padding, margins and min-height from td -->
                  <td
                    :colspan="headers.length"
                    :class="{'ma-0 pa-0': true, 'expanded-closing': !transitioned[getItemId(item)]}"
                    style="height: auto;"
                  >
                    <v-expand-transition>
                    <!-- Container we'll transition -->
                      <div v-show="transitioned[getItemId(item)]">
                          <!-- container for content. replace with whatever you want -->
                          <div style="min-height: 50px; border-bottom:0px!important;">
                           <v-row style="position:relative;margin:0;">
                             <!--linea de gráficos para ROTACIÓN DE INVENTARIO-->
                              <chart type="Rotación" :item="item" :options="item.stock_rotation" ctype="donut" height="298" wait=0.5 />
                              <v-divider inset vertical class="absolute-center"></v-divider>
                              <!--linea de gráficos para DEMANDA DE INVENTARIO SEMANAL-->
                              <chart type="Demanda" :item="item" :options="item.stock_demand" ctype="area" height="252" wait=1 />
                            </v-row>
                            <v-divider inset></v-divider>
                            <v-row style="position:relative;margin:0;">
                              <!--linea de gráficos para RECLAMOS DEL CONCEPTO-->
                              <chart type="Reclamos" :item="item" :options="item.stock_claims" ctype="donut" height="298" wait=1.5 />
                              <v-divider
                                inset
                                vertical
                                class="absolute-center"
                              ></v-divider>
                              <!--linea de gráficos para DEVOLUCIONES DEL CONCEPTO-->
                              <chart type="Devoluciones" :item="item" :options="item.stock_devolution" ctype="donut" height="298" wait=2 />
                            </v-row>
                            <v-divider inset></v-divider>
                            <v-row style="position:relative;margin:0;">
                              <!--linea de gráficos para DÍAS DE INVENTARIO-->
                              <chart type="Agotamiento" :item="item" :options="item.stock_days" ctype="area" height="251" wait=2.5 />
                              <v-divider
                                inset
                                vertical
                                class="absolute-center"
                              ></v-divider>
                              <!--linea de gráficos para UTILIDAD DEL CONCEPTO-->
                              <chart type="Rentabilidad" :item="item" :options="item.stock_costs" ctype="donut" height="298" wait=3 />
                            </v-row>
                          </div>
                      </div>
                    </v-expand-transition>
                  </td>
                </template>
                <!-- Template de la columna ESTADISTICAS -->
                <template v-slot:item.data-table-expand="item">
                  <v-icon :ref="typeof $route.params.nombre !== 'undefined' ? 'expand1' : 'expand'+item.item.id"
                    :class="{ 'v-data-table__expand-icon': true, 'v-data-table__expand-icon--active': isExpanded && transitioned[getItemId(item)] }"
                    @click="toggleExpand(item)">
                    mdi-chevron-down
                  </v-icon>
                </template>
              </v-data-table>
              <div class="text-center" style="padding: 10px 3vw;">
                <v-pagination
                  v-model="table.page"
                  :length="table.pageCount"
                  :totalItems="table.totalConceptos"
                  light
                  :disabled="loading"
                ></v-pagination>
              </div>
            </v-card>
          </v-col>
        </v-row>

      <!-- Pestaña de más detalles (MODAL) -->
      <div class="mWidth">
        <v-dialog v-model="dialog" persistent transition="bounce">
           <v-card class="mx-auto" outlined>
             <v-btn icon @click="open(null)" style="position:absolute;right:0;z-index:1;"><v-icon>close</v-icon></v-btn>
              <img v-if="selectedItem.stock === 0" src="@/assets/agotado.png" width="150px" height="75px" style="flex: 0 0 0%;position:absolute;top: 55px;left: 15px;z-index: 1;">
            <v-list-item three-line>
              <v-list-item-avatar tile size="150" color="grey lighten-1"><img :src="typeof selectedItem.image === 'undefined'  || selectedItem.image === 'default.png' ? require('@/assets/box.svg') : '' "></v-list-item-avatar>
              <v-list-item-content>
                <div class="overline mb-4">PESTAÑA DETALLADA</div>
                <v-list-item-title class="title mb-1" style="white-space: normal;line-height:1.3rem;font-size:1.1rem;">{{ selectedItem === null ? null : selectedItem.name}}</v-list-item-title>
                <v-list-item-subtitle style="padding-top:15px;">
                  <div class="caption mb-1" style="color:black;">DESCRIPCIÓN</div>
                  <p class="overline" style="color:#424242">{{ selectedItem === null ? null : selectedItem.description}}</p>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list disabled style="margin-top:-30px;text-align:left;">
              <v-subheader style="color:black;" class="subtitle-1">Detalles de Existencias</v-subheader>
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item >
                    <v-list-item-content style="padding: 6px 0;width:50%">
                      <p class="caption mb-1 ml-2" ><strong>Existencia mínima:</strong> {{ selectedItem.stockMin !== null ? selectedItem.stockMin : '---' }}</p>
                      <p class="caption ml-2" ><strong>Existencia máxima:</strong> {{ selectedItem.stockMax !== null ? selectedItem.stockMin : '---' }}</p>
                    </v-list-item-content>
                    <v-list-item-content style="padding: 6px 0;width:50%;text-align:left;">
                      <p class="caption mb-1 ml-1" ><strong>Referencia:</strong> {{ selectedItem.reference !== null ? selectedItem.reference : '---' }}</p>
                      <p class="caption ml-1" ><strong>Vendidos:</strong> {{ selectedItem.sold !== null ? selectedItem.sold : '---' }} unidades.</p>
                    </v-list-item-content>
                      <p class="overline" >&nbsp;</p>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-dialog>
      </div>

    </div>
  </div>
</template>

<script>
import chart from "@/components/inventario/Chart"
import moment from "moment";
import concept from "@/services/Conceptos";
import accounting from 'accounting';
import _ from 'lodash';
import w from '@/services/variables'
import reports from '@/plugins/reports';
import {mapState} from 'vuex';

export default {
  name: "Home",
  components: {
    chart: chart,
  },
  head: {
    title: {
      inner: 'Reporteador',
      separator: '|',
      complement: 'Inventario'
    },
  },
  data() {
    return {
      isExpanded: false,
      stock: false,
      abc: false,
      sales: false,
      price: false,
      apiConcepts: null,
      apiConceptsAux: null,
      apiInvoices: null,
      apiConceptSales: null,
      weeklySales: [],
      apiSales: null,
      apiGroups: null,
      selectedItem: {
        referece: null,
        stock: null,
        stockMin:null, 
        stockMax:null,
        stock_lastDay: null
      },
      apiSubGroups: [],
      //existen conceptos con subgrupos_id = null, esta categoría las engloba para que no se pierdan
      //durante el filtrado, PD: se pushean más grupos, pero este es el inicial
      grupos: [{text: 'Indefinidos', value: {id: null, name: '-', hasSub: true} }],
      subgrupos: [],
      grupo: "",
      subgrupo: "",
      search: "",
      goSearch: false,
      grupoChanged: false,
      subgrupoChanged: false,
      transitioned: [],
      closeTimeouts: {},
      singleExpand: false,
      subNoData: 'Seleccione un «Grupo» primero.',
      filteredConcepts: [],
      clear: false,
      dialog: false,
      loading: true,
      table: {
        expanded: [],
        expand: false,
        page: 1,
        page_old: 1,
        pageCount: 0,
        itemsPerPage: 10,// para cambiar el limite de conceptos por página, cambia este número, lo demas se configura solo
        dataOffset: 0,
        totalConceptos: 0,
        headers: [
          { text: "Más Detalles", align: "center", sortable: false, value: "image" },
          //{ text: "ID", align: "center", value: "id", sortable: false, },
          { text: "Código", align: "center", value: "codigo", sortable: false, },
          { text: "Producto", align: "center", value: "name", sortable: false, },
          { text: "Grupo", align: "center", value: "category.name", sortable: false, },
          { text: "Sub-Grupo", align: "center", value: "subCategory.name", sortable: false, },
          { text: "Existencia", align: "center", value: "stock", sortable:false, },
          //{ text: "Vendidos", align: "center", value: "sold", sortable: false, },
          { text: "Precio", align: "center", value: "sale", sortable: false, },
          { text: "Estadísticas", align: "center", value: "data-table-expand", sortable: false, }
        ],
        products: [],
      }
    };
  },
  computed:{
    ...mapState(['vuexConcepts','vuexConceptSales','vuexInvoices','vuexGroups','vuexSubGroups','vuexWeeklySales','inventoryUpdated']),
  },
  methods: {
    //este bloque de codigo es un copy-paste para animacion al expandir un row en datatable
    getItemId (item) {
      return item.id // Must be uid of record (would be nice if v-data-table exposed a "getItemKey" method)
    },

    toggleExpand (props) {
      const item = props.item
      const id = this.getItemId(item)
      if (props.isExpanded && this.transitioned[id]) {
        // If we're expanded and not in the process of closing, close
        this.closeExpand(item)
      } else {
        // If we're closed or in the process of closing, expand
        // Stop us from closing if a close transition was started
        clearTimeout(this.closeTimeouts[id])
        // Tell v-data-table to add the expansion content for the item
        props.expand(true)
        // Show expansion content with transition animation after it's had time to get added to the DOM
        this.$nextTick(() => this.$set(this.transitioned, id, true))
        // Hide all other expanded items if single-expand
        if (this.singleExpand) this.$nextTick(() => this.expanded.forEach(i => i !== item && this.closeExpand(i)))
      }
    },

    closeExpand (item) {
      const id = this.getItemId(item)
      // Mark that this item is in the process of closing
      this.$set(this.transitioned, id, false)
      // Remove expansion content from DOM after transition animation has had enough time to finish
      this.closeTimeouts[id] = setTimeout(() => this.$refs.Inventario.expand(item, false), 600)
    },

    //-------------------------------------------------
    // este metodo solo abre la caja al lado de los products
    // @param concepto
    // configura la variable concepto.toggle = true/false para el cambio

    open(item){
      //este metodo abre la pestaña más detalles de cada producto.
      if(typeof item !== 'undefined'){
        if (item === null){
          this.table.products.map(p => p.icon.toggled = p.icon.toggled ? !p.icon.toggled : p.icon.toggled);
          this.dialog = false;
        }else{
          item.icon.toggled = !item.icon.toggled;
          this.selectedItem = item;
          this.dialog = true;
        }
      }
    },

    //este metodo procesa una cantidad especifica de conceptos por cada página
    //dependiendo del número de página se calcula desde donde empieza a leer el arreglo general
    //para empezar a calcular los reportes.

    async paginate(page) {
      this.loading = true;
      //esta seccion determinar las posiciones del arreglo general que se tomarán mas adelante, un limite inferior y uno superior
      if (page === 1) this.table.dataOffset = 0;
      else if (page > this.table.page_old)
        this.table.dataOffset += Math.abs(page - this.table.page_old) === 0 ? this.table.itemsPerPage : Math.abs(page - this.table.page_old) * this.table.itemsPerPage;
      else if (page < this.table.page_old)
        this.table.dataOffset -= Math.abs(page - this.table.page_old) === 0 ? this.table.itemsPerPage : Math.abs(page - this.table.page_old) * this.table.itemsPerPage;
      //limpiamos los datos
      this.table.products = [];
      //guardamos un historial de la página anterior para mayor precision al paginar.
      this.table.page_old = page;
      //si hay datos filtrados entonces se utiliza ese arreglo, sino, se usa el arreglo general
      if (this.grupo === "" && this.subgrupo === ""){
         await this.getConcept((this.search !== ""), this.search, this.apiConcepts.data.data);
      }else{
        await this.getConcept((this.search !== ""), this.search, this.$data.filteredConcepts);
      }
    },
  
    /* ----------------------------
      Diseñado para configurar:
        -- Demanda Diaria
        -- Rotación de Stock (50%)
        -- Devoluciones
        -- Reclamos??
    */

   //PARA PRUEBAS USAR moment('2019/10/29') o cualquier fecha inferior
    async configMovements(product){
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
    },

    /* ----------------------------
      Diseñado para configurar:
        -- Inventario
        -- Días de Inventario
        -- Rotación de Stock (50%)
        -- Rentabilidad
    */

    async configStockDays(product) {
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
      product.stock_costs = reports.chart__donut([+product.sale, +product.cost], "Beneficios del", ["Precio", "Costo"], null, "benefits");
      product.stock_rotation = reports.chart__donut([product.sold, product.stock + product.sold], "Rotación del", ["Consumo", "Existencias"]);
      
      //esto da formato de BSF + Precio (formato español -> Bs1.000,00)
      product.sale = accounting.formatMoney(+product.sale, { symbol   : "$", thousand : ".", decimal  : ",", });
      return product;
    },

    /*
      consultas de api anteriores: @param limit="?offset=" + this.table.dataOffset + "&limit=" + this.table.itemsPerPage
    */

    getConcept: _.debounce(async function(search = false, input = "", pConcept = null) {
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
              stock: concept.existencias.length > 0 ? concept.existencias.map(a => Math.trunc(+a.existencia)).reduce((a,b) => a+b) : concept.existencias > 0 ? concept.existencias : 0,
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
    },555),
    
    async createInventory(){
      //se piden las facturas de hoy, y de 6 dias anteriores a este para poder calcular las ventas de X producto en la seman
        this.weeklySales = this.vuexWeeklySales;
        this.apiConcepts = this.vuexConcepts;
        this.apiConceptSales = this.vuexConceptSales;
        this.apiInvoices = this.vuexInvoices;
        this.apiGroups = this.vuexGroups;
        this.apiGroups = this.apiGroups.data.data;
        this.$data.apiSubGroups = this.vuexSubGroups;
        this.$data.apiSubGroups = this.apiSubGroups.data.data;
        //se crea un arreglo con objectos personalizados de grupos para poder filtrar los subgrupos pertenecientes al mas adelante
        for (let group of this.$data.apiGroups){
          // si result contiene datos, entonces el grupo tiene subgrupos (hasSubGroups)
          let result = this.$data.apiSubGroups.filter(asg => asg.grupos_id === group.id || asg.adm_grupos_id === group.id);
          let hasSubGroups = true;
          if(result.length === 0){
            hasSubGroups = false;
          }
          this.$data.grupos.push({text: group.nombre, value: {id: group.id, name: group.nombre, hasSub: hasSubGroups} })
        }
        if(typeof this.$route.params.id !== 'undefined' && this.$route.name === 'concepto'){
          this.search = this.$route.params.nombre;
          this.goSearch = !this.goSearch;
        }else{
          this.$data.table.totalConceptos = this.apiConcepts.data.totalCount;
          await this.getConcept(false,"",this.apiConcepts.data.data);
        }
    }
  },

  watch: {
    search: async function(after){
      if(after == "" && this.$route.name === 'concepto')
        this.$router.push('/Inventario');
      if (this.grupo === "" && this.grupo === ""){
        if(this.search === "" && this.filteredConcepts.length > 0){
          this.table.products = [];
          this.loading = true;
          this.getConcept(false, after,  this.apiConcepts.data.data);
          this.table.totalConceptos = this.apiConcepts.data.totalCount;
        }else
          return;
      }else if (this.grupo !== "" || this.grupo !== ""){
        if(this.search === ""){
          this.loading = true;
          this.table.products = [];
          if(this.subgrupo !== ""){
            this.filteredConcepts = ((this.search === "" ) ? this.apiConcepts.data.data : this.filteredConcepts).filter(c => c.subgrupos_id === this.subgrupo.id || c.adm_subgrupos_id === this.subgrupo.id);
          }else if(this.grupo !== ""){
            this.filteredConcepts = ((this.search === "") ? this.apiConcepts.data.data : this.filteredConcepts).filter(c => c.grupos_id === this.grupo.id || c.adm_grupos_id === this.grupo.id);
          }
          this.table.totalConceptos = this.filteredConcepts.length; 
          await this.getConcept(false, after,  this.filteredConcepts);
        }else
          return;
      }else
        return;
    },

    goSearch: _.debounce(async function () {
      //watch se activa cuando presionas enter en el text input de busqueda
      this.loading = true;
      this.table.products = [];
      this.table.page = 1;
      this.table.page_old = 1;
      this.table.dataOffset = 0;
      await this.getConcept(true,this.search, (this.grupo !== "" || this.subgrupo !== "") ? this.filteredConcepts : this.apiConcepts.data.data);
    },555),

    singleExpand (v) {
      if (!v) return
      // Single expand enabled. Hide all but the first expanded item
      this.expanded.forEach((item, i) => {
        if (i > 0) this.closeExpand(item)
      })
    },

    grupo: _.debounce(function() {
      //los watchers a veces pueden caer en bucles, es por ello que cuando se limpia la variable es necesaria una
      //condición que nos saque del procedimiento.
      if (this.grupo === "") return;
      this.table.page = 1;
      this.table.page_old = 1;
      this.table.dataOffset = 0;
      this.search = "";
      this.loading = true;
      this.subgrupos = [];
      this.table.products = [];
      //existen conceptos con subgrupos_id = null, esta categoría las engloba para que no se pierdan
      //durante el filtrado
      this.subgrupos.push({text: 'Indefinidos', value: {id: null, name: '-', hasSub: true} })
      //al seleccionar un grupo es necesario filtrar los subgrupos pertenecientes a el
      let aux = this.apiSubGroups.filter(e => e.grupos_id === this.grupo.id || e.adm_grupos_id === this.grupo.id);
      //se puede dar el caso de que el grupo no tenga subgrupos, por eso es necesario hacer la verificación
      if (typeof aux !== 'undefined') aux.forEach(asp => this.subgrupos.push({text: asp.nombre, value: {id: asp.id, name: asp.nombre} }));
      else this.subNoData = (this.grupo.hasSub)?'Seleccione un «Grupo» primero.':'El grupo «'+this.grupo.name+'» no contiene Sub-Grupos.'
      //el usuario puede haber habilitado una busqueda antes de seleccionar un grupo, por ello se verifica si es cierto
      //para así poder saber si filtrar el arreglo general o el arreglo previamente filtrado por la busqueda anterior
      this.filteredConcepts = ((this.search === "") ? this.apiConcepts.data.data : this.filteredConcepts).filter(c => c.grupos_id === this.grupo.id || c.adm_grupos_id === this.grupo.id);
      this.table.totalConceptos = Math.ceil(this.filteredConcepts.length);
      this.table.pageCount = Math.ceil(this.table.totalConceptos / this.table.itemsPerPage);
      this.getConcept(false,this.search,this.filteredConcepts, (this.search === ""));
    },555),

    subgrupo: _.debounce(function() {
      //los watchers a veces pueden caer en bucles, es por ello que cuando se limpia la variable es necesaria una
      //condición que nos saque del procedimiento.
      if (this.subgrupo === "") return;
      this.table.page = 1;
      this.table.page_old = 1;
      this.table.dataOffset = 0;
      this.search = "";
      this.loading = true;
      this.table.products = [];
      //el usuario puede haber habilitado una busqueda antes de seleccionar un subgrupo, por ello se verifica si es cierto
      //para así poder saber si filtrar el arreglo general o el arreglo previamente filtrado por la busqueda anterior
      this.filteredConcepts = ((this.search === "" ) ? this.apiConcepts.data.data : this.filteredConcepts).filter(c => (c.subgrupos_id === this.subgrupo.id || c.adm_subgrupos_id === this.subgrupo.id) && (c.grupos_id === this.grupo.id || c.adm_grupos_id === this.grupo.id));
      this.table.totalConceptos = Math.ceil(this.filteredConcepts.length);
      this.table.pageCount = Math.ceil(this.table.totalConceptos / this.table.itemsPerPage);
      this.getConcept(false,this.search,this.filteredConcepts,(this.search === ""));
    },555),

    clear: _.debounce(async function(){
      //los watchers a veces pueden caer en bucles, es por ello que cuando se limpia la variable es necesaria una
      //condición que nos saque del procedimiento.
      if(this.$route.name === 'concepto')
        this.$router.push('/Inventario');
      if (this.search === "" && this.grupo === "" && this.subgrupo === "") return;
      this.table.products = [];
      this.loading = true;
      this.search = "";
      this.grupo = "";
      this.subgrupo = "";
      this.table.page = 1;
      this.apiConcepts = this.vuexConcepts;
      this.table.totalConceptos = this.apiConcepts.data.totalCount;
      await this.getConcept(false,"",this.apiConcepts.data.data);
    },555),
    vuexConcepts(){
      this.apiConcepts = this.vuexConcepts;
    },
    vuexConceptSales(){
      this.$data.apiConceptSales = this.vuexConceptSales;
    },
    vuexInvoices(){
      this.$data.apiInvoices = this.vuexInvoices;
    },
    vuexGroups(){
      this.$data.apiGroups = this.vuexGroups;
      this.$data.apiGroups =  this.apiGroups.data.data;
    },
    vuexSubGroups(){
      this.$data.apiSubGroups = this.vuexSubGroups;
      this.$data.apiSubGroups = this.apiSubGroups.data.data;
    },
    inventoryUpdated(){
      this.createInventory();
    }
  },

  async beforeMount() {
    try {
      //llamadas a la api
      if(this.inventoryUpdated){
        this.createInventory();
      }
     } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style lang="scss">
a {
  text-decoration: none;
}

.charts {
  margin-top: 74px;
}

.v-data-table__mobile-row__cell {
  color: #0d47a1;
  font-weight: 500;
}

.absolute-center {
  margin-top: 8px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: calc(100% - 16px);

  @media screen and (max-width: 480px) {
    display: none;
  }
}
.primary {
  background-color: #1867c0 !important;
  border-color: #1867c0 !important;
}

thead.v-data-table-header-mobile{
  display:none;
}

.loadState{
  z-index:0;
  position:relative;

  @media screen and (max-width: 600px) {
    margin-top:-25px!important;
    width: 100%!important;
  }

  @media screen and (min-width: 600px) and (max-width: 960px) {
    margin-top:-35px;
    width: 70%!important;
  }

  @media screen and (min-width:960px) {
    margin-top:-45px;
    width: 60%!important;
  }
}

.v-dialog:not(.v-dialog--fullscreen) {

  width: auto;

  @media screen and (max-width: 600px) {
    width: 300px!important;
  }

  @media screen and (min-width: 600px) and (max-width: 1904px) {
    width: 450px!important;
  }

  @media screen and (min-width: 1904px){
    width: 700px!important;
  }
}

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-out .5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  25% {
    transform:scale(1);
  }
  50% {
    transform:scale(1.5);
  }
  75% {
    transform: scale(1);
  }
  100% {
    transform:scale(1);
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.25);
  }
  50% {
    transform: scale(1.5);
  }
  75% {
    transform: scale(.75);
  }
  100% {
    transform: scale(0);
  }
}

</style>
