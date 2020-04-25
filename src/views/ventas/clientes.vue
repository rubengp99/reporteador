<template>
  <v-col cols="12">
    <v-card class="mx-auto" max-width="100vw" style="padding: 15px 25px;" :outlined="loading">
      <v-card-title class="title" style="padding:5px;">
        <v-spacer></v-spacer>
        Clientes de tu Empresa
        <v-spacer></v-spacer>
      </v-card-title>
      <v-row v-if="!loading">
        <masonry :cols="cols" style="width:100%;">
          <div v-for="(buyer, i) in compradores.slice(offset, offset + itemsPerPage)" :key="buyer.id" :style="'margin: 15px '+gutter/2+'px'">
            <v-card style="background:#FAFAFA;" class="mx-auto hoverable" active-class="active" max-width="100%" :height=" buyer.expand ? '100%': 'auto'" elevation="4" @click.native="open(buyer)">
              <v-list-item three-line>
                <v-list-item-content>
                  <div class="overline mb-2"><span class="bold">{{buyer.sales.split(",")[0]}}</span> <br> compras realizadas.</div>
                  <v-list-item-title class="subtitle-1 mb-1" style="line-height: 1.25rem;text-overflow:none;white-space:normal;word-wrap:nowrap;">
                      {{buyer.name}}
                  </v-list-item-title>
                  <v-list-item-title class="caption"> PUESTO {{offset + i + 1}}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-avatar tile size="100" >
                  <v-img :src="require('@/assets/buyers.svg')"></v-img>
                </v-list-item-avatar>
              </v-list-item>
              <v-divider></v-divider>
              <v-card-actions>
                  <v-row style="text-align:center;" align="center">
                      <v-col cols=12 style="padding:2.5px 0;"> 
                        <v-list-item-title class="subtitle-1"> <span class="bold">Aporte de Compra</span></v-list-item-title>
                      </v-col>
                      <v-col cols=12 style="padding:2.5px 0;">
                        <v-row style="text-align:center;">
                            <v-col cols=4 md=5 style="text-align:right;padding: 0;">
                              <v-list-item-title class="subtitle-2"> <span class="bold">Bolivares </span></v-list-item-title>
                            </v-col>
                            <v-col cols=1 style="padding:0;">
                              <v-icon>mdi-chevron-right</v-icon> 
                            </v-col>
                            <v-col cols=7 md=5 style="text-align:left;padding: 0;">
                              <v-list-item-title class="subtitle-2"> {{buyer.buysBs}}</v-list-item-title>
                            </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols=12 style="padding:2.5px 0;">
                        <v-row style="text-align:center;">
                            <v-col cols=4 md=5 style="text-align:right;padding:0;">
                              <v-list-item-title class="subtitle-2"> <span class="bold">Dólares </span></v-list-item-title>
                            </v-col>
                            <v-col cols=1 style="padding:0;">
                              <v-icon>mdi-chevron-right</v-icon> 
                            </v-col>
                            <v-col cols=7 md=5 style="text-align:left;padding:0;">
                              <v-list-item-title class="subtitle-2"> {{buyer.buys$}}</v-list-item-title>
                            </v-col>
                        </v-row>
                      </v-col>
                  </v-row>
              </v-card-actions>
              <v-expand-transition>
                <v-col cols="12" v-show="buyer.expand" @click.stop.prevent>
                    <v-divider></v-divider>
                    <p  class="body-1" style="line-height:normal;margin-top:15px;">
                      Volumen de Compras de  <span  style="color:#0D47A1"><br>{{ buyer.name }}</span>
                    </p>
                    <apexchart
                      type="donut"
                      height="298"
                      :options="buyer.percentBuys.chartOptions"
                      :series="buyer.percentBuys.series"
                    />
                    <v-divider></v-divider>
                    <p class="caption" style="margin-top:10px;">El comprador <span  style="color:#0D47A1">{{buyer.name}}</span> 
                        posee el <span style="color:#0D47A1">{{ Math.round((buyer.percentBuys.series[0] / buyer.percentBuys.series[1] + Number.EPSILON) * 100) > 100 ? 100 + '%' : Math.round((buyer.percentBuys.series[0] / buyer.percentBuys.series[1] + Number.EPSILON) * 100) +'%'}}</span>
                        del total de compras en el negocio.
                    </p>
                </v-col>
              </v-expand-transition>
            </v-card>
          </div>
        </masonry>
        <v-pagination
          v-model="page"
          :length="Math.ceil(compradores.length / itemsPerPage)"
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
import reports from "@/plugins/reports"
import accounting from "accounting";
import { mapState } from 'vuex';

export default {
   name: "compradores",
   components: {
  },
  data: () => {
    return {
      ...variables,
      apiBuyers: null,
      compradores: [],
      loading: true,
      promedioVentas: null,
      cols: 0,
      gutter: 0,
      page:1,
      page_old: 1,
      offset: 0,
      itemsPerPage: 12,
      
    };
  },
  computed:{
    ...mapState(['vuexBuyers','buyersUpdated']),
  },
  head: {
    title() {
      return {
          inner:'Reporteador',
          separator:'|',
          complement:'Vendedores'
      };
    }
  },
  methods:{
    open(openItem){
      this.compradores.slice(this.offset, this.offset + this.itemsPerPage).forEach(buyer => buyer.expand = (openItem.id === buyer.id && !openItem.expand));
    },
    paginate(page){
      if (page === 1) this.offset = 0;
      else if (page > this.page_old)
        this.offset += Math.abs(page - this.page_old) === 0 ? this.itemsPerPage : Math.abs(page - this.page_old) * this.itemsPerPage;
      else if (page < this.page_old)
        this.offset -= Math.abs(page - this.page_old) === 0 ? this.itemsPerPage : Math.abs(page - this.page_old) * this.itemsPerPage;
      this.page_old = page;
    },
    async createBuyers(){
      this.apiBuyers = this.vuexBuyers;
      let totalBuys = this.apiBuyers.data.response.data.map(a => a.compras).reduce((a,b) => a+b);
      this.apiBuyers.data.response.data.forEach(buyer => {
        this.compradores.push({
          id: buyer.id,
          name: buyer.nombre,
          sales: accounting.formatMoney(+Math.trunc(buyer.compras), { symbol   : "", thousand : ".", decimal  : ",", }),
          buysBs: accounting.formatMoney(+buyer.total, { symbol   : "Bs", thousand : ".", decimal  : ",", }),
          buys$: accounting.formatMoney(+buyer.totalDolar, { symbol   : "$", thousand : ".", decimal  : ",", }),
          percentBuys: reports.chart__donut([buyer.compras, totalBuys],"Volumen del",["Mis compras","Total de Compras"],["#FFC107", "#3f72af"],'volumen'),
          expand: false,
        });
      });
      this.$data.loading = false;
    },
    onResize() {
      if (window.innerWidth > 957){
          this.cols = 3;
          this.gutter = 20;
      }else if (window.innerWidth < 957 && window.innerWidth > 500) {
          this.cols = 2;
          this.gutter = 10;
      }else {
          this.cols = 1;
          this.gutter = 2;
      }
    },
  },
  watch:{
    vuexBuyers(){
      this.apiBuyers = this.vuexBuyers;
    },
    buyersUpdated(){
      this.createBuyers();
    }
  },
  created(){
    window.addEventListener('resize', this.onResize);
    this.onResize();
  },
  async beforeMount(){
    try {
      if(this.buyersUpdated){
        this.createBuyers();
      }
    } catch (error) {
      this.$data.compradores = [];
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
}
</script>