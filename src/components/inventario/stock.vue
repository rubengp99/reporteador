<template>
    <div style="height:100%">
        <v-card style="height:100%">
            <v-card-title class="title" style="word-break:normal;">
                <v-spacer></v-spacer>
                {{ title }}          
                <v-spacer></v-spacer>
            </v-card-title>
            <v-row style="padding:0 20px;">
            <!-- Barra de busqueda por nombre -->
                <v-col cols="12" sm="4">
                    <v-autocomplete
                        :items="apiConcepts.data.data"
                        :search-input.sync="search"
                        hide-no-data
                        hide-selected
                        item-text="nombre"
                        item-value="nombre"
                        return-object
                        :append-icon="search === '' ? 'search' : 'close'"
                        label="Nombre"
                        outlined
                        hide-details
                        dense
                        :disabled="loading"
                        style="height:39px;"
                        @keypress.enter="goSearch = !goSearch"
                        @click:append="search = ''"
                        @change="goSearch = !goSearch"
                        :loading="loading"
                    ></v-autocomplete>
                   
                </v-col>
                <!-- Select de Grupos -->
                <v-col cols="6" sm="4">
                    <v-select
                        v-model="grupo"
                        :items="grupos"
                        label="Grupo"
                        outlined
                        dense
                        :disabled="loading"
                        style="height:39px;"
                        :loading="loading"
                        menu-props="offset-y"
                    ></v-select>
                </v-col>
                <!-- Select de Subgrupos -->
                <v-col cols="6" sm="4">
                    <v-select
                        v-model="subgrupo"
                        :items="subgrupos"
                        label="Sub-Grupo"
                        outlined
                        dense
                        :disabled="loading"
                        :no-data-text="subNoData"
                        style="height:39px;"
                        :loading="loading"
                        menu-props="offset-y"
                    ></v-select>
                </v-col>
                <!-- Select de Monedas -->
                <coinType hideTitle/>
                <!-- Limpiar filtros -->
                <v-col cols="12" sm="2">
                    <v-btn style="height:39px;" :loading="loading" outlined dense color="error" @click="clear = !clear" :disabled="loading">
                        <p style="margin:0">Limpiar Filtros </p>
                        <v-icon>mdi-autorenew</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <!-- Tabla com los conceptos -->
            <v-data-table
                ref="Inventario"
                calculate-widths
                :loading="loading && '#01579B'"
                :headers=" isExistencia ? headers : table.headers.filter(i => i.text !== (moneda === '$' ? 'Precio (Bs)' : 'Precio ($)'))"
                :items="table.concepts"
                :search="table.search"
                :single-expand="table.expand"
                :expanded.sync="table.expanded"
                item-key="id"
                :show-expand="!isExistencia"
                :sort-by.sync="table.sortBy"
                :sort-desc.sync="table.sortDesc"
                :page.sync="table.page"
                :items-per-page="table.itemsPerPage"
                :server-items-length="table.totalConceptos"
                hide-default-footer
                class="elevation-1 fixed-header"
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

                 <!-- formatting de precio -->
                <template v-slot:item.precioDollar="{ item }">
                    <span>
                        {{ formatMoney(item.precioDollar,{symbol: moneda, thousand: '.', decimal:'.' }) }}
                    </span>
                </template>

                <template v-slot:item.precioBolivar="{ item }">
                    <span>
                        {{ formatMoney(item.precioBolivar,{symbol: moneda, thousand: '.', decimal:'.' }) }}
                    </span>
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
                        <!-- aqui van los graficos -->
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
                                        <chart type="Rentabilidad" :item="item" :options="moneda === '$' ? item.stock_costs_dollar : item.stock_costs_bolivar" ctype="donut" height="298" wait=3 />
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
                <!-- Paginacion -->
                <template v-slot:footer>
                    <div class="text-center" style="padding: 10px;" >
                        <v-pagination v-model="table.page" :length="table.pageCount" :totalItems="table.totalConceptos" light :disabled="loading" style="padding: 0 20px;"></v-pagination>
                    </div>
                </template>
            </v-data-table>
        </v-card>

        <!-- Pestaña de más detalles (MODAL) -->
        <concept :dialog="dialog" :selectedItem="selectedItem"> 
            <template v-slot:close>
                <v-btn icon @click="open(null)" style="position:absolute;right:0;z-index:1;"><v-icon>close</v-icon></v-btn>
            </template>
        </concept>
    </div>
</template>

<script>
import concept from '@/components/inventario/Concepto';
import chart from '@/components/inventario/Chart';
import expands from "@/plugins/inventario/expandibles";
import monedas from '@/plugins/monedas';
import inventario from '@/plugins/inventario/inventario';
import data from "@/plugins/inventario/data";
import coinType from '@/components/aplicacion/coinSelector'
import watchers from "@/plugins/inventario/watchers";
import { formatMoney  } from 'accounting'
import { mapState } from 'vuex';

export default {
    components:{
        concept,
        coinType,
        chart
    },
    props:{
        title:{
            type: String,
            default: ""
        },
        headers:{
            type: Array,
            default: function() { return [] } 
        },
        isExistencia:{
            type: Boolean,
            default:false
        },
        concepts:{
            type: Array,
            default: function() { return [] } 
        }
    },
    methods:{
        ...inventario,
        ...expands,
        formatMoney
    },
    data(){
        return{
            ...data,
            dialog:false,
            ...monedas,
        }
    },
    watch:{
        //VISTA LA CARPETA @/PLUGINS/INVENTARIO
        ...watchers,

        vuexConcepts(){
            if (this.isExistencia) return;
            this.apiConcepts = this.vuexConcepts;
        },
        vuexConceptReturns(){
            this.apiConceptReturns = this.vuexConceptReturns;
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
    computed:{
        ...mapState(['vuexConceptReturns','vuexConcepts','vuexConceptSales','vuexInvoices','vuexGroups','vuexSubGroups','vuexWeeklySales','inventoryUpdated']),
    },
    async beforeMount(){
        if(this.inventoryUpdated){
            this.createInventory();
        }
    }
}
</script>