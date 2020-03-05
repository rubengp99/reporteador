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
              <!--
                Si se va a cargar en modo server side, por página
                añadir las props >>>
                :server-items-length="table.totalConceptos"
                @update:page="paginate"
                y descomentar el código comentado.
              -->
              <v-data-table
                
                :loading="table.loading && '#00E676'"
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
                @update:page="paginate"
                @page-count="table.pageCount = $event"
              >
                <template v-slot:item.price="{ item }">
                  {{ item.price }}
                  <span style="font-size:16px;color:#1B5E20;">$</span>
                </template>
                <template v-slot:item.image="{ item }">
                  <div class="p-2">
                    <v-btn icon height="70px" width="65px" hoverable @focus="open(item)">
                      <v-img
                        :src="(item.icon.toggled)?'/images/boxOF.svg':'/images/box.svg'"
                        :alt="item.name"
                        width="60px"
                        height="65px"
                        style="margin: 0 auto;"
                      ></v-img>
                    </v-btn>
                  </div>
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <v-row style="position:relative;">
                      <chart type="Rotación" :item="item" :options="item.stock_rotation" ctype="donut" height="298" />
                      <v-divider inset vertical class="absolute-center"></v-divider>
                      <chart type="Demanda" :item="item" :options="item.stock_demand" ctype="area" height="252"/>
                    </v-row>
                    <!--linea de gráficos para DIAS DE INVENTARIO-->
                    <v-divider inset></v-divider>
                    <v-row style="position:relative;">
                      <chart type="Reclamos" :item="item" :options="item.stock_claims" ctype="donut" height="298" />
                      <v-divider
                        inset
                        vertical
                        class="absolute-center"
                      ></v-divider>
                      <chart type="Devoluciones" :item="item" :options="item.stock_devolution" ctype="donut" height="298" />
                    </v-row>
                    <v-divider inset></v-divider>
                    <v-row style="position:relative;">
                      <chart type="Agotamiento" :item="item" :options="item.stock_days" ctype="area" height="251"/>
                      <chart type="Rentabilidad" :item="item" :options="item.stock_costs" ctype="donut" height="298"/>
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
import chart from "../components/Chart"
import moment from "moment";
import concept from "../services/Conceptos";
import invoices from "../services/Factura";
import groups from "../services/Grupos"
//import movements from "../services/Movimiento_deposito";
const reports = require("../plugins/reports");

