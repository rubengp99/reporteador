<template>
    <v-col cols="12">
        <v-card class="mx-auto" max-width="100vw" style="padding: 15px 25px;" :outlined="loading">
            <v-card-title class="title" style="padding:5px;">
                <v-spacer></v-spacer>
                Ranking de Ventas
                <v-spacer></v-spacer>
            </v-card-title>
            <v-row>
                <v-col cols="12" sm="4">
                    <v-autocomplete
                        :items="ranking"
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
                        @click:append="search = ''"
                    ></v-autocomplete>                              
                </v-col>
                <v-col cols="12" sm="3">
                    <v-menu :close-on-content-click="false" transition="scale-transition" max-width="100%" offset-overflow>
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                dense
                                v-model="dates.from"
                                label="Desde"
                                placeholder="Formato YYYY/MM/DD."
                                prepend-icon="event"
                                outlined
                                v-on="on"
                            ></v-text-field>
                        </template>

                        <v-date-picker v-model="dates.from" landscape show-current  header-color="#005598" color="#005598"  locale="es"/>
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="3">
                    <v-menu :close-on-content-click="false" transition="scale-transition" max-width="100%" offset-overflow>
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                dense
                                v-model="dates.to"
                                label="Hasta"
                                placeholder="Formato YYYY/MM/DD."
                                prepend-icon="event"
                                outlined
                                v-on="on"
                            ></v-text-field>
                        </template>

                        <v-date-picker v-model="dates.to" landscape show-current  header-color="#005598" color="#005598"  locale="es"/>
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-btn small outlined color="indigo" style="width:100%; height: 39px;" @click="goSearch = !goSearch"><v-icon>check</v-icon></v-btn>
                </v-col>
            </v-row>

            <v-alert dark elevation="2" v-show="results" color="#2A3B4D" style="margin: 20px 0;">
                Este fue tu ranking de ventas desde el día 
                <strong> {{ moment(dates.from).locale('es').format('MMMM Do [de] YYYY') }} </strong> 
                hasta el día
                <strong> {{ moment(dates.to).locale('es').format('MMMM Do [de] YYYY') }} </strong>. 
            </v-alert>

            <v-row v-if="!loading">
                <v-col cols="12" sm="4" v-for="(concept,i) in rankingFilt.slice(offset, offset + itemsPerPage)" :key="concept.id">
                    <v-card style="background:#FAFAFA;" class="mx-auto hoverable" max-width="100%" height="100%" elevation="4" :to="{ name: 'concepto', params: {nombre: concept.nombre, id: concept.id, grupo:concept.adm_grupos_id, subgrupo: concept.adm_subgrupos_id}}">
                        <v-list-item three-line>
                            <v-list-item-content>
                                <div class="overline mb-2"><span class="bold">{{apiConceptSalesAux[offset + i]}}</span> <br> unidades vendidas.</div>
                                <v-list-item-title class="subtitle-1 mb-1" style="line-height: 1.25rem;text-overflow:none;white-space:normal;word-wrap:nowrap;">
                                    {{concept.nombre}}
                                </v-list-item-title>
                                <v-list-item-title class="caption"> PUESTO {{offset + i + 1}}</v-list-item-title>
                            </v-list-item-content>
                            <img v-if="apiStockAux.find(a => a.id === concept.id).existencias === 0 " src="@/assets/agotado.png" width="100px" height="50px" style="flex: 0 0 0%;position:absolute;top: 40px;right: 15px;z-index: 1;">
                            <v-list-item-avatar tile size="100" color="grey">
                                <v-img :src="concept.imagen === 'default.png' ? require('@/assets/box.svg') : image+concept.imagen"></v-img>
                            </v-list-item-avatar>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-row style="text-align:center;" align="center">
                                <v-spacer></v-spacer>
                                <v-col cols=5 align="right" style="text-align:center;">
                                    <v-list-item-subtitle class="subtitle-2" style="text-overflow:none;white-space:normal;">
                                        {{
                                            (typeof apiGroups.data.data.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id) !== 'undefined')?
                                            apiGroups.data.data.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id).nombre : '-'
                                        }}
                                    </v-list-item-subtitle>
                                </v-col>
                                <v-col cols=1 align="center"><v-icon>mdi-chevron-right</v-icon></v-col>
                                <v-col cols=5 align="left" style="text-align:center;">
                                    <v-list-item-subtitle class="subtitle-2" style="text-overflow:none;white-space:normal;">
                                        {{
                                            (typeof apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id) !== 'undefined')?
                                                typeof apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0] !== 'undefined' ? apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0].nombre : '-' :'-'
                                        }}
                                    </v-list-item-subtitle>
                                </v-col>
                                <v-spacer></v-spacer>
                            </v-row>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-pagination
                v-model="page"
                :length="Math.ceil(rankingFilt.length / itemsPerPage)"
                v-on:click.native="paginate(page)"
                ></v-pagination>
            </v-row>
            <div v-else class="mx-auto" width="100%" outlined>
                <br />
                <loader />
                <br />
                <div class="snake"></div>
            </div>
        </v-card>
    </v-col>
</template>

