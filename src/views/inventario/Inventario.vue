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
                  <td :colspan="headers.length" :class="{'ma-0 pa-0': true, 'expanded-closing': !transitioned[getItemId(item)]}" style="height: auto;">
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
                                    <v-divider inset vertical class="absolute-center"></v-divider>
                                    <!--linea de gráficos para DEVOLUCIONES DEL CONCEPTO-->
                                    <chart type="Devoluciones" :item="item" :options="item.stock_devolution" ctype="donut" height="298" wait=2 />
                                </v-row>
                                <v-divider inset></v-divider>
                                <v-row style="position:relative;margin:0;">
                                    <!--linea de gráficos para DÍAS DE INVENTARIO-->
                                    <chart type="Agotamiento" :item="item" :options="item.stock_days" ctype="area" height="251" wait=2.5 />
                                    <v-divider inset vertical class="absolute-center"></v-divider>
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
        <concept :dialog="dialog" :selectedItem="selectedItem"> 
            <template v-slot:close>
                <v-btn icon @click="open(null)" style="position:absolute;right:0;z-index:1;"><v-icon>close</v-icon></v-btn>
            </template>
        </concept>
    </div>
  </div>
</template>

<script>
import chart from "@/components/inventario/Chart"
import conceptDialog from '@/components/inventario/Concepto'
import accounting from 'accounting';
import _ from 'lodash';
import expandibles from '@/plugins/inventario/expandibles';
import inventario from '@/plugins/inventario/inventario';
import watchers from '@/plugins/inventario/watchers';
import {mapState} from 'vuex';

export default {
  name: "inventario",
  components: {
        chart: chart,
        concept: conceptDialog,
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
     //VISTA LA CARPETA @/PLUGINS/INVENTARIO
    ...expandibles,
    ...inventario,
    //EXTRAEMOS 8 CONCEPTOS ANALIZADOS PARA MOSTRAR EN LA TABLA
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
                await this.configData(
                    {
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
                    }
                )
            );
        }
        this.table.products = aux.sort((a, b) => a.id + b.id);   
        this.loading = false;
    },555),
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
                this.selectedItem.sold = accounting.formatMoney(this.selectedItem.sold,{symbol:'',thousand:'.',decimal:','}).split(',')[0];
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
            await this.getConcept((this.search !== ""), this.search, this.filteredConcepts);
        }
    },
    async createInventory(){
      //se piden las facturas de hoy, y de 6 dias anteriores a este para poder calcular las ventas de X producto en la seman
        this.weeklySales = this.vuexWeeklySales;
        this.apiConcepts = this.vuexConcepts;
        this.apiConceptSales = this.vuexConceptSales;
        this.apiInvoices = this.vuexInvoices;
        this.apiGroups = this.vuexGroups;
        this.apiGroups = this.apiGroups.data.data;
        this.apiSubGroups = this.vuexSubGroups;
        this.apiSubGroups = this.apiSubGroups.data.data;
        //se crea un arreglo con objectos personalizados de grupos para poder filtrar los subgrupos pertenecientes al mas adelante
        for (let group of this.apiGroups){
            // si result contiene datos, entonces el grupo tiene subgrupos (hasSubGroups)
            let result = this.apiSubGroups.filter(asg => asg.grupos_id === group.id || asg.adm_grupos_id === group.id);
            let hasSubGroups = true;
            if(result.length === 0){
                hasSubGroups = false;
            }
            this.grupos.push({text: group.nombre, value: {id: group.id, name: group.nombre, hasSub: hasSubGroups} })
        }
        if(typeof this.$route.params.id !== 'undefined' && this.$route.name === 'concepto'){
            this.search = this.$route.params.nombre;
            this.goSearch = !this.goSearch;
        }else{
            this.table.totalConceptos = this.apiConcepts.data.totalCount;
            await this.getConcept(false,"",this.apiConcepts.data.data);
        }
    }
  },

  watch: {
    //VISTA LA CARPETA @/PLUGINS/INVENTARIO
    ...watchers,

    vuexConcepts(){
        this.apiConcepts = this.vuexConcepts;
    },
    vuexConceptSales(){
        this.apiConceptSales = this.vuexConceptSales;
    },
    vuexInvoices(){
        this.apiInvoices = this.vuexInvoices;
    },
    vuexGroups(){
        this.apiGroups = this.vuexGroups;
        this.apiGroups =  this.apiGroups.data.data;
    },
    vuexSubGroups(){
        this.apiSubGroups = this.vuexSubGroups;
        this.apiSubGroups = this.apiSubGroups.data.data;
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