export default {
  name: "Home",
  components: {
    chart: chart,
  },
  data() {
    return {
      apiInvoices: null,
      apiGroups: null,
      table: {
        loading: true,
        expanded: [],
        expand: false,
        search: "",
        //sortBy: ["name", "stock", "sold", "price"],
        //sortDesc: true,
        page: 1,
        page_old: 1,
        pageCount: 0,
        itemsPerPage: 8,
        dataOffset: 0,
        totalConceptos: 0,
        headers: [
          { text: "Más Detalles", align: "left", sortable: false, value: "image" },
          { text: "Producto", align: "left", value: "name", sortable: false, },
          { text: "Categoría", value: "category", sortable: false, },
          { text: "En Inventario", value: "stock", sortable: false, },
          { text: "Vendidos", value: "sold", sortable: false, },
          { text: "Precio", value: "price", sortable: false, },
          { text: "Estadísticas", value: "data-table-expand", sortable: false, }
        ],
        products: [],
      }
    };
  },
  methods: {
    open(item){
      item.icon.toggled = !item.icon.toggled;
    },
    //en caso de carga por paginación, no tocar si no es necesario
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
  
    /* ----------------------------
      Diseñado para configurar:
        -- Demanda Diaria
        -- Rotación de Stock (50%)
        -- Devoluciones
        -- Reclamos??
    */
   //PARA PRUEBAS USAR moment('07/30/2019')
    async configMovements(product){
      let fechas = [];
      for (let i = 0; i < 7; i++) fechas.push(moment().locale('es').subtract(i,'days').format('MMM Do YYYY').charAt(0).toUpperCase() + moment().locale('es').subtract(i,'days').format('MMM Do YYYY').slice(1));
      fechas.reverse();
      let sales = [0,0,0,0,0,0,0];
      this.apiInvoices.data.data.forEach(invoice =>{
        product.sold += (typeof invoice.detalles.find(sold => sold.conceptos_id === product.id) === 'object')?+Math.trunc(invoice.detalles.find(sold => sold.conceptos_id === product.id).cantidad):0;
        //como la factura se devuelve completa, entonces se suman todas las existencias vendidas a devoluciones.
        if (invoice.tipos_facturas_id === 3) product.returned += (typeof invoice.detalles.find(detail => detail.conceptos_id === product.id) === 'object')?+Math.trunc(invoice.detalles.find(detail => detail.conceptos_id === product.id).cantidad):0;
        product.stock_devolution = reports.chart__donut([product.returned, product.sold], "Devoluciones del", ["Devoluciones", "Compras"], ["#E91E63", "#3f72af"]);
          if (typeof fechas.find(date => date === moment(invoice.fecha_at).locale('es').format('MMM Do YYYY').charAt(0).toUpperCase() + moment(invoice.fecha_at).locale('es').format('MMM Do YYYY').slice(1)) !== 'undefined'){
            switch (moment(invoice.fecha_at).locale('es').format('MMM Do YYYY').charAt(0).toUpperCase() + moment(invoice.fecha_at).locale('es').format('MMM Do YYYY').slice(1)){
              case fechas[0]: sales[0]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id).cantidad);break;
              case fechas[1]: sales[1]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id).cantidad);break;
              case fechas[2]: sales[2]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id).cantidad);break;
              case fechas[3]: sales[3]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id).cantidad);break;
              case fechas[4]: sales[4]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id).cantidad);break;
              case fechas[5]: sales[5]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id).cantidad);break;
              case fechas[6]: sales[6]+= (typeof invoice.detalles.find(detalle => detalle.conceptos_id === product.id) === 'undefined')?0:Math.trunc(+invoice.detalles.find(detalle => detalle.conceptos_id === product.id).cantidad);break;
            }
          }
        });
        product.stock_daily_sells = sales;
        fechas = [];
        for (let i = 0; i < 7; i++) fechas.push(moment().locale('es').subtract(i,'days').format('MMM Do').charAt(0).toUpperCase() + moment().locale('es').subtract(i,'days').format('MMM Do').slice(1));
        fechas.reverse();
        product.stock_demand = reports.chart__area(product.stock_daily_sells,fechas);

      return product;
    },
    /* ----------------------------
      Diseñado para configurar:
        -- Inventario
        -- Días de Inventario
        -- Rotación de Stock (50%)
        -- Rentabilidad
    */
    async configStockDays(product) {
      let existencias = await concept().get("/" + product.id + "/depositos");
      existencias.data.data.filter(a => (product.stock += +a.existencia));
      var stock_aux = product.stock;
      var stock_dates = [];
      if(product.stock_daily_sells.reduce((a, b) => a + b) > 0){
          do{
            stock_aux -= (Math.round((product.stock_daily_sells.reduce((a, b) => a + b) / 7) * 100 ) / 100);
            product.stock_end.push(Math.trunc(stock_aux));
            if (stock_aux < 0) break;
          }while (stock_aux > 0)  
        for (let i = 0; i < product.stock_end.length; i++) {
          stock_dates.push(
            moment().locale("EN").add(i, "days").format("MMM Do")
          );
        }
        product.stock_lastDay = moment().locale("ES").add(stock_dates.length - 1, "days").format("LL");
      }else{
        for (let i = 0; i < 7; i++) {
          product.stock_end.push(stock_aux);
          stock_dates.push(
            moment().locale("es").add(i, "days").format("MMM Do").charAt(0).toUpperCase() + moment().locale("es").add(i, "days").format("MMM Do").slice(1)
          );
        }
        product.stock_lastDay = '';
      }

      
      product.stock_days = reports.chart__area(
        product.stock_end,
        stock_dates,
        false,
        "stockdays"
      );

      product.stock_costs = reports.chart__donut(
            [Math.trunc(+product.sale), Math.trunc(+product.cost)],
            "Beneficios del",
            ["Precio", "Costo"],
            null,
            "benefits"
          )

      product.stock_rotation = reports.chart__donut([product.sold, product.stock], "Rotación del", ["Consumo", "Existencias"]);

      return product;
    },
    async getConcept(limit="?offset=" + this.table.dataOffset + "&limit=" + this.table.itemsPerPage) {
      this.table.products = [];
      let aux = [];
      let apiConcepts = await concept().get(limit);
      apiConcepts.data.data.forEach(async concept => {
        aux.push(await this.configStockDays(await this.configMovements({
          icon: {
            img: '/images/box.svg',
            toggled: false,
          },
          id: concept.id,
          codigo: concept.codigo,
          name: concept.nombre,
          stock: 0,
          sold: 0,
          returned: 0,
          sale: concept.precio_a,
          cost: concept.ultimo_costo,
          category: this.apiGroups.data.data.find(group => group.id === concept.grupos_id).nombre,
          price: concept.precio_dolar,
          stock_daily_sells: [10, 15, 5, 12, 12, 13, 19],
          stock_end: [],
          stock_lastDay: "",
          stock_rotation: null,
          stock_demand: null,
          stock_devolution: null,
          stock_claims: reports.chart__donut(
            [10, 80],
            "Reclamos del",
            ["Reclamos", "Compras"],
            ["#FFC107", "#3f72af"]
          ),
          stock_days: null,
          stock_costs: null,
        })));        
      });
      setTimeout(async () =>{
        this.table.products = aux;
        this.table.loading = false;
      },300);
    }
  },
  async beforeMount() {
    this.$data.apiInvoices =  await invoices().get();
    this.$data.apiGroups = await groups().get();
    const totalConcepts = await concept().get();
    this.$data.table.totalConceptos = totalConcepts.data.totalCount;
    await this.getConcept();
    console.log(concept().get());
    console.log(invoices().get());
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
