<template>
  <div class="home">
    <div class="charts">
      <v-row data-app style="padding:0 2.5vw;">
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                  Reportes Estadísticos del Inventario
                <v-spacer></v-spacer>
              </v-card-title>
              <v-row style="padding:0 20px;">
                <v-col cols="12" sm="5">
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Nombre"
                    outlined
                    hide-details
                    dense
                    style="height:39px;"
                ></v-text-field>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-select
                    v-model="grupo"
                    :items="grupos"
                    label="Grupo"
                    outlined
                    dense
                    style="height:39px;"
                  ></v-select>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-select
                    v-model="subgrupo"
                    :items="subgrupos"
                    label="Sub-Grupo"
                    outlined
                    dense
                    :no-data-text="subNoData"
                    style="height:39px;"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="1">
                  <v-btn style="height:39px;" outlined dense color="error" @click="clear = !clear">
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
                :loading="table.loading && '#01579B'"
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
                <template slot="loading">
                  <p class="body-1" style="margin-top:20px;color:#0d0d0d!important;z-index:1;position:relative;">Procesando estadísticas...</p>
                  <v-spacer></v-spacer>
                  <!-- 
                    MONEDA CORRIENDO: https://i.pinimg.com/originals/90/04/b2/9004b278c6a1d58c9fdf4a1b05222127.gif
                    ALCANCIA CORRIENDO: https://i.pinimg.com/originals/d6/f4/c7/d6f4c75045b250de9761f4f68810424d.gif
                    LAPTOP: https://i.pinimg.com/originals/44/f0/02/44f002166db0c224c90703f18a659dae.gif
                  -->
                  <img :src="require('@/assets/loading.gif')" alt="" class="loadState">
                  <v-spacer></v-spacer>
                </template>
                <template slot="no-data">
                  <p class="body-1" style="margin-top:20px;color:#0d0d0d!important;">No se encontraron conceptos.</p>
                  <v-spacer></v-spacer>
                  <img :src="require('@/assets/noresults.svg')" alt="" width="400px" style="margin:20px 0;">
                  <v-spacer></v-spacer>
                </template>
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
                              <chart type="Rotación" :item="item" :options="item.stock_rotation" ctype="donut" height="298" />
                              <v-divider inset vertical class="absolute-center"></v-divider>
                              <chart type="Demanda" :item="item" :options="item.stock_demand" ctype="area" height="252"/>
                            </v-row>
                            <!--linea de gráficos para DIAS DE INVENTARIO-->
                            <v-divider inset></v-divider>
                            <v-row style="position:relative;margin:0;">
                              <chart type="Reclamos" :item="item" :options="item.stock_claims" ctype="donut" height="298" />
                              <v-divider
                                inset
                                vertical
                                class="absolute-center"
                              ></v-divider>
                              <chart type="Devoluciones" :item="item" :options="item.stock_devolution" ctype="donut" height="298" />
                            </v-row>
                            <v-divider inset></v-divider>
                            <v-row style="position:relative;margin:0;">
                              <chart type="Agotamiento" :item="item" :options="item.stock_days" ctype="area" height="251"/>
                              <v-divider
                                inset
                                vertical
                                class="absolute-center"
                              ></v-divider>
                              <chart type="Rentabilidad" :item="item" :options="item.stock_costs" ctype="donut" height="298"/>
                            </v-row>
                          </div>
                      </div>
                    </v-expand-transition>
                  </td>
                </template>
                <template v-slot:item.data-table-expand="props">
                  <v-icon
                    :class="{
                            'v-data-table__expand-icon': true,
                            'v-data-table__expand-icon--active': props.isExpanded && transitioned[getItemId(props.item)]
                            }"
                    @click="toggleExpand(props)"
                  >
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
                ></v-pagination>
              </div>
            </v-card>
          </v-col>
        </v-row>
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
            <v-list disabled style="margin-top:-30px;">
              <v-subheader style="color:black;" class="subtitle-1">Detalles de Existencias</v-subheader>
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item >
                    <v-list-item-content style="padding: 6px 0;width:50%">
                      <p class="caption mb-1" ><strong>Existencia mínima:</strong> {{ selectedItem.stockMin !== null ? selectedItem.stockMin : '---' }}</p>
                      <p class="caption" ><strong>Existencia máxima:</strong> {{ selectedItem.stockMax !== null ? selectedItem.stockMin : '---' }}</p>
                    </v-list-item-content>
                    <v-list-item-content style="padding: 6px 0;width:50%">
                      <p class="caption mb-1" ><strong>Referencia:</strong> {{ selectedItem.reference !== null ? selectedItem.reference : '---' }}</p>
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
import chart from "../components/Chart"
import moment from "moment";
import concept from "../services/Conceptos";
import invoices from "../services/Factura";
import groups from "../services/Grupos"
import subGroups from '../services/SubGrupos'
import accounting from 'accounting';
import _ from 'lodash';
import { mapState, mapGetters } from 'vuex'
import 'vue-head';
//import movements from "../services/Movimiento_deposito";
const reports = require("../plugins/reports");

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
    //omited
  },
  data() {
    return {
      stock: false,
      abc: false,
      sales: false,
      price: false,
      apiConcepts: null,
      apiConceptsAux: null,
      apiInvoices: null,
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
      grupos: [],
      subgrupos: [],
      grupo: "",
      subgrupo: "",
      search: "",
      grupoChanged: false,
      subgrupoChanged: false,
      transitioned: [],
      closeTimeouts: {},
      singleExpand: false,
      subNoData: 'Seleccione un «Grupo» primero.',
      filteredConcepts: [],
      clear: false,
      dialog: false,
      table: {
        loading: true,
        expanded: [],
        expand: false,
        //sortBy: ["name", "stock", "sold", "price"],
        //sortDesc: true,
        page: 1,
        page_old: 1,
        pageCount: 0,
        itemsPerPage: 8,
        dataOffset: 0,
        totalConceptos: 0,
        headers: [
          { text: "Más Detalles", align: "center", sortable: false, value: "image" },
          //{ text: "ID", align: "center", value: "id", sortable: false, },
          { text: "Código", align: "center", value: "codigo", sortable: false, },
          { text: "Producto", align: "center", value: "name", sortable: false, },
          { text: "Grupo", align: "center", value: "category.name", sortable: false, },
          { text: "Sub-Grupo", align: "center", value: "subCategory.name", sortable: false, },
          { text: "En Inventario", align: "center", value: "stock", sortable:false, },
          //{ text: "Vendidos", align: "center", value: "sold", sortable: false, },
          { text: "Precio", align: "center", value: "sale", sortable: false, },
          { text: "Estadísticas", align: "center", value: "data-table-expand", sortable: false, }
        ],
        products: [],
      }
    };
  },
  computed: {
    ...mapState(['loading']),
    ...mapGetters(['getStatebyIndex']),
  },
  methods: {
    //este bloque de codigo es un copy-paste para animacion al expandir un row en datatable
    getItemId (item) {
      return item.name // Must be uid of record (would be nice if v-data-table exposed a "getItemKey" method)
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
    filter(items, index, isDesc){
      console.log(items);
      console.log(index);
      console.log(isDesc);
      return 1;
    },
    // este metodo solo abre la caja al lado de los products
    // @param concepto
    // configura la variable concepto.toggle = true/false para el cambio
    open(item){
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
    //en caso de carga por paginación, no tocar si no es necesario
    async paginate(page) {
      this.table.loading = true;
      if (page === 1) this.table.dataOffset = 0;
      else if (page > this.table.page_old)
        this.table.dataOffset += Math.abs(page - this.table.page_old) === 0 ? 8 : Math.abs(page - this.table.page_old) * 8;
      else if (page < this.table.page_old)
        this.table.dataOffset -= Math.abs(page - this.table.page_old) === 0 ? 8 : Math.abs(page - this.table.page_old) * 8;
      this.table.products = [];
      this.table.page_old = page;
      if (this.grupo === "" && this.subgrupo === ""){
         await this.getConcept((this.search !== ""), this.search, this.$data.apiConcepts.data.data);
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
   //PARA PRUEBAS USAR moment('02/20/2020')
    async configMovements(product){
      let fechas = [];
      for (let i = 0; i < 7; i++) fechas.push(moment().locale('es').subtract(i,'days').format('MMM Do YYYY').charAt(0).toUpperCase() + moment().locale('es').subtract(i,'days').format('MMM Do YYYY').slice(1));
      fechas.reverse();
      let sales = [0,0,0,0,0,0,0];
      product.sold = await concept().get(product.id+'/sell?limit='+this.apiInvoices.data.totalCount);
      for(let i = 6; i === 0; i--) sales[i] = console.log(await concept().get(product.id+'/sell?limit='+this.apiInvoices.data.totalCount+'&fecha_at='+moment('2019-10-29').locale('es').subtract(i,'days').format('YYYY-MM-DD')))
      for(let i = 6; i === 0; i--) sales[i] = +Math.trunc(+sales[i].data.ventas)
      product.sold = +Math.trunc(+product.sold.data.ventas);
      //for (let invoice of this.apiInvoices.data.data){
        //product.sold = (typeof invoice.find(sold => sold.conceptos_id === product.id || sold.adm_conceptos_id === product.id) === 'object')?+Math.trunc(invoice.detalles.find(sold => sold.conceptos_id === product.id || sold.adm_conceptos_id === product.id).vendidos):0;
        //como la factura se devuelve completa, entonces se suman todas las existencias vendidas a devoluciones.
        //if (invoice.tipos_facturas_id === 3 || invoice.adm_tipos_facturas_id === 3) product.returned += (typeof invoice.detalles.find(detail => detail.conceptos_id === product.id || detail.adm_conceptos_id === product.id) === 'object')?+Math.trunc(invoice.detalles.find(detail => detail.conceptos_id === product.id  || detail.adm_conceptos_id === product.id).cantidad):0;
        product.stock_devolution = reports.chart__donut([product.returned, product.sold], "Devoluciones del", ["Devoluciones", "Compras"], ["#E91E63", "#3f72af"]);
        product.stock_claims = reports.chart__donut(
            [0, product.sold],
            "Reclamos del",             //esto corresponde a reclamos, aún no está hecho, 
            ["Reclamos", "Compras"],    //solo hay que cambiar el 0 por el Nº de reclamos
            ["#FFC107", "#3f72af"]
        );
        /*if (typeof fechas.find(date => date === moment(invoice.fecha_at).locale('es').format('MMM Do YYYY').charAt(0).toUpperCase() + moment(invoice.fecha_at).locale('es').format('MMM Do YYYY').slice(1)) !== 'undefined'){
          switch (moment(invoice.fecha_at).locale('es').format('MMM Do YYYY').charAt(0).toUpperCase() + moment(invoice.fecha_at).locale('es').format('MMM Do YYYY').slice(1)){
            case fechas[0]: sales[0]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id).cantidad);break;
            case fechas[1]: sales[1]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id).cantidad);break;
            case fechas[2]: sales[2]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id).cantidad);break;
            case fechas[3]: sales[3]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id).cantidad);break;
            case fechas[4]: sales[4]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id).cantidad);break;
            case fechas[5]: sales[5]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id).cantidad);break;
            case fechas[6]: sales[6]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id || detalle.adm_conceptos_id === product.id).cantidad);break;
          }
        }*/
      //}
      product.stock_daily_sells = sales;
      fechas = [];
      for (let i = 0; i < 7; i++) fechas.push(moment().locale('es').subtract(i,'days').format('MMM Do').charAt(0).toUpperCase() + moment().locale('es').subtract(i,'days').format('MMM Do').slice(1));
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
    async configStockDays(product,onlyData = false) {
      let existencias = await concept().get("/" + product.id + "/depositos");
      existencias.data.data.filter(a => (product.stock += +Math.trunc(a.existencia)));
      // esta condicion solo se usa para filtrar items, no es necesario calcular todo, solo se sacan los
      //datos esenciales
      if (onlyData){
        //esto da formato de BSF + Precio (formato español -> Bs1.000,00)
        product.sale = accounting.formatMoney(+product.sale, { symbol   : "Bs", thousand : ".", decimal  : ",", });
        return product;
      } 

      var stock_aux = product.stock;
      var stock_dates = [];
      if(product.stock_daily_sells.reduce((a, b) => a + b) > 0){
          do{
            stock_aux -= (Math.round((product.stock_daily_sells.reduce((a, b) => a + b) / 7) * 100 ) / 100);
            product.stock_end.push(Math.trunc(stock_aux));
            if (stock_aux < 0) break;
          }while (stock_aux > 0)  
        for (let i = 0; i < product.stock_end.length; i++) {
          stock_dates.push(
            moment().locale("es").add(i, "days").format("MMM Do YYYY").charAt(0).toUpperCase() + moment().locale("es").add(i, "days").format("MMM Do YYYY").slice(1)
          );
        }
        product.stock_lastDay = moment().locale("ES").add(stock_dates.length - 1, "days").format("LL");
      }else{
        for (let i = 0; i < 7; i++) {
          product.stock_end.push(stock_aux);
          stock_dates.push(moment().locale("es").add(i, "days").format("MMM Do").charAt(0).toUpperCase() + moment().locale("es").add(i, "days").format("MMM Do").slice(1));
        }
        product.stock_lastDay = '';
      }
      let stockEndAux = product.stock_end.length > 1000 ? product.stock_end.slice(product.stock_end.length/50,product.stock_end.length-1) : product.stock_end;
      let StockDatesAux = stock_dates.length > 1000 ? stock_dates.slice(product.stock_end.length/50,product.stock_end.length-1) : stock_dates;
      product.stock_days = reports.chart__area(stockEndAux, StockDatesAux, false,  "stockdays" );
      product.stock_costs = reports.chart__donut([Math.trunc(+product.sale), Math.trunc(+product.cost)], "Beneficios del", ["Precio", "Costo"], null, "benefits");
      product.stock_rotation = reports.chart__donut([product.sold, product.stock + product.sold], "Rotación del", ["Consumo", "Existencias"]);
      //esto da formato de BSF + Precio (formato español -> Bs1.000,00)
      product.sale = accounting.formatMoney(+product.sale, { symbol   : "Bs", thousand : ".", decimal  : ",", });
      return product;
    },
    /*
      consultas de api anteriores: @param limit="?offset=" + this.table.dataOffset + "&limit=" + this.table.itemsPerPage
    */
    getConcept: _.debounce(async function(search = false, input = "", pConcept = null) {
      //let index = []
      //let setCustomConcept = false;
      let aux = [];
      let apiConcepts = (pConcept.length > 8) ? 
        pConcept.slice(this.table.dataOffset, this.table.dataOffset + this.table.itemsPerPage) : pConcept;
      if (search && input !== ""){
        this.filteredConcepts = ((this.grupo !== "") ? apiConcepts : this.$data.apiConcepts.data.data)
          .filter(concept => concept.nombre.toLowerCase().includes(input.toLowerCase()));
        apiConcepts = this.filteredConcepts.slice(this.table.dataOffset, this.table.dataOffset + this.table.itemsPerPage);
        this.table.totalConceptos = ((this.grupo !== "") ? apiConcepts : this.$data.apiConcepts.data.data)
          .filter(concept => concept.nombre.toLowerCase().includes(input.toLowerCase())).length;
      }
     

      this.table.pageCount = Math.ceil(this.table.totalConceptos / this.table.itemsPerPage);
      
     /* for (const concept of apiConcepts) {
        if (typeof concept.fullData === 'undefined'){
          setCustomConcept = true;
          index.push(concept);
        }else if(concept.fullData === true){
          aux.push(concept);
        }
      }*/
      
      
      for(let concept of apiConcepts/*((setCustomConcept) ? index : apiConcepts)*/){
        aux.push(await this.configStockDays(await this.configMovements({
          fullData: true,
          image: concept.imagen,
          icon: {
            img: '/images/box.svg',
            toggled: false,
          },
          reference: concept.referencia,
          id: concept.id,
          codigo: concept.codigo,
          name: concept.nombre,
          stock: 0,
          sold: 0,
          stockMin: concept.existencia_minima,
          stockMax: concept.existencia_maxima,
          description: concept.descripcion,
          returned: 0,
          sale: +concept.precio_a,
          cost: +concept.ultimo_costo,
          category: {
            id: (typeof this.apiGroups.data.data.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id) !== 'undefined')?
                  this.apiGroups.data.data.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id).id:0,
            name: (typeof this.apiGroups.data.data.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id) !== 'undefined')?
                    this.apiGroups.data.data.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id).nombre:'-',
          },
          subCategory: {
            id: (typeof this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id) !== 'undefined')?
                  typeof this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0] !== 'undefined' ? this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0].id : 0 : 0,
            name: (typeof this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id) !== 'undefined')?
                    typeof this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0] !== 'undefined' ? this.apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0].nombre : '-' :'-'
          },
          price$: concept.precio_dolar,
          stock_daily_sells: [0,0,0,0,0,0],
          stock_end: [],
          stock_lastDay: "",
          stock_rotation: null,
          stock_demand: null,
          stock_devolution: null,
          stock_claims: null,
          stock_days: null,
          stock_costs: null,
        })));
      }

      //for (let i = this.table.dataOffset; i < this.table.dataOffset + this.table.itemsPerPage; i++) this.apiConcepts.data.data[i] = aux[i]
      this.table.products = aux.sort((a, b) => a.id - b.id);
      this.table.loading = false;
    },333), 
  },
  watch: {
    search: function (input) {
      this.table.loading = true;
      if (this.grupo !== "" && input === "" || this.subgrupo !== "" && input === "") return;
      
      if (input === ""){
        this.getConcept(false, input,  this.apiConcepts.data.data);
        return;
      }
      this.table.page = 1;
      this.table.page_old = 1;
      this.table.dataOffset = 0;
      this.getConcept(true,input, this.$data.apiConcepts.data.data);
    },
    singleExpand (v) {
      if (!v) return
      // Single expand enabled. Hide all but the first expanded item
      this.expanded.forEach((item, i) => {
        if (i > 0) this.closeExpand(item)
      })
    },
    grupo: function() {
      this.table.page = 1;
      this.table.page_old = 1;
      this.table.dataOffset = 0;
      this.search = "";
      if (this.grupo === "") return;
      this.table.loading = true;
      this.subgrupos = [];
      let aux = this.apiSubGroups.filter(e => e.grupos_id === this.grupo.id || e.adm_grupos_id === this.grupo.id);
      if (typeof aux !== 'undefined') aux.forEach(asp => this.subgrupos.push({text: asp.nombre, value: {id: asp.id, name: asp.nombre} }));
      else this.subNoData = (this.grupo.hasSub)?'Seleccione un «Grupo» primero.':'El grupo «'+this.grupo.name+'» no contiene Sub-Grupos.'
      this.filteredConcepts = ((this.search === "") ? this.$data.apiConcepts.data.data : this.filteredConcepts).filter(c => c.grupos_id === this.grupo.id || c.adm_grupos_id === this.grupo.id);
      this.table.totalConceptos = Math.ceil(this.filteredConcepts.length);
      this.table.pageCount = Math.ceil(this.table.totalConceptos / this.table.itemsPerPage);
      this.getConcept(false,this.search,this.filteredConcepts, (this.search === ""));
    },
    subgrupo: function() {
      this.table.page = 1;
      this.table.page_old = 1;
      this.table.dataOffset = 0;
      this.search = "";
      this.table.loading = true;
      this.filteredConcepts = ((this.search === "" ) ? this.$data.apiConcepts.data.data : this.filteredConcepts).filter(c => c.subgrupos_id === this.subgrupo.id || c.adm_subgrupos_id === this.subgrupo.id);
      this.table.totalConceptos = Math.ceil(this.filteredConcepts.length);
      this.table.pageCount = Math.ceil(this.table.totalConceptos / this.table.itemsPerPage);
      this.getConcept(false,this.search,this.filteredConcepts,(this.search === ""));
    },
    clear: function(){
      this.table.products = [];
      this.table.loading = true;
      this.search = "";
      this.grupo = "";
      this.subgrupo = "";
      this.table.page = 1;
      this.table.totalConceptos = this.apiConcepts.data.totalCount;
      this.getConcept(false,"",this.apiConcepts.data.data);
    },
  },
  async beforeMount() {
    this.$data.apiConcepts = await concept().get('?limit=1');
    this.$data.apiConcepts = await concept().get('?limit='+this.$data.apiConcepts.data.totalCount);
    //this.$data.apiSales = await concept().get('/mostSold?limit='+this.$data.apiConcepts.data.totalCount);
    this.$data.apiInvoices = await invoices().get('?limit=1');
    this.$data.apiGroups = await groups().get();
    this.$data.apiGroups = await groups().get('?limit='+this.$data.apiGroups.data.totalCount);
    this.$data.apiSubGroups = await subGroups().get('?limit=1');
    this.$data.apiSubGroups = await subGroups().get('?limit='+this.$data.apiSubGroups.data.totalCount);
    this.$data.apiSubGroups = this.$data.apiSubGroups.data.data;

    for (let group of this.$data.apiGroups.data.data){
      let result = this.$data.apiSubGroups.filter(asg => asg.grupos_id === group.id || asg.adm_grupos_id === group.id);
      let hasSubGroups = true;
      if(result.length === 0){
        hasSubGroups = false;
      }
      this.$data.grupos.push({text: group.nombre, value: {id: group.id, name: group.nombre, hasSub: hasSubGroups} })
    }
    /*for (let group of this.$data.apiGroups.data.data){
      let hasSubGroups = true;
      let promise = null;
      try {
        promise = await groups().get(group.id+'/subgrupos');
      } catch (error) {
        null;
      }
      if (typeof promise.data !== 'string') promise.data.data.forEach(p => this.$data.apiSubGroups.push(p));
      else hasSubGroups = false;
      this.$data.grupos.push({text: group.nombre, value: {id: group.id, name: group.nombre, hasSub: hasSubGroups} })
    }*/
    this.$data.table.totalConceptos = this.$data.apiConcepts.data.totalCount;
    await this.getConcept(false,"",this.$data.apiConcepts.data.data); 
    
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

  @media screen and (min-width: 600px) and (max-width: 960px) {
    width: 500px!important;
  }

  @media screen and (min-width: 960px) and (max-width: 1264px) {
    width: 600px!important;
  }

  @media screen and (min-width: 1264px) and (max-width: 1904px) {
    width: 700px!important;
  }

  @media screen and (min-width: 1904px){
    width: 800px!important;
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
