<template>
  <div class="home">
    <div class="charts">
      <v-container class="grey lighten-5">
        <v-row data-app>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                Rotación de Inventario
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="table.search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :loading="table.loading"
                :headers="table.headers"
                :items="table.products"
                :search="table.search"
                :single-expand="table.expand"
                :expanded.sync="table.expanded"
                item-key="name"
                show-expand
                :sort-by.sync="table.sortBy"
                :sort-desc.sync="table.sortDesc"
                :page.sync="table.page"
                :items-per-page="table.itemsPerPage"
                :server-items-length="table.totalConceptos"
                hide-default-footer
                class="elevation-1"
                @page-count="table.pageCount = $event"
                @update:page="paginate"
              >
                <template v-slot:item.price="{ item }">
                  {{ item.price }}
                  <span style="font-size:16px;color:#1B5E20;">$</span>
                </template>
                <template v-slot:item.image="{ item }">
                  <div class="p-2">
                    <v-img
                      src="/images/box.svg"
                      :alt="item.name"
                      width="60px"
                      height="65px"
                      style="margin: 0 auto;"
                    ></v-img>
                  </div>
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <v-row style="position:relative;">
                      <v-col cols="12" sm="6">
                        <v-row>
                          <v-col cols="12">
                            <p class="title" style="line-height:normal;">
                              Rotación de Inventario para
                              <span style="color:#0D47A1">{{ item.name }}</span>
                            </p>
                          </v-col>
                        </v-row>
                        <div>
                          <apexchart
                            type="donut"
                            height="298"
                            :options="item.stock_rotation.chartOptions"
                            :series="item.stock_rotation.series"
                          />
                          <v-divider></v-divider>
                          <p class="caption" style="padding-bottom:15px;">
                            <span style="color:#0D47A1">{{ item.name }}</span>
                            ha rotado un
                            <span style="color:#0D47A1">
                              {{
                                Math.round(
                                  (item.stock_rotation.series[0] /
                                    item.stock_rotation.series[1] +
                                    Number.EPSILON) *
                                    100
                                ) +
                                  "% " +
                                  "(" +
                                  item.stock_rotation.series[0] +
                                  " unidades)"
                              }}
                            </span>
                            de sus existencias en el almacén.
                          </p>
                        </div>
                      </v-col>
                      <v-divider
                        inset
                        vertical
                        class="absolute-center"
                      ></v-divider>
                      <v-col cols="12" sm="6">
                        <v-row>
                          <v-col cols="12">
                            <p class="title" style="line-height:normal;">
                              Demanda Semanal para
                              <span style="color:#0D47A1">{{ item.name }}</span>
                            </p>
                          </v-col>
                        </v-row>
                        <div>
                          <apexchart
                            type="area"
                            height="250"
                            :options="item.stock_demand.chartOptions"
                            :series="item.stock_demand.series"
                          />
                          <v-divider></v-divider>
                          <p class="caption" style="padding-bottom:15px;">
                            <span style="color:#0D47A1">{{ item.name }}</span>
                            tiene una demanda promedio de
                            <span style="color:#0D47A1">
                              {{
                                Math.round(
                                  (item.stock_demand.series[0].data.reduce(
                                    (a, b) => a + b
                                  ) /
                                    7 +
                                    Number.EPSILON) *
                                    100
                                ) / 100
                              }}
                            </span>
                            unidades diarias en el mercado.
                          </p>
                        </div>
                      </v-col>
                    </v-row>
                    <!--linea de gráficos para DIAS DE INVENTARIO-->
                    <v-divider inset></v-divider>
                    <v-row style="position:relative;">
                      <v-col cols="12" sm="6">
                        <v-row>
                          <v-col cols="12">
                            <p class="title" style="line-height:normal;">
                              Indice de Reclamos para
                              <span style="color:#0D47A1">{{ item.name }}</span>
                            </p>
                          </v-col>
                        </v-row>
                        <div>
                          <apexchart
                            type="donut"
                            height="298"
                            :options="item.stock_claims.chartOptions"
                            :series="item.stock_claims.series"
                          />
                          <v-divider></v-divider>
                          <p class="caption" style="padding-bottom:15px;">
                            <span style="color:#0D47A1">{{ item.name }}</span>
                            ha recibido reclamos de un
                            <span style="color:#0D47A1">
                              {{
                                Math.round(
                                  (item.stock_claims.series[0] /
                                    item.stock_claims.series[1] +
                                    Number.EPSILON) *
                                    100
                                ) +
                                  "% " +
                                  "(" +
                                  item.stock_claims.series[0] +
                                  " unidades)"
                              }}
                            </span>
                            de sus
                            <span style="color:#0D47A1">
                              {{ item.stock_devolution.series[1] }}
                              unidades
                            </span>
                            vendidas.
                          </p>
                        </div>
                      </v-col>
                      <v-divider
                        inset
                        vertical
                        class="absolute-center"
                      ></v-divider>
                      <v-col cols="12" sm="6">
                        <v-row>
                          <v-col cols="12">
                            <p class="title" style="line-height:normal;">
                              Indice de Devoluciones para
                              <span style="color:#0D47A1">{{ item.name }}</span>
                            </p>
                          </v-col>
                        </v-row>
                        <div>
                          <apexchart
                            type="donut"
                            height="298"
                            :options="item.stock_devolution.chartOptions"
                            :series="item.stock_devolution.series"
                          />
                          <v-divider></v-divider>
                          <p class="caption" style="padding-bottom:15px;">
                            <span style="color:#0D47A1">{{ item.name }}</span>
                            ha devuelto un
                            <span style="color:#0D47A1">
                              {{
                                Math.round(
                                  (item.stock_devolution.series[0] /
                                    item.stock_devolution.series[1] +
                                    Number.EPSILON) *
                                    100
                                ) +
                                  "% " +
                                  "(" +
                                  item.stock_devolution.series[0] +
                                  " unidades)"
                              }}
                            </span>
                            de las
                            <span style="color:#0D47A1">
                              {{ item.stock_devolution.series[1] }}
                              unidades
                            </span>
                            vendidas.
                          </p>
                        </div>
                      </v-col>
                    </v-row>
                    <v-divider inset></v-divider>
                    <v-row style="position:relative;">
                      <v-col cols="12" sm="6">
                        <v-row>
                          <v-col cols="12">
                            <p class="title" style="line-height:normal;">
                              ¿Cuando se agotará
                              <span style="color:#0D47A1">{{ item.name }}</span>
                              ?
                            </p>
                          </v-col>
                        </v-row>
                        <div>
                          <apexchart
                            type="area"
                            height="250"
                            :options="item.stock_days.chartOptions"
                            :series="item.stock_days.series"
                          />
                          <v-divider></v-divider>
                          <p class="caption" style="padding-bottom:15px;">
                            Si la demanda de
                            <span style="color:#0D47A1">{{ item.name }}</span>
                            se mantiene en
                            <span style="color:#0D47A1">
                              {{
                                Math.trunc(
                                  (item.stock_daily_sells.reduce(
                                    (a, b) => a + b
                                  ) /
                                    7 +
                                    Number.EPSILON) *
                                    100
                                ) / 100
                              }}
                            </span>
                            unidades diarias, se estima que las existencias del
                            producto se agotaran el día
                            <span style="color:#0D47A1">
                              {{ item.stock_lastDay }} </span
                            >.
                          </p>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-row>
                          <v-col cols="12">
                            <p class="title" style="line-height:normal;">
                              Rentabilidad de
                              <span style="color:#0D47A1">{{ item.name }}</span>
                            </p>
                          </v-col>
                        </v-row>
                        <div>
                          <apexchart
                            type="donut"
                            height="298"
                            :options="item.stock_costs.chartOptions"
                            :series="item.stock_costs.series"
                          />
                          <v-divider></v-divider>
                          <p class="caption" style="padding-bottom:15px;">
                            <span style="color:#0D47A1">{{ item.name }}</span>
                            proporciona un
                            <span style="color:#0D47A1"
                              >margen de beneficios</span
                            >
                            del
                            <span style="color:#0D47A1">
                              {{
                                Math.round(
                                  ((item.stock_costs.series[1] -
                                    item.stock_costs.series[0]) /
                                    item.stock_costs.series[1] +
                                    Number.EPSILON) *
                                    100
                                ) + "%"
                              }}
                            </span>
                            .
                          </p>
                        </div>
                      </v-col>
                    </v-row>
                  </td>
                </template>
              </v-data-table>
              <div class="text-center" style="padding: 10px 0;">
                <v-pagination
                  v-model="table.page"
                  :length="table.pageCount"
                  light
                ></v-pagination>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import ApexCharts from "vue-apexcharts/src/ApexCharts.component";
