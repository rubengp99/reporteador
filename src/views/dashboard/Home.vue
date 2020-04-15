<template>
  <div class="home">
    <v-container data-app style="padding:0 2.5vw;margin-top: 74px;max-width:97vw;">
      <v-row>
        <dCard col="3" icon img="savings" text="Ingresos." :title="gains$" :loading="loading[0]"/>
        <dCard col="3" icon img="factura" text="Facturas." :title="invoices" :loading="loading[1]"/>
        <dCard col="3" icon img="boxOF" text="Conceptos bajo la mínima." :title="stockMin" :loading="loading[2]"/>
        <dCard col="3" icon img="boxO" text="Conceptos sobre la máxima." :title="stockMax" :loading="loading[3]"/>
      </v-row>
      <v-row>
        <dCard col="4" icon img="box"  title="Inventario" hoverable path="/Inventario"/>
        <dCard col="4" icon img="payment" title="Ventas" hoverable path="/Ventas"/>
        <dCard col="4" icon img="value" title="Rentabilidad" hoverable last/>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card v-if="loading[4]" class="storages" outlined style="padding:100px 0;">
            <v-spacer></v-spacer>
            <loader class="absolute-center" />
            <v-spacer></v-spacer>
          </v-card>
          <v-card v-else-if="!loading[4]" width="100%" class="GroupSales">
            <apexchart type="bar" height="350" :options="ranking.chartOptions" :series="series"></apexchart>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <storagesTables :objects="storages" :loading="loading[5]" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import dTable from "@/components/dashboard/dTable"
import dCard from "@/components/aplicacion/Dashcard"
import moment from "moment";
import accounting from 'accounting';
import storages from '@/services/Depositos';
import concept from "@/services/Conceptos";
import invoices from "@/services/Factura";
import groups from "@/services/Grupos"
import subGroups from "@/services/SubGrupos"
import reports from '@/plugins/reports'
import loader from '@/components/aplicacion/loading'
import w from '@/services/variables';

