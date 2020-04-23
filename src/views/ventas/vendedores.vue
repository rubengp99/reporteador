<template>
  <v-col cols="12">
    <v-card class="mx-auto" max-width="100vw" style="padding: 15px 25px;" :outlined="loading">
      <v-card-title class="title" style="padding:5px;">
        <v-spacer></v-spacer>
        Vendedores de tu Empresa
        <v-spacer></v-spacer>
      </v-card-title>
      <v-row v-if="!loading">
        <masonry :cols="cols" style="width:100%;">
          <div v-for="(seller, i) in vendedores" :key="i" :style="'margin:'+gutter/2+'px'">
            <v-card class="mx-auto hoverable" max-width="100%" :height=" seller.expand ? '100%': 'auto'" elevation="4" @click.native="seller.expand = !seller.expand">
              <v-list-item three-line>
                <v-list-item-content>
                  <div class="overline mb-2"><span class="bold">{{seller.sales.split(",")[0]}}</span> <br> ventas realizadas.</div>
                  <v-list-item-title class="subtitle-1 mb-1" style="line-height: 1.25rem;text-overflow:none;white-space:normal;word-wrap:nowrap;">
                      {{seller.name}}
                  </v-list-item-title>
                  <v-list-item-title class="caption"> PUESTO {{i + 1}}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-avatar tile size="100" >
                  <v-img :src="require('@/assets/sellers.svg')"></v-img>
                </v-list-item-avatar>
              </v-list-item>
              <v-divider></v-divider>
              <v-card-actions>
                  <v-row style="text-align:center;" align="center">
                      <v-col cols=12 style="padding:2.5px 0;"> 
                        <v-list-item-title class="subtitle-1"> <span class="bold">Ganancias</span></v-list-item-title>
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
                              <v-list-item-title class="subtitle-2"> {{seller.gainsBs}}</v-list-item-title>
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
                              <v-list-item-title class="subtitle-2"> {{seller.gains$}}</v-list-item-title>
                            </v-col>
                        </v-row>
                      </v-col>
                  </v-row>
              </v-card-actions>
              <v-expand-transition>
                <v-col cols="12" v-show="seller.expand">
                    <v-divider></v-divider>
                    <p  class="body-1" style="line-height:normal;margin-top:15px;">
                      Volumen de Ventas de  <span  style="color:#0D47A1"><br>{{ seller.name }}</span>
                    </p>
                    <apexchart
                      type="donut"
                      height="298"
                      :options="seller.percentSales.chartOptions"
                      :series="seller.percentSales.series"
                    />
                    <v-divider></v-divider>
                    <p class="caption" style="margin-top:10px;">El vendedor <span  style="color:#0D47A1">{{seller.name}}</span> 
                        posee el {{ Math.round((seller.percentSales.series[0] / seller.percentSales.series[1] + Number.EPSILON) * 100) > 100 ? 100 + '%' : Math.round((seller.percentSales.series[0] / seller.percentSales.series[1] + Number.EPSILON) * 100) +'%'}}
                        del total de las ventas realizadas por el negocio.
                    </p>
                </v-col>
              </v-expand-transition>
            </v-card>
          </div>
        </masonry>
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
   name: "ranking",
   components: {
  },
  data: () => {
    return {
      ...variables,
      apiSellers: null,
      vendedores: [],
      i: 0,
      loading: true,
      promedioVentas: null,
      cols: 0,
      gutter: 0,
    };
  },
  computed:{
    ...mapState(['vuexSellers','sellersUpdated']),
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
    async createSellers(){
      this.apiSellers = this.vuexSellers;
      let totalSellers = this.vuexSellers.data.totalCount;
      this.apiSellers.data.data.forEach(seller => {
        this.vendedores.push({
          id: seller.id,
          name: seller.nombre,
          sales: accounting.formatMoney(+Math.trunc(seller.ventas), { symbol   : "", thousand : ".", decimal  : ",", }),
          gainsBs: accounting.formatMoney(+seller.venta_total, { symbol   : "Bs", thousand : ".", decimal  : ",", }),
          gains$: accounting.formatMoney(+seller.venta_total_dolar, { symbol   : "$", thousand : ".", decimal  : ",", }),
          percentSales: reports.chart__donut([seller.ventas, totalSellers],"Volumen del",["Ventas","Vendedores"],["#FFC107", "#3f72af"],'volumen'),
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
          this.gutter = 0;
      }
    },
  },
  watch:{
    vuexSellers(){
      this.apiSellers = this.vuexSellers;
    },
    sellersUpdated(){
      this.createSellers();
    }
  },
  created(){
    window.addEventListener('resize', this.onResize);
    this.onResize();
  },
  async beforeMount(){
    try {
      if(this.sellersUpdated){
        this.createSellers();
      }
    } catch (error) {
      this.$data.vendedores = [];
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
}
</script>