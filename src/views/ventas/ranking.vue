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
          <v-card class="mx-auto hoverable" max-width="100%" height="100%" elevation="4" :to="{ name: 'concepto', params: {nombre: concept.nombre, id: concept.id, grupo:concept.adm_grupos_id, subgrupo: concept.adm_subgrupos_id}}">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-2"><span class="bold">{{apiConceptSalesAux[i]}}</span> <br> unidades vendidas.</div>
                <v-list-item-title class="subtitle-1 mb-1" style="line-height: 1.25rem;text-overflow:none;white-space:normal;word-wrap:nowrap;">
                    {{concept.nombre}}
                </v-list-item-title>
                <v-list-item-title class="caption"> PUESTO {{offset + i + 1}}</v-list-item-title>
              </v-list-item-content>
              <img v-if="apiStockAux[i] === 0" src="@/assets/agotado.png" width="100px" height="50px" style="flex: 0 0 0%;position:absolute;top: 40px;right: 15px;z-index: 1;">
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
      i: 0,
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
      this.$data.apiConcepts = this.vuexConcepts.data.data;
      this.$data.apiConcepts.forEach(concept =>{
        this.$data.apiStockAux.push(concept.existencias.length > 0 ? concept.existencias.map(a => Math.trunc(+a.existencia)).reduce((a,b) => a+b) : 0);
      });
      this.$data.ranking = this.vuexConceptSales.data.data;
      this.$data.ranking.forEach(concept => {
        this.$data.apiConceptSalesAux.push(accounting.formatMoney(+Math.trunc(concept.vendidos), { symbol   : "", thousand : ".", decimal  : ",", }).split(",")[0]);
      });
      this.$data.apiGroups = this.vuexGroups;
      this.$data.apiSubGroups = this.vuexSubGroups.data.data;
      this.$data.loading = false;
    }
  },
  computed:{
    ...mapState(['vuexConcepts','vuexConceptSales','vuexGroups','vuexSubGroups','rankingUpdated']),
  },
  watch:{
    vuexConcepts(){
      this.$data.apiConcepts = this.vuexConcepts.data.data;
    },
    vuexConceptSales(){
      this.$data.ranking = this.vuexConceptSales.data.data;
    },
    vuexGroups(){
      this.$data.apiGroups = this.vuexGroups;
    },
    vuexSubGroups(){
      this.$data.apiSubGroups = this.vuexSubGroups.data.data;
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
      this.$data.ranking = [];
    }
  }
}
</script>