<template>
  <div class="ventas">
    <v-row style="margin-top:55px;">
      <v-col sm="12" md="7">
        <v-card class="margin" style="padding: 15px 0px;" max-width="100%" tile>
          <apexchart
            type="area"
            height="400"
            :options="semana.chartOptions"
            :series="semana.series"
          />
        </v-card>
      </v-col>
      <v-col sm="12" md="5">
        <v-card class="margin" style="padding: 15px 0px;" max-width="100%" tile>
          <apexchart type="donut" height="400" :options="mes.chartOptions" :series="mes.series" />
        </v-card>
      </v-col>
    </v-row>
    <v-row style="margin-top:0px;">
      <v-col sm="12" md="6">
        <v-col cols="12">
            <v-text-field  outlined label="Vendedor" :rules="rules" hide-details="auto" prepend-inner-icon="search"/>
          </v-col>
        <v-card class="margin" style="padding: 15px 0px;" max-width="100%" tile>
          <apexchart
            type="donut"
            height="400"
            :options="volumenVendedor.chartOptions"
            :series="volumenVendedor.series"
          />
        </v-card>
      </v-col>
      <v-col sm="12" md="6">
        <v-card class="margin" style="padding: 15px 0px;" max-width="100%" tile>
          <apexchart type="donut" height="400" :options="mes.chartOptions" :series="mes.series" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ApexCharts from "vue-apexcharts/src/ApexCharts.component";
//import Card from "../components/Card";

export default {
  name: "Home",
  components: {
    apexchart: ApexCharts
    //card: Card
  },
  data: () => {
    return {
      rules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ],
      semana: {
        series: [
          {
            name: "Vendidos",
            data: [100, 20, 30, 123, 22, 83, 20]
          }
        ],
        chartOptions: {
          chart: {
            type: "area",
            height: 350,
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "11px",
              fontWeight: "bold"
            },
            background: {
              enabled: true,
              foreColor: "#fff",
              borderRadius: 2,
              padding: 7,
              opacity: 0.9,
              borderWidth: 1,
              borderColor: "#fff"
            }
          },
          stroke: {
            curve: "straight"
          },

          title: {
            text: "Movimientos de la Semana",
            align: "center"
          },
          xaxis: {
            categories: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
          },
          legend: {
            horizontalAlign: "left"
          }
        }
      },
      mes: {
        series: [44, 55, 81],
        chartOptions: {
          chart: {
            type: "donut"
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    showAlways: false,
                    show: true,
                    formatter: function(w) {
                      return (
                        w.globals.seriesTotals.reduce((a, b) => {
                          return a + b;
                        }, 0) + "$"
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
          legend: {
            position: "bottom"
          },
          labels: ["Limpieza", "Comida", "Bebidas"],
          title: {
            text: "Ganancias del Mes",
            align: "center"
          }
          /*responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]*/
        }
      },
      volumenVendedor: {
        series: [44, 55, 81],
        chartOptions: {
          chart: {
            type: "donut"
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    showAlways: false,
                    show: true,
                    formatter: function(w) {
                      return (
                        w.globals.seriesTotals.reduce((a, b) => {
                          return a + b;
                        }, 0) + "$"
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
          legend: {
            position: "bottom"
          },
          labels: ["Limpieza", "Comida", "Bebidas"],
          title: {
            text: "Ganancias del Mes",
            align: "center"
          }
          /*responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]*/
        }
      }
     /* trimestre: {
        series: [
          {
            name: "Ganancias",
            data: [1480, 2000, 1200]
          }
        ],
        chartOptions: {
          chart: {
            type: "line",
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "11px",
              fontWeight: "bold"
            },
            background: {
              enabled: true,
              foreColor: "#fff",
              borderRadius: 2,
              padding: 7,
              opacity: 0.9,
              borderWidth: 1,
              borderColor: "#fff"
            },
            formatter: val => val + "$"
          },
          stroke: {
            curve: "smooth"
          },
          title: {
            text: "Ganancias del Trimestre",
            align: "center"
          },
          grid: {
            row: {
              colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
              opacity: 0.5
            }
          },
          xaxis: {
            categories: ["Ene", "Feb", "Mar"]
          }
        }
      }*/
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