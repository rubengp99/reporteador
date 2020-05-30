<template>
    <div class="home">
        <v-container data-app style="padding:0 2.5vw;margin-top: 74px;max-width:97vw;">
            <v-row justify="center">
                <v-col cols="12" md="5">
                    <v-card width="100%" outlined>
                        <v-row justify="center">
                            <coinType />
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <dCard col="3" icon img="savings" text="Ingresos." :title="moneda === '$' ? gains$ : gainsBs" :loading="loading[0]"/>
                <dCard col="3" icon img="factura" text="Facturas." :title="invoices" :loading="loading[1]"/>
                <dCard col="3" icon img="boxOF" text="Conceptos bajo el mínimo." :title="stockMin" :loading="loading[2]" hoverable @click.native.stop="stockMinDialog = !stockMinDialog"/>
                <dCard col="3" icon img="boxO" text="Conceptos sobre el máximo." :title="stockMax" :loading="loading[3]" hoverable @click.native.stop="stockMaxDialog = !stockMaxDialog"/>
            </v-row>
            <v-row>
                <dCard col="4" icon img="box"  title="Inventario" hoverable path="/Inventario"/>
                <dCard col="4" icon img="payment" title="Ventas" hoverable path="/Ventas"/>
                <dCard col="4" icon img="value" title="Rentabilidad" hoverable last path="/Rentabilidad"/>
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

        <stockConceptsDialog v-if="stockMinDialog" :concepts="stockMinConcepts" :show="stockMinDialog" existencia="Mínima"> 
            <template v-slot:close>
                <v-btn icon large  @click="stockMinDialog = !stockMinDialog" style="position:absolute;right:0;z-index:1;"><v-icon>close</v-icon></v-btn>
            </template>
        </stockConceptsDialog>

        <stockConceptsDialog v-if="stockMaxDialog" :concepts="stockMaxConcepts" :show="stockMaxDialog" existencia="Máxima">
            <template v-slot:close>
                <v-btn icon large @click="stockMaxDialog = !stockMaxDialog" style="position:absolute;right:0;z-index:1;"><v-icon>close</v-icon></v-btn>
            </template>
        </stockConceptsDialog>
    </div>
</template>

<script>
import dTable from "@/components/dashboard/dTable"
import dCard from "@/components/aplicacion/Dashcard"
import stockConceptsDialog from "@/components/dashboard/conceptsTable"
import moment from "moment";
import accounting from 'accounting';
import storages from '@/services/Depositos';
import reports from '@/plugins/reports'
import monedas from '@/plugins/monedas';
import loader from '@/components/aplicacion/loading'
import coinType from '@/components/aplicacion/coinSelector'
import w from '@/services/variables';
import { mapState } from 'vuex';

