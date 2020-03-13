<template>
  <v-col transition="scale-transition" origin="center center" cols="12" sm="6">
    <v-row transition="scale-transition" origin="center center">
      <v-col transition="scale-transition" origin="center center" cols="12">
        <p transition="scale-transition" origin="center center" class="body-1" style="line-height:normal;">
          <!--Rotación de stock-->
          <span transition="scale-transition" origin="center center" v-if="type === 'Rotación'">Rotación de Inventario para </span>
          <!--Demanda Diaria-->
          <span transition="scale-transition" origin="center center" v-if="type === 'Demanda'">Demanda de Semanal para </span>
          <!--Reclamos-->
          <span transition="scale-transition" origin="center center" v-if="type === 'Reclamos'"> Indice de Reclamos para </span>
          <!--Devoluciones-->
          <span transition="scale-transition" origin="center center" v-if="type === 'Devoluciones'"
            >Indice de Devoluciones para
          </span>
          <!--Días de inventario-->
          <span transition="scale-transition" origin="center center" v-if="type === 'Agotamiento'">¿Cuando se acabará </span>
          <!--Rentabilidad-->
          <span transition="scale-transition" origin="center center" v-if="type === 'Rentabilidad'">Rentabilidad de </span>

          <span transition="scale-transition" origin="center center" style="color:#0D47A1"><br>{{ item.name }}</span>
          

          <!--Días de Inventario-->
          <span transition="scale-transition" origin="center center" v-if="type === 'Agotamiento'">?</span>
        </p>
      </v-col>
    </v-row>
    <div transition="scale-transition" origin="center center">
      <apexchart
        :type="ctype"
        :height="height"
        :options="options.chartOptions"
        :series="options.series"
      />
      <v-divider></v-divider>
      <p transition="scale-transition" origin="center center" class="caption" style="padding-bottom:15px;">
        <!--Días de inventario-->
        <span transition="scale-transition" origin="center center" v-if="type === 'Agotamiento' && Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 + Number.EPSILON) * 100) / 100 > 0">Si la demanda de </span>

        <span transition="scale-transition" origin="center center" style="color:#0D47A1" v-if="!(type === 'Agotamiento' && Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 + Number.EPSILON) * 100) / 100 === 0)">{{ item.name }}</span>

        <!--Rotacion de stock-->
        <span transition="scale-transition" origin="center center" v-if="type === 'Rotación' && options.series[1] > 0"> ha rotado un </span>

        <!--Reclamos-->
        <span transition="scale-transition" origin="center center" v-if="type === 'Reclamos' && options.series[1] > 0"> ha recibido reclamos de un </span>

        <!--Devoluciones-->
        <span transition="scale-transition" origin="center center" v-if="type === 'Devoluciones' && options.series[1] > 0"> ha devuelto un </span>
        
        <!--Demanda diaria-->
        <span transition="scale-transition" origin="center center" v-if="type === 'Demanda'">
          tiene una demanda promedio de
        </span>


        <!-- Si el gráfico es de area -->
        <span transition="scale-transition" origin="center center"
          style="color:#0D47A1"
          v-if="ctype === 'area' && type === 'Demanda'"
        >
          {{
            Math.round(
              (item.stock_daily_sells.reduce((a, b) => a + b) / 7 +
                Number.EPSILON) *
                100
            ) / 100
          }}
        </span>


        <!-- Si el grafico es una dona -->
        <!--Rentabilidad-->
        <span transition="scale-transition" origin="center center" v-if="ctype === 'donut' && type === 'Rentabilidad'">
          proporciona un
          <span transition="scale-transition" origin="center center" style="color:#0D47A1">margen de beneficios</span>
          del
          <span transition="scale-transition" origin="center center" style="color:#0D47A1">
            {{
              isNaN(Math.round(((item.stock_costs.series[0] - item.stock_costs.series[1]) / item.stock_costs.series[0] + Number.EPSILON) * 100  ))  ? 0 + "%."
              : Math.round( ((item.stock_costs.series[0] - item.stock_costs.series[1]) / item.stock_costs.series[0] + Number.EPSILON) * 100 ) + "%."
            }}
          </span>
        </span>
        <span transition="scale-transition" origin="center center"
          style="color:#0D47A1"
          v-else-if="ctype === 'donut' && type !== 'Rotación' && type !== 'Rentabilidad' && type !== 'Devoluciones' && type !== 'Reclamos' ||  options.series[1] > 0"
        >
          {{
            isNaN(Math.round((options.series[0] / options.series[1] + Number.EPSILON) * 100 )) || !isFinite(Math.round((options.series[0] / options.series[1] + Number.EPSILON) * 100 )) ? 0 +'% '
            : Math.round((options.series[0] / options.series[1] + Number.EPSILON) * 100 ) + "% "
          }}
        </span>

        

        <!--Rotacion de stock-->
        <span transition="scale-transition" origin="center center" v-if="type === 'Rotación' && options.series[1] > 0">
          <span transition="scale-transition" origin="center center" style="color:#0D47A1">{{ "(" + options.series[0] + " unidades)" }}</span> de sus existencias en el
          almacén.
        </span>

        <!--Demanda diaria-->
        <span transition="scale-transition" origin="center center" v-if="type === 'Demanda'">
          unidades diarias en el mercado.
        </span>

        <!--Reclamos
        <span transition="scale-transition" origin="center center" v-if="type === 'Reclamos'">
          {{ "(" + options.series[0] + " unidades)" }} de sus
          {{ options.series[1] }} unidades vendidas.
        </span>
        -->

        <!--Devoluciones, reclamos y rotacion en 0-->
        <span transition="scale-transition" origin="center center"  v-if="(type === 'Devoluciones'  && options.series[1] > 0) || (type === 'Reclamos'  && options.series[1] > 0)">
          <span transition="scale-transition" origin="center center" style="color:#0D47A1">{{ "(" + options.series[0] + " unidades)" }}</span> de sus
          <span transition="scale-transition" origin="center center" style="color:#0D47A1">{{ options.series[1] }}</span> unidades vendidas.
        </span>
        <span transition="scale-transition" origin="center center"  v-else-if="(type === 'Devoluciones'  && options.series[1] === 0) || (type === 'Reclamos'  && options.series[1] === 0)">
          <span transition="scale-transition" origin="center center"> no ha vendido unidades, por lo tanto no existen {{type.toLowerCase()}}.</span>
        </span>
        <span transition="scale-transition" origin="center center"  v-else-if="(type === 'Rotación'  && options.series[1] === 0)">
          <span transition="scale-transition" origin="center center"> no cuenta con existencias, por lo tanto no existe {{type.toLowerCase()}}.</span>
        </span>

        <!--Días de inventario-->
        <span transition="scale-transition" origin="center center" v-if="type === 'Agotamiento'">
          <span transition="scale-transition" origin="center center" v-if="Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 + Number.EPSILON) * 100) / 100 > 0"> se mantiene en</span>
          <span transition="scale-transition" origin="center center" style="color:#0D47A1" v-if="Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 + Number.EPSILON) * 100) / 100 > 0">
            {{
              Math.trunc(
                (item.stock_daily_sells.reduce((a, b) => a + b) / 7 +
                  Number.EPSILON) *
                  100
              ) / 100
            }}
          </span>
          <span transition="scale-transition" origin="center center" v-if="Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 + Number.EPSILON) * 100) / 100 === 0">
            Actualmente este producto no cuenta con una demanda en el mercado, las <span transition="scale-transition" origin="center center" style="color:#0D47A1">{{item.stock}} unidades</span> de <span transition="scale-transition" origin="center center" style="color:#0D47A1">{{item.name}}</span> se mantendrán estancadas en el inventario.
          </span>
          <span transition="scale-transition" origin="center center" v-if="Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 + Number.EPSILON) * 100) / 100 > 0">
            unidades diarias, se estima que las existencias del producto se
            agotaran el día
          </span>
          <span transition="scale-transition" origin="center center" style="color:#0D47A1"> {{ item.stock_lastDay }} </span>
        </span>
      </p>
    </div>
  </v-col>
</template>

<script>
import ApexCharts from "vue-apexcharts/src/ApexCharts.component";
export default {
  name: "chart",
  components: {
    apexchart: ApexCharts
  },
  props: {
    item: Object,
    type: String,
    options: Object,
    ctype: String,
    height: String
  },
  beforeMount(){
  }
};
</script>