import moment from "moment";
import concept from "../services/Conceptos";
import movements from "../services/Movimiento_deposito";
const reports = require("../plugins/reports");

export default {
  name: "Home",
  components: {
    apexchart: ApexCharts
  },
  data() {
    return {
      table: {
        loading: true,
        expanded: [],
        expand: false,
        search: "",
        sortBy: ["name", "stock", "sold", "price"],
        sortDesc: true,
        page: 1,
        page_old: 1,
        pageCount: 0,
        itemsPerPage: 8,
        dataOffset: 0,
        totalConceptos: 0,
        headers: [
          {
            text: "Imagen",
            align: "left",
            sortable: false,
            value: "image"
          },
          {
            text: "Producto",
            align: "left",
            value: "name"
          },
          { text: "Categoría", value: "category" },
          { text: "En Inventario", value: "stock" },
          { text: "Vendidos", value: "sold" },
          { text: "Precio", value: "price" },
          { text: "Estadísticas", value: "data-table-expand" }
        ],
        products: [
          {
            name: "Frozen Yogurt",
            stock: 159,
            sold: 80,
            category: "Postres",
            price: "30",
            stock_daily_sells: [10, 15, 5, 12, 12, 13, 19],
            stock_end: [],
            stock_lastDay: "",
            stock_rotation: reports.chart__donut([80, 159], "Rotación del", [
              "Consumo",
              "Existencias"
            ]),
            stock_demand: reports.chart__area([10, 15, 5, 12, 12, 13, 19]), //Demanda diaría en una semana [Lun, Mar, Mie, Jue, Vie, Sab, Dom]
            stock_devolution: reports.chart__donut(
              [30, 80],
              "Devoluciones del",
              ["Devoluciones", "Compras"],
              ["#E91E63", "#3f72af"]
            ),
            stock_claims: reports.chart__donut(
              [10, 80],
              "Reclamos del",
              ["Reclamos", "Compras"],
              ["#FFC107", "#3f72af"]
            ),
            stock_days: null,
            stock_costs: reports.chart__donut(
              [50, 80],
              "Beneficios del",
              ["Precio", "Costo"],
              null,
              "benefits"
            )
          }
        ]
      }
    };
  },
  methods: {
    async paginate(page) {
      this.table.loading = true;
      if (page === 1) this.table.dataOffset = 0;
      else if (page > this.table.page_old)
        this.table.dataOffset +=
          Math.abs(page - this.table.page_old) === 0
            ? 8
            : Math.abs(page - this.table.page_old) * 8;
      else if (page < this.table.page_old)
        this.table.dataOffset -=
          Math.abs(page - this.table.page_old) === 0
            ? 8
            : Math.abs(page - this.table.page_old) * 8;
      this.table.products = [];
      this.$forceUpdate();
      await this.getConcept(
        "?offset=" + this.table.dataOffset + "&limit=" + this.table.itemsPerPage
      );
      this.table.page_old = page;
    },
    async configStockDays(product) {
      let existencias = await concept().get("/" + product.id + "/depositos");
      existencias.data.data.filter(a => (product.stock += +a.existencia));
      var stock_aux = product.stock;
      var stock_dates = [];
      do {
        stock_aux -= Math.trunc(
          product.stock_daily_sells.reduce((a, b) => a + b) / 7
        );
        if (stock_aux > 0) product.stock_end.push(stock_aux);
      } while (stock_aux > 0);

      for (let i = 0; i < product.stock_end.length; i++) {
        stock_dates.push(
          moment()
            .locale("EN")
            .add(i, "days")
            .format("MMM Do")
        );
      }
      product.stock_days = reports.chart__area(
        product.stock_end,
        stock_dates,
        false,
        "stockdays"
      );
      product.stock_lastDay = moment()
        .locale("ES")
        .add(stock_dates.length - 1, "days")
        .format("LL");

      return product;
    },
    async getConcept(limit = "?offset=0&limit=" + this.table.itemsPerPage) {
      this.table.products = [];
      let apiConcepts = await concept().get(limit);
      apiConcepts.data.data.forEach(async concept => {
        this.table.products.push(await this.configStockDays({
          id: concept.id,
          name: concept.nombre,
          stock: 0,
          sold: 40,
          category: "Postres",
          price: "30",
          stock_daily_sells: [10, 15, 5, 12, 12, 13, 19],
          stock_end: [],
          stock_lastDay: "",
          stock_rotation: reports.chart__donut([80, 159], "Rotación del", [
            "Consumo",
            "Existencias"
          ]),
          stock_demand: reports.chart__area([10, 15, 5, 12, 12, 13, 19]), //Demanda diaría en una semana [Lun, Mar, Mie, Jue, Vie, Sab, Dom]
          stock_devolution: reports.chart__donut(
            [30, 80],
            "Devoluciones del",
            ["Devoluciones", "Compras"],
            ["#E91E63", "#3f72af"]
          ),
          stock_claims: reports.chart__donut(
            [10, 80],
            "Reclamos del",
            ["Reclamos", "Compras"],
            ["#FFC107", "#3f72af"]
          ),
          stock_days: null,
          stock_costs: reports.chart__donut(
            [50, 80],
            "Beneficios del",
            ["Precio", "Costo"],
            null,
            "benefits"
          )
        }));
      });
      setTimeout(()=>{
        this.table.loading = false;
      },600);
    }
  },
  async beforeMount() {
    await this.getConcept()
    const totalConcepts = await concept().get();
    this.$data.table.totalConceptos = totalConcepts.data.totalCount;
    console.log(movements().get());
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

.v-data-table__mobile-row__cell {
  color: #0d47a1;
  font-weight: 500;
}

.absolute-center {
  margin-top: 8px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: calc(100% - 16px);

  @media screen and (max-width: 480px) {
    display: none;
  }
}
.primary {
  background-color: #1867c0 !important;
  border-color: #1867c0 !important;
}
</style>