export default {
    name: "Home",
    components: {
        dCard: dCard,
        storagesTables: dTable,
        loader: loader,
        stockConceptsDialog,
        coinType
    },
    head: {
        title() {
            return {
                inner: "Reporteador",
                separator:'|',
                complement:'Inicio'
            };
        }
    },
    data() {
        return {
            apiInvoices: null,
            apiGroups: null,
            apiSubGroups: null,
            apiConcepts: null,
            sVentas: null,
            groupSales: null,
            apiStorages: null,
            gains$: 0,
            gainsBs: 0,
            invoices: 0,
            stockMin: 0,
            stockMax: 0,
            storages: [],
            //[ganancias, facturas, existencia min, existencia max, grupos vendidos, depositos]
            loading: [true, true, true, true,true, true],
            //
            series: [], 
            ranking: null,  
            stockMinDialog: false,
            stockMaxDialog: false,
            stockMinConcepts: [],
            stockMaxConcepts: [],
            ...monedas,           
        }
    },
    computed:{
        ...mapState(['dashboardUpdated','vuexTodayInvoices','vuexStorages','vuexConcepts','vuexInvoices','vuexGroupSales','vuexSubGroupSales','vuexGroups','vuexSubGroups']),
    },
    methods:{
        /*
        Diseñado para crear la primera fila de datos:
            --Nro de Facturas hoy
            --Ganancias del día
            --?
            --?
        */
        async createGains(){
            this.apiInvoices = this.vuexTodayInvoices;
            //sumamos las ganancias producidas por esa cantidad de facturas
            try {
                //cantidad de facturas hoy
                this.invoices =  this.apiInvoices.data.count;
                this.loading[1] = false;
                this.apiInvoices.data.data.filter(i => i.detalles.filter(d => this.$data.gains$ += +d.precio_dolar * +Math.trunc(+d.cantidad)));
                this.apiInvoices.data.data.filter(i => i.detalles.filter(d => this.$data.gainsBs += +d.precio * +Math.trunc(+d.cantidad)));
            } catch (e) {
                this.$data.gains$ = 0;
                this.$data.invoices = 0;
            }
            this.loading[0] = false;
            //le damos un formato contable
            this.$data.gains$ = accounting.formatMoney(+this.$data.gains$, { symbol: "$", thousand : ".", decimal  : ",", });
            this.$data.gainsBs = accounting.formatMoney(+this.$data.gainsBs, { symbol: "Bs", thousand : ".", decimal  : ",", });
        },
        async createStocks(){
            this.stockMinConcepts = [];
            this.stockMaxConcepts = [];
            this.apiConcepts = this.vuexConcepts;
            try{
                //productos con existencia mínima y máxima
                for (let concept of this.apiConcepts.data.data){
                    this.stockMin += typeof concept.existencia_minima === 'undefined' ? 0 : +concept.existencia_minima > +this.getExistencias(concept) ? 1 : 0;
                    if (typeof concept.existencia_minima === 'undefined' ? false : (+concept.existencia_minima > +this.getExistencias(concept))) this.stockMinConcepts.push(concept);
                    this.stockMax += typeof concept.existencia_maxima === 'undefined' ? 0 : +this.getExistencias(concept) > +concept.existencia_maxima ? 1 : 0;
                    if (typeof concept.existencia_maxima === 'undefined' ? false : (+this.getExistencias(concept) > +concept.existencia_maxima)) this.stockMaxConcepts.push(concept);
                }
            }catch(e){
                null
            }
            this.loading[2] = false;
            this.loading[3] = false;

        },
        /*
        Diseñado para crear la segunda fila de datos (0-50%):
            --Ranking de ventas por grupos (Gráfico)
        */
        async createGroupsRank(){
            try {
                this.apiGroups = this.vuexGroups;
                this.apiSubGroups = this.vuexSubGroups;
                this.apiSubGroups = this.$data.apiSubGroups.data.data;
                this.groupSales = this.vuexGroupSales;
                let max = this.apiSubGroups.length;
                let gVentas = this.$data.groupSales.data.data.slice(0,5);
                this.sVentas = this.vuexSubGroupSales.data.data;
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
                    this.series[i].data[j].x = typeof this.sVentas.find(a => a.adm_grupos_id === gVentas[j].id && a.id === i) !== 'undefined' ?  
                                                    this.sVentas.find(a => a.adm_grupos_id === gVentas[j].id && a.id === i).nombre  : '';
                    this.series[i].data[j].y = typeof this.sVentas.find(a => a.adm_grupos_id === gVentas[j].id && a.id === i) !== 'undefined' ?  
                                                    Math.trunc(this.sVentas.find(a => a.adm_grupos_id === gVentas[j].id && a.id === i).venta) : 0;
                    }
                }
                this.ranking = reports.chart__barRank(this.series,
                    [gVentas[0].nombre,gVentas[1].nombre,gVentas[2].nombre,gVentas[3].nombre,gVentas[4].nombre],
                    moment(w.test).locale('es').format('MMM Do YYYY').charAt(0).toUpperCase() + moment(w.test).locale('es').format('MMM Do YYYY').slice(1,14),
                );
            } catch (e) {
                null
            }

            this.loading[4] = false;
        },
        /*
        Diseñado para crear la segunda fila de datos (50%-100%):
            --Valorización depósitos (tabla)
        */
        async createStorageValue(){
            this.apiStorages = this.vuexStorages;
            try{
                for (const storage of this.$data.apiStorages.data.data) {
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
                this.loading[5] = false;
                this.storages = [];
            }
        },
        getExistencias(concept){
            return (Array.isArray(concept.existencias) ? concept.existencias.length > 0 ? concept.existencias.map(a => Math.trunc(+a.existencia)).reduce((a,b) => a+b) : 0 : concept.existencias);
        }
    },
    watch:{
        vuexConcepts(){
            this.apiConcepts = this.vuexConcepts;
            this.createStocks();
        },
        vuexInvoices(){
            this.apiInvoices = this.vuexInvoices;
            this.createGains();
        },
        vuexGroups(){
            this.apiGroups = this.vuexGroups;
            this.apiGroups =  this.apiGroups.data.data;
        },
        vuexSubGroups(){
            this.apiSubGroups = this.vuexSubGroups;
            this.apiSubGroups = this.apiSubGroups.data.data;
        },
        vuexSubGroupSales(){
            this.sVentas = this.vuexSubGroupSales;
            this.sVentas = this.$data.sVentas.data.data;
        },
        vuexGroupSales(){
            this.groupSales = this.vuexGroupSales;
        },
        vuexStorages(){
            this.apiStorages = this.vuexStorages;
            this.createStorageValue();
        },
        vuexTodayInvoices(){
            this.apiInvoices = this.vuexTodayInvoices;
        },
        dashboardUpdated(){
            this.createGains();
            this.createStocks();
            this.createGroupsRank();
            this.createStorageValue();
        }
    },
    beforeMount(){
        if(this.dashboardUpdated){
            this.createGains();
            this.createStocks();
            this.createGroupsRank();
            this.createStorageValue();
        }
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