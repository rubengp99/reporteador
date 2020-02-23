<template>
  <div class="home">
    <div class="charts">
      <v-container class="grey lighten-5">
        <v-row>
          <v-col cols="12">
            <v-text-field  outlined label="Código" :rules="rules" hide-details="auto" prepend-inner-icon="search"/>
          </v-col>
        </v-row>
        <v-row>
          <card v-for="product in products" :key="product.id" :title="product.name" :chart="chart" />
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
//import ApexCharts from "vue-apexcharts/src/ApexCharts.component";
import Card from "../components/Card";

export default {
  name: "Home",
  components: {
    //apexchart: ApexCharts,
    card: Card
  },
  data() {
    return {
      products: {
        0: {
          id: "1",
          name: "Bolso",
          show:false,
        },
        1: {
          id: "2",
          name: "Bolso",
          show:false,
        },
        2: {
          id: "3",
          name: "Bolso",
          show:false,
        }
      },
      rules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ],
      chart: {
        type: "donut",
        height: "330",
        series: [10, 70],
        chartOptions: {
          title: {
            text: "Rotación de Inventario",
            align: "center"
          },
          chart: {
            type: "pie"
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    showAlways: false,
                    show: true,
                    formatter: function(val) {
                      return (
                        Math.round(
                          (val.globals.series[0] / val.globals.series[1] +
                            Number.EPSILON) *
                            100
                        ) + "%"
                      );
                    },
                    style: {
                      fontSize: "14px",
                      colors: ["black!important"]
                    }
                  }
                }
              }
            }
          },
          labels: ["Consumo", "Existencias"],
          legend:{
            position:'bottom'
          }
        }
      },
      IncrementoFactura: {
        series: [
          {
            name: "Incremento",
            data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
          }
        ],
        chartOptions: {
          chart: {
            height: 350,
            type: "bar"
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: "top" // top, center, bottom
              }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function(val) {
              return val + "%";
            },
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#304758"]
            }
          },

          xaxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ],
            position: "bottom",
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            crosshairs: {
              fill: {
                type: "gradient",
                gradient: {
                  colorFrom: "#D8E3F0",
                  colorTo: "#BED1E6",
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5
                }
              }
            },
            tooltip: {
              enabled: true
            }
          },
          fill: {
            gradient: {
              shade: "light",
              type: "horizontal",
              shadeIntensity: 0.25,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [50, 0, 100, 100]
            }
          },
          yaxis: {
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            labels: {
              show: false,
              formatter: function(val) {
                return val + "%";
              }
            }
          },
          title: {
            text: "Incrementos de Facturación Mensual",
            offsetY: 0,
            align: "center",
            style: {
              color: "#444"
            }
          }
        }
      }
    };
  }
};
</script>

<style lang="scss">
a {
  text-decoration: none;
}

.charts {
  margin-top: 74px;
}
</style>