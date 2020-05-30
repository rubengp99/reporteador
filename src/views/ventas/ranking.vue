<template>
    <v-col cols="12">
        <v-card class="mx-auto" max-width="100vw" style="padding: 15px 25px;" :outlined="loading">
            <v-card-title class="title" style="padding:5px;">
                <v-spacer></v-spacer>
                Ranking de Ventas
                <v-spacer></v-spacer>
            </v-card-title>
            <v-row v-if="!loading">
                <v-col cols="12" sm="4" v-for="(concept,i) in ranking.slice(offset, offset + itemsPerPage)" :key="concept.id">
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
                                            (typeof apiGroups.data.data.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id) !== undefined)?
                                            apiGroups.data.data.find(group => group.id === concept.grupos_id || group.id === concept.adm_grupos_id).nombre : '-'
                                        }}
                                    </v-list-item-subtitle>
                                </v-col>
                                <v-col cols=1 align="center"><v-icon>mdi-chevron-right</v-icon></v-col>
                                <v-col cols=5 align="left" style="text-align:center;">
                                    <v-list-item-subtitle class="subtitle-2" style="text-overflow:none;white-space:normal;">
                                        {{
                                            (typeof apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id) !== undefined)?
                                                typeof apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0] !== undefined ? apiSubGroups.filter(s => s.id === concept.subgrupos_id || s.id === concept.adm_subgrupos_id)[0].nombre : '-' :'-'
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
                :length="Math.ceil(ranking.length / itemsPerPage)"
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

export default {
    name: "ranking",
    data: () => {
        return {
            ...variables,
            ranking: [],
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
            this.loading = false;
        }
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
        }
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