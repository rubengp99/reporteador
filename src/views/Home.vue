<template>
  <div class="home">
    <v-row data-app style="padding:0 2.5vw;margin-top: 74px;">
      <dCard col="3"  icon img="savings" text="En ganancias." :title="gains$"/>
      <dCard col="3" icon img="factura" text="Facturas." :title="invoices"/>
      <!--<dCard col="3" icon img="boxOF" title="Productos con Existencia Mínima"/>-->
      <!--<dCard col="3" icon img="boxO" title="Productos con Existencia Máxima"/>-->
      <dCard col="6" icon img="storage" text="Valor de almacenes." :title="invoices"/>
    </v-row>
  </div>
</template>

<script>
//import chart from "../components/Chart"
import dCard from "../components/Dashcard"
import moment from "moment";
import accounting from 'accounting';
import storages from '../services/Depositos';
//import concept from "../services/Conceptos";
import invoices from "../services/Factura";
//import groups from "../services/Grupos"
export default {
  name: "Home",
  components: {
   //chart: chart,
   dCard: dCard,
  },
  data() {
    return {
      apiInvoices: null,
      gains$: 0,
      invoices: 0,
    }
  },
  async beforeMount(){
    this.$data.apiInvoices = await invoices().get('?limit=1');
    this.$data.apiInvoices = await invoices().get('?limit='+this.$data.apiInvoices.data.totalCount+'&fecha_at='+moment('2019-10-23').locale('es').format('YYYY-MM-DD'));
    this.$data.invoices =  this.$data.apiInvoices.data.count;
    this.$data.apiInvoices.data.data.filter(i => i.detalles.filter(d => this.$data.gains$ += +d.precio_dolar * +Math.trunc(+d.cantidad)));
    this.$data.gains$ = accounting.formatMoney(+this.$data.gains$, { symbol   : "$", thousand : ".", decimal  : ",", });
    console.log(storages().get('1/conceptos'));
  }
};
</script>

<style lang="scss">
a {
  text-decoration: none;
}


</style>