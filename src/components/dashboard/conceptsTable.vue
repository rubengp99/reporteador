<template>
    <v-row justify="center" >
        <v-dialog v-if="show" v-model="show" persistent content-class="overflow-x-hidden stock">
            <v-card>
                <v-row style="padding:0 20px;">
                    <slot name="close"></slot>
                    <v-col cols="12">
                        <v-card-title style="word-break:normal;" class="title">
                            <v-spacer></v-spacer>
                            Conceptos con Existencia {{existencia}}
                            <v-spacer></v-spacer>
                        </v-card-title>
                    </v-col>
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
                <v-data-table
                    :loading="loading && '#01579B'"
                    :headers="headers"
                    :items="table.concepts"
                    :search="table.search"
                    item-key="id"
                    :sort-by.sync="table.sortBy"
                    :sort-desc.sync="table.sortDesc"
                    :page.sync="table.page"
                    :items-per-page="table.itemsPerPage"
                    :server-items-length="table.totalConceptos"
                    hide-default-footer
                    class="elevation-1"
                    @update:page="paginate"
                    @page-count="table.pageCount = $event">
                >
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

                    <template v-slot:item.stockMin="{ item }">
                        {{ Math.trunc(item.stockMin)}}
                    </template>

                    <template v-slot:item.stockMax="{ item }">
                        {{ Math.trunc(item.stockMax)}}
                    </template>

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
        </v-dialog>
    </v-row>
</template>


<script>
import inventario from '@/plugins/inventario/inventario';
import watchers  from '@/plugins/inventario/watchers';
import inventarioData from '@/plugins/inventario/data';
import conceptDialog from '@/components/inventario/Concepto'
import {mapState} from 'vuex';

export default {
    components:{
        concept: conceptDialog
    },
    props: {
        concepts: Array,
        show:{
            type:Boolean,
            default: false,
        },
        existencia:{
            type:String,
            default: '',
        }
    },
    data() {
        return {
            ...inventarioData,
            loading: true,
            dialog:false,
            headers:[],
        };
    },
    computed:{
        ...mapState(['vuexConceptReturns','vuexConcepts','vuexConceptSales','vuexInvoices','vuexGroups','vuexSubGroups','vuexWeeklySales','inventoryUpdated']),
    },
    methods:{
        ...inventario,
        getExistencias(concept){
            return (Array.isArray(concept.existencias) ? concept.existencias.length > 0 ? concept.existencias.map(a => Math.trunc(+a.existencia)).reduce((a,b) => a+b) : 0 : concept.existencias);
        },
        async createListado(){
            console.log(this.concepts.length);
            this.weeklySales = this.vuexWeeklySales;
            this.apiConceptReturns = this.vuexConceptReturns;
            this.apiConcepts = Object.assign({},{
                totalCount: this.concepts.length,
                data:{
                    data: this.concepts,
                }
            });
            this.apiConcepts.data.totalCount = this.concepts.length;
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

            this.table.totalConceptos = this.apiConcepts.data.totalCount;
            await this.getConcept(false, "", this.apiConcepts.data.data);
            this.loading = false;
        }
    },
    watch:{
        ...watchers,
        concepts(){
            this.apiConcepts.data.data = this.concepts;
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
            this.createListado();
        }
    },
    async beforeMount(){
        this.headers = [
            { text: "Más Detalles", align: "center", sortable: false, value: "image" },
            { text: "Código", align: "center", value: "codigo", sortable: false, },
            { text: "Producto", align: "center", value: "name", sortable: false, },
            { text: "Grupo", align: "center", value: "category.name", sortable: false, },
            { text: "Sub-Grupo", align: "center", value: "subCategory.name", sortable: false, },
            { text: 'Existencia '+this.$props.existencia, align: "center", value: this.$props.existencia === 'Mínima' ? 'stockMin' : 'stockMax', sortable: false, },
            { text: "Existencia", align: "center", value: "stock", sortable: false, },            
        ];

        try {
        //llamadas a la api
            if(this.inventoryUpdated){
                this.createListado();
            }
        } catch (e) {
            console.log(e);
        }
    },
    beforeUpdate(){
        this.table.totalConceptos = this.concepts.length;
    }
};
</script>