export default {
  name: "Home",
  components: {
    dCard: dCard,
    storagesTables: dTable,
    loader: loader,
  },
  data() {
    return {
      apiInvoices: null,
      apiGroups: null,
      apiSubGroups: null,
      apiConcepts: null,
      gains$: 0,
      invoices: 0,
      stockMin: 0,
      stockMax: 0,
      storages: [],
      //[ganancias, facturas, existencia min, existencia max, grupos vendidos, depositos]
      loading: [true, true, true, true,true, true],
      //
      series: [], 
      ranking: null,  
    }
  },
  methods:{
    /*
      Diseñado para crear la primera fila de datos:
        --Nro de Facturas hoy
        --Ganancias del día
        --?
        --?
    */
    async createBasics(){
      this.$data.apiConcepts = await concept().get('?limit=1');
      this.$data.apiConcepts = await concept().get('?limit='+this.apiConcepts.data.totalCount);
      this.$data.apiInvoices = await invoices().get('?limit=1');
      this.$data.apiInvoices = await invoices().get('?limit='+this.$data.apiInvoices.data.totalCount+'&fecha_at='+moment(w.test).format('YYYY-MM-DD'));
      //sumamos las ganancias producidas por esa cantidad de facturas
      try {
        //cantidad de facturas hoy
        this.$data.invoices =  this.$data.apiInvoices.data.count;
        this.loading[1] = false;
        this.$data.apiInvoices.data.data.filter(i => i.detalles.filter(d => this.$data.gains$ += +d.precio_dolar * +Math.trunc(+d.cantidad)));
      } catch (e) {
        this.$data.invoices = 0;
        console.log(e);
      }
      this.loading[0] = false;
      //le damos un formato contable
      this.$data.gains$ = accounting.formatMoney(+this.$data.gains$, { symbol   : "$", thousand : ".", decimal  : ",", });
      //productos con existencia mínima y máxima
      for (let concept of this.apiConcepts.data.data){
        this.stockMin += typeof concept.existencia_minima !== 'string' ? 0 : +concept.existencia_minima > +concept.existencia ? 1 : 0;
        this.stockMax += typeof concept.existencia_maxima !== 'string' ? 0 : +concept.existencia_maxima > +concept.existencia ? 1 : 0;
      }
      this.loading[2] = false;
      this.loading[3] = false;
    },
    /*
      Diseñado para crear la segunda fila de datos (0-50%):
        --Ranking de ventas por grupos (Gráfico)
    */
    async createGroupsRank(){
      let gCount = await groups().get('?limit=1');
      let sCount = await subGroups().get('?limit=1');
      this.$data.apiGroups = await groups().get();
      this.$data.apiGroups = await groups().get('?limit='+this.$data.apiGroups.data.totalCount);
      this.$data.apiSubGroups = await subGroups().get('?limit=1');
      this.$data.apiSubGroups = await subGroups().get('?limit='+this.$data.apiSubGroups.data.totalCount);
      this.$data.apiSubGroups = this.$data.apiSubGroups.data.data;
      let groupSales = await groups().get('/mostSold/?limit='+gCount.data.totalCount+'&fecha_at='+moment(w.test).format('YYYY-MM-DD'));
      let max = this.apiSubGroups.length;
      let gVentas = groupSales.data.data.slice(0,5);
      let sVentas = await subGroups().get('/mostsold/?limit='+sCount.data.totalCount+'&fecha_at='+moment(w.test).format('YYYY-MM-DD'));
      //inicializamos la data del gráficos, esto es solo con fines de establecer una matriz de
      //5 files con una cantidad de columnas proporcional al número de subgrupos
      //(el diseño de apexchart nos obliga a hacer el gráfico de barras stackeadas de esta manera)
      for (let i = 0; i < max+1; i++){
        max;
        this.series.push({
          name: "SubGrupos "+i,
          data: [{
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          }]
        });
      }

      for (let i = 1; i < max+1; i++){
        for (let j = 0; j < 5; j++) {
          this.series[i].data[j].x = typeof sVentas.data.data.find(a => a.adm_grupos_id === gVentas[j].id && a.id === i) !== 'undefined' ?  
                                        sVentas.data.data.find(a => a.adm_grupos_id === gVentas[j].id && a.id === i).nombre  : '';
          this.series[i].data[j].y = typeof sVentas.data.data.find(a => a.adm_grupos_id === gVentas[j].id && a.id === i) !== 'undefined' ?  
                                        Math.trunc(sVentas.data.data.find(a => a.adm_grupos_id === gVentas[j].id && a.id === i).venta) : 0;
        }
      }
      this.ranking = reports.chart__barRank(this.series,
          [gVentas[0].nombre,gVentas[1].nombre,gVentas[2].nombre,gVentas[3].nombre,gVentas[4].nombre],
          moment(w.test).locale('es').format('MMM Do YYYY').charAt(0).toUpperCase() + moment(w.test).locale('es').format('MMM Do YYYY').slice(1,14),
      );

      this.loading[4] = false;
    },
    /*
      Diseñado para crear la segunda fila de datos (50%-100%):
        --Valorización depósitos (tabla)
    */
    async createStorageValue(){
      let apiStorages = await storages().get();
      try{
        for (const storage of apiStorages.data.data) {
          let aux = await storages().get(storage.id+'/conceptos/?limit='+this.apiConcepts.data.totalCount+'&fields=id,nombre,precio_dolar,precio_a,existencias')
          let count = aux.data.data.map(a => Math.trunc(+a.existencia)).reduce((a,b) => a+b);
          this.storages.push({
            id: storage.id,
            count: count + ' unidades.',
            $: accounting.formatMoney(+aux.data.data.map(a => Math.trunc(+a.existencia) * +a.precio_dolar).reduce((a,b) => a+b), 
                                      { symbol   : "$", thousand : ".", decimal  : ",", }),
            Bs: accounting.formatMoney(+aux.data.data.map(a => Math.trunc(+a.existencia) * +a.precio_a).reduce((a,b) => a+b), 
                                      { symbol   : "Bs", thousand : ".", decimal  : ",", }),
          });
        }
        this.loading[5] = false;
      }catch(error){
        this.loading[5] = true;
        this.createStorageValue();
      }
    },
  },
  beforeMount(){
    this.createBasics();
    this.createGroupsRank();
    this.createStorageValue();
  }
};
</script>

<style lang="scss">
/*
@function square($x, $y, $color:$surrounding) {
    @return $x*$size $y*$size 0 $stroke-size $color;
}
*/
a {
  text-decoration: none;
}


.GroupSales{
  padding: 15px 15px 0 15px;
  @media(min-width:1024px){
    height: 100%;
  }
}

.row{
  max-width: 100vw;
}

.absolute-center{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.fix-lowRes{
  white-space: nowrap;
}
</style>