<script>
import variables from "@/services/variables";
import accounting from "accounting";
import { mapState } from 'vuex';
import concepts from "@/services/Conceptos"
import { conceptsFields } from "@/store/index"
import moment from "moment"
import _ from "lodash";

export default {
    name: "ranking",
    data: () => {
        return {
            ...variables,
            ranking: [],
            rankingFilt: [],
            loading: true,
            apiGroups: null,
            apiSubGroups: null,
            apiConcepts: null,
            apiConceptSalesAux: [],
            apiStockAux: [],
            grupos: [],
            page:1,
            page_old: 1,
            offset: 0,
            itemsPerPage: 12,
            search: "",
            goSearch: false,
            dates: {
                from:  new Date().toISOString().substr(0, 10),
                to:  new Date().toISOString().substr(0, 10),
            },
            results: false,
        };
    },
    head: {
        title() {
            return {
                inner: "Reporteador",
                separator:'|',
                complement:'Ranking'
            };
        }
    },
    methods:{
        paginate(page){
            if (page === 1) this.offset = 0;
            else if (page > this.page_old)
                this.offset += Math.abs(page - this.page_old) === 0 ? this.itemsPerPage : Math.abs(page - this.page_old) * this.itemsPerPage;
            else if (page < this.page_old)
                this.offset -= Math.abs(page - this.page_old) === 0 ? this.itemsPerPage : Math.abs(page - this.page_old) * this.itemsPerPage;
            this.page_old = page;
        },
        createRanking(){
            try {
                this.apiConcepts = this.vuexConcepts.data.data;
                this.apiConcepts.forEach(concept =>{
                    Array.isArray(concept.existencias) ? concept.existencias.length > 0 ? concept.existencias = concept.existencias.map(a => Math.trunc(+a.existencia)).reduce((a,b) => a+b) : concept.existencias = 0 : NaN ;
                    this.apiStockAux.push(concept);
                });
                this.ranking = this.vuexConceptSales.data.data;
                this.ranking.forEach(concept => {
                    this.apiConceptSalesAux.push(accounting.formatMoney(+Math.trunc(concept.vendidos), { symbol   : "", thousand : ".", decimal  : ",", }).split(",")[0]);
                });
                this.apiGroups = this.vuexGroups;
                this.apiSubGroups = this.vuexSubGroups.data.data;
            } catch (e) {
                console.log('Error al crear ranking de productos. '+e)
            }

            this.rankingFilt = this.ranking;
            this.loading = false;
        },
        moment
    },
    computed:{
        ...mapState(['vuexConcepts','vuexConceptSales','vuexGroups','vuexSubGroups','rankingUpdated']),
    },
    watch:{
        vuexConcepts(){
            this.apiConcepts = this.vuexConcepts.data.data;
        },
        vuexConceptSales(){
            this.ranking = this.vuexConceptSales.data.data;
        },
        vuexGroups(){
            this.apiGroups = this.vuexGroups;
        },
        vuexSubGroups(){
            this.apiSubGroups = this.vuexSubGroups.data.data;
        },
        rankingUpdated(){
            this.createRanking();
        },
        goSearch(){
            if (this.dates.to < this.dates.from){
                this.$toasted.error('El campo "Hasta" no puede ser menor al campo "Desde".', { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'error_outline'
                });
            }else {
                this.results = false;
                this.$toasted.info("Obteniendo registros...", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'timer'
                });

                let limit = this.vuexConcepts.data.totalCount;
                let after = moment(this.dates.from).format("YYYY-MM-DD");
                let before = moment(this.dates.to).format("YYYY-MM-DD");

                concepts().get(`/mostSold?limit=${limit}&after-fecha_at=${after}&before-fecha_at=${before}${conceptsFields}`).then(response => {
                    if (typeof response.data.data !== 'undefined') {
                        response.data.data.forEach( a => {
                            this.rankingFilt.forEach( b => b.vendidos = b.id === a.id ? a.vendidos : b.vendidos)
                        });

                        this.rankingFilt = response.data.data;
                        this.apiConceptSalesAux = [];
                        this.rankingFilt.forEach(concept => {
                            this.apiConceptSalesAux.push(accounting.formatMoney(+Math.trunc(concept.vendidos), { symbol   : "", thousand : ".", decimal  : ",", }).split(",")[0]);
                        });
                        this.$toasted.success("¡Ranking actualizado!", { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'done_all'
                        });
                        this.results = true;
                    }else {
                        this.$toasted.error('¡Que pena! No hay información para este rango de fechas.', { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'error_outline'
                        });
                    }
                    this.$forceUpdate();
                });
            }
        },
        search:  _.debounce(async function () {
            if (this.search == "" || this.search == null) {
                this.rankingFilt = this.ranking;
                return;
            } 
            //watch se activa cuando presionas enter en el text input de busqueda
            this.rankingFilt = this.ranking.filter(i => i.nombre.toLowerCase().includes(this.search.toLowerCase()))
            
        }, 555),
    },
    async beforeMount(){
        try {
            if(this.rankingUpdated)
                this.createRanking();
        } catch (error) {
            this.ranking = [];
        }
    }
}
</script>