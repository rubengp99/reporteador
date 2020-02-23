<template>
  <div>
    <v-card class="margin elevation-0" max-width="300">
      <v-img
        src="https://media.fjallraven.eu/zoom/7323450463700_FW18_a_greenland_shoulder_bag_fjaellraeven_21.png"
        height="200px"
      ></v-img>

      <v-card-title>{{ title }}</v-card-title>
      <v-divider></v-divider>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header class="elevation-0">
            <v-row>
              <v-col cols="12">
                <p class="title">Estadisticas</p>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="elevation-0">
            <apexchart
              :type="chart.type"
              :height="chart.height"
              :options="chart.chartOptions"
              :series="chart.series"
            ></apexchart>
            <v-divider></v-divider>
            <p class="caption">
              Este producto ha rotado un
              <span
                style="color:#0D47A1"
              >{{ (Math.round((chart.series[0]/chart.series[1] + Number.EPSILON) * 100)) + "% " + '('+chart.series[0]+' unidades)' }}</span>
              de sus existencias.
            </p>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script>
import ApexCharts from "vue-apexcharts/src/ApexCharts.component";

export default {
  name: "product",
  props: {
    title: String,
    chart: Object
  },
  components: {
    apexchart: ApexCharts
  },
  data: () => ({
    show: false
  })
};
</script>

<style lang="scss">
.title {
  font-size: 0.95rem !important;
  font-weight: 500;
  line-height: 0.3rem;
  letter-spacing: 0.0125em !important;
  font-family: "Roboto", sans-serif !important;
}

.caption {
  padding-top: 15px;
  font-size: 0.85rem !important;
  font-weight: 400 !important;
  letter-spacing: 0.0333333333em !important;
  line-height: 1.25rem !important;
  font-family: "Roboto", sans-serif !important;
}

.margin {
  margin: 10px;
}
</style>