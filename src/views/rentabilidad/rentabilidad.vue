<template>
    <div style="margin-top:79px;padding: 0 20px;">
        <v-row justify="center">
            <v-col cols="12" md="5">
                <v-card width="100%" outlined :style="!isDesktop ? 'padding: 0 10px;' : ''">
                    <v-row justify="center">
                        <coinType :hideTitle="!isDesktop"/>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="report-container">
            <v-col cols="12" lg="6" class="report">
                <dCard col="12" icon img="facturacion" :title="`Facturación`" hoverable rmPadding :path="!isDesktop ? `/rentabilidad/incremento-facturas` : ''" last />
                <v-card style="width:100%;margin: 10px 0;"
                    v-if="$route.params.reporte === `incremento-facturas` || isDesktop"
                >
                    <timeLapse :rangos="rangosFacturaVs" :rango.sync="rangoFacturaVs" hideTitle :loading="facturasComp[2]"/>
                </v-card>
                <v-card width="100%">
                    <v-expand-transition>
                        <compareCard 
                            style="margin-bottom: 20px;"
                            v-if="$route.params.reporte === `incremento-facturas` || isDesktop"
                            title="N° de Facturas"
                            tipo="total" 
                            moneda='facturas' 
                            :loading="facturasComp[2]" 
                            :chart="facturas"
                            :formula="
                                apiFacturas
                                    .map(i=> +i.cantidad)[0] 
                                / apiFacturas
                                    .map(i=> +i.cantidad)[1]"
                            :rango="rangoFacturaVs.split(' ')[1]"
                            :rangos="rangoFacturaVs !== 'Rango' ? fechasFacturaVs : dateFacturaVs"
                        />
                    </v-expand-transition>
                </v-card>

                <lapseDialog v-if="rangoFacturaVs === 'Personalizado'" :dialog="rangoFacturaVs === 'Personalizado'" :disabled="dateFacturaVs.lapseA.some(i => i === '')"> 
                    <template v-slot:close>
                        <v-btn color="#d33" @click="rollbackFacturaVs()" style="margin-left: 20px;color:white;"> <v-icon>close</v-icon> <strong>cancelar</strong></v-btn>
                    </template>
                    <template v-slot:lapse-a>
                        <timeLapse :rangos.sync="dateFacturaVs.lapseA" hideTitle :loading="facturasComp[2]" isDate style="pading: 0 24px;"/>
                    </template>
                    <template v-slot:lapse-b>
                        <timeLapse :rangos.sync="dateFacturaVs.lapseB" hideTitle :loading="facturasComp[2]" isDate style="pading: 0 24px;"/>
                    </template>
                    <template v-slot:ok>
                        <v-btn color="indigo" @click="proceedFacturaVs()" style="margin-left: 20px;color:white;" :disabled="dateFacturaVs.lapseB.some(i => i === '')"> <v-icon>check</v-icon> <strong>buscar</strong></v-btn>
                    </template>
                </lapseDialog>
            </v-col >
            <v-col cols="12" lg="6" class="report">
                <dCard col="12" icon img="savings" :title="`Ingreso Mensual`" hoverable rmPadding :path="!isDesktop ? `/rentabilidad/incremento-ingresos` : ''" last/>
                <v-card style="width:100%;margin: 10px 0;"
                    v-if="$route.params.reporte === `incremento-ingresos` || isDesktop"
                >
                    <timeLapse :rangos="rangosIngresosVs" :rango.sync="rangoIngresosVs" hideTitle :loading="ingresosComp[2]"/>
                </v-card>
                <v-expand-transition>
                    <compareCard
                        style="margin-bottom: 20px;"
                        v-if="$route.params.reporte === `incremento-ingresos` || isDesktop"
                        title="Ingreso"
                        :moneda="moneda" 
                        tipo="ingreso" 
                        :loading="ingresosComp[2]"
                        :chart="ingresos" 
                        :formula="
                            apiIngresos
                                .map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares)[0] 
                            / apiIngresos
                                .map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares)[1]"
                        :rango="rangoIngresosVs.split(' ')[1]"
                        :rangos="rangoIngresosVs !== ' Rango' ? fechasIngresosVs :  dateIngresosVs"
                    />
                </v-expand-transition>

                <lapseDialog v-if="rangoIngresosVs === 'Personalizado'" :dialog="rangoIngresosVs === 'Personalizado'" :disabled="dateIngresosVs.lapseA.some(i => i === '')"> 
                    <template v-slot:close>
                        <v-btn color="#d33" @click="rollbackIngresosVs()" style="margin-left: 20px;color:white;"> <v-icon>close</v-icon> <strong>cancelar</strong></v-btn>
                    </template>
                    <template v-slot:lapse-a>
                        <timeLapse :rangos.sync="dateIngresosVs.lapseA" hideTitle :loading="ingresosComp[2]" isDate style="pading: 0 24px;"/>
                    </template>
                    <template v-slot:lapse-b>
                        <timeLapse :rangos.sync="dateIngresosVs.lapseB" hideTitle :loading="ingresosComp[2]" isDate style="pading: 0 24px;"/>
                    </template>
                    <template v-slot:ok>
                        <v-btn color="indigo" @click="proceedIngresosVs()" style="margin-left: 20px;color:white;" :disabled="dateIngresosVs.lapseB.some(i => i === '')"> <v-icon>check</v-icon> <strong>buscar</strong></v-btn>
                    </template>
                </lapseDialog>
            </v-col >
            <v-col cols="12" lg="6" class="report">
                <dCard col="12" icon img="benefits" :title="`Rentabilidad de Ventas`" hoverable rmPadding :path="!isDesktop ? `/rentabilidad/rentabilidad-ventas` : ''" last/>
                <v-card style="width:100%;margin: 10px 0;"
                    v-if="$route.params.reporte === `rentabilidad-ventas` || isDesktop"
                >
                    <timeLapse :rangos.sync="fechasComprasVsVentas" hideTitle :loading="comprasVsVentasComp[2]" isDate/>
                </v-card>
                <v-expand-transition>
                    <rentabilidadCard
                        style="margin-bottom: 20px;"
                        v-if="$route.params.reporte === `rentabilidad-ventas` || isDesktop" 
                        :moneda="moneda" 
                        entidad="Empresa"
                        variableA="Ventas"
                        variableB="Costos"
                        :loading="comprasVsVentasComp[2]" 
                        :chart="comprasVsVentas" 
                        :formula="
                            (apiComprasVsVentas
                                .map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares)[0] 
                            - apiComprasVsVentas
                                .map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares)[1]) 
                            / apiComprasVsVentas
                                .map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares)[0]"
                    />
                </v-expand-transition>
            </v-col >
        </v-row>
    </div>
</template>

<script>
import reports from '@/plugins/reports';
import monedas from '@/plugins/monedas';
import compareCard from '@/components/rentabilidad/compareCard';
import rentabilidadCard from '@/components/rentabilidad/rentabilidadCard';
import coinType from '@/components/aplicacion/coinSelector'
import timeLapse from '@/components/rentabilidad/timeLapseSelector'
import lapseDialog from '@/components/rentabilidad/timeLapseDialog'
import dCard from "@/components/aplicacion/Dashcard";
import invoices from "@/services/Factura";
import compras from "@/services/Compras";
import sellers from "@/services/Vendedores";
import moment from "moment";
import router from '@/router';
import { mapState } from 'vuex';

import w from '@/services/variables';

export default {
    name:'rentabilidad',
    components:{
        compareCard,
        rentabilidadCard,
        dCard,
        coinType,
        timeLapse,
        lapseDialog
    },
    data(){
        return{
            w,
            router,
            ingresos: { series: [], chartOptions: {}},
            apiIngresos:[],
            facturas: { series: [], chartOptions: {} },
            apiFacturas:[],
            comprasVsVentas: {},
            apiComprasVsVentas:[],
            //Los primeros dos Boolean son para saber si se cargaron los datos
            //el tercero es para avisar que ya se aún sigue cargando el analisis.
            ingresosComp: [false, false, true],
            facturasComp: [false, false, true],
            comprasVsVentasComp: [false, false, true],
            rangoFacturaVs: ' Mes',
            rangosFacturaVs: ['Vs. Semana Pasada','Vs. Mes Pasado','Vs. Año Pasado', "Personalizado"],
            fechasFacturaVs: [
                moment(w.test).locale('es').subtract(1,'months').format('MMMM [de] YYYY'),
                moment(w.test).locale('es').format('MMMM [de] YYYY'),
                "",
                ""
            ],
            dateFacturaVs: {
                lapseA: ["",""],
                lapseB: ["",""]
            },
            goFacturaVs: false,
            rangoIngresosVs: ' Mes',
            rangosIngresosVs: ['Vs. Semana Pasada','Vs. Mes Pasado','Vs. Año Pasado', "Personalizado"],
            fechasIngresosVs: [
                moment(w.test).locale('es').subtract(1,'months').format('MMMM [de] YYYY'),
                moment(w.test).locale('es').format('MMMM [de] YYYY'),
            ],
            dateIngresosVs: {
                lapseA: ["",""],
                lapseB: ["",""]
            },
            goIngresosVs: false,
            fechasComprasVsVentas: ["", ""],
            isDesktop:true,
            isSearch: false,
            ...monedas,
        }
    },
    computed:{
        ...mapState([
            'vuexComprasVsVentas', 'vuexIngresosVs','vuexFacturasVs', 'vuexComprasVsVentasComp', 'vuexInvoices',
            'vuexFacturasComp', 'vuexIngresosComp','ingresosVsUpdated','facturasVsUpdated', 'comprasVsVentasUpdated',
            'valueFixArr', "totalCompras", "totalVendedores"
        ]),
    },
    methods:{
        async createFacturasComp(){
            try {
                if (this.vuexFacturasVs === null) return;

                this.apiFacturas = this.vuexFacturasVs;
                this.facturasComp = this.vuexFacturasComp;
                
                this.createFacturaVsGrafico();
            } catch (error) {
                this.$toasted.error("Ha habido un problema analizando las facturas...", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'error_outline'
                });
            }
        },
        createFacturaVsGrafico(){
            let data = this.apiFacturas.sort((a,b) => (b.mesActual < a.mesActual) ? 1 : -1);
            data = data.map(i=> +i.cantidad);
            
            if (data[1] === 0 && data[0] === 0) return 500;

            this.facturas = reports.chart__donut(
                data,
                data[0] > data[1] ? 'Disminuyó un' : 'Aumentó un',             
                [`${this.rangoFacturaVs.split(" ")[1]} Pasad${this.rangoFacturaVs.split(" ")[1] === 'Semana' ? 'a' : 'o'}`, `${this.rangoFacturaVs.split(" ")[1]} Actual`],
                data[0] > data[1] ? ["#009688", "#3F51B5"] : ["#3F51B5","#009688"], 
                "customfix",
                ""
            );
        },
        async createIngresosComp(){
            try {
                if (this.vuexIngresosVs === null) return;

                this.apiIngresos = this.vuexIngresosVs;
                this.ingresosComp = this.vuexIngresosComp;
                
                this.createIngresosVsGrafico();
            } catch (error) {
                this.$toasted.error("Ha habido un problema analizando los ingresos...", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'error_outline'
                });
            }
            
        },
        createIngresosVsGrafico(){
            let data = this.apiIngresos.sort((a,b) => (b.mesActual < a.mesActual) ? 1 : -1);
            data = data.map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares);

            if (data[1] === 0 && data[0] === 0) return 500;

            this.ingresos = reports.chart__donut(
                data,
                data[0] > data[1] ? 'Disminuyó un' : 'Aumentó un',             
                [`${this.rangoIngresosVs.split(" ")[1]} Pasad${this.rangoIngresosVs.split(" ")[1] === 'Semana' ? 'a' : 'o'}`, `${this.rangoIngresosVs.split(" ")[1]} Actual`],                    
                data[0] > data[1] ? ["#009688","#f73859"] : ["#f73859", "#009688"], 
                "customfix",
                this.moneda
            );

            this.$forceUpdate();
        },
        async createComprasVsVentasComp(){
            try {
                if (this.vuexComprasVsVentas === null) return;

                this.apiComprasVsVentas = this.vuexComprasVsVentas;
                this.comprasVsVentasComp = this.vuexComprasVsVentasComp;
                
                this.createComprasVsVentasGrafico();

            } catch (error) {
                this.$toasted.error("Ha habido un problema analizando la rentabilidad...", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'error_outline'
                });
            }

            this.$forceUpdate();
        },
        createComprasVsVentasGrafico(){
            let data = this.apiComprasVsVentas.sort((a,b) => (b.compras < a.compras) ? 1 : -1);
            data = data.map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares);

            if (data[1] === 0 && data[0] === 0) return 500;

            this.comprasVsVentas = reports.chart__donut(
                data,
                'Rentabilidad del',
                ["Ventas", "Costos"],
                data[1] > data[0] ? ["#f73859", "#3F51B5"] : ["#3F51B5","#f73859"], 
                'benefits',
                this.moneda
            );
        },
        async createRentabilidad(){
            this.createFacturasComp();
            this.createIngresosComp();
            this.createComprasVsVentasComp();
        },
        onResize(){
            if (window.innerWidth > 599){
                this.isDesktop = true;
                if (this.$route.name === 'rentabilidad-reporte') this.router.push('/rentabilidad');
            }else
                this.isDesktop = false;
            
        },
        reload(){
            this.isSearch = false;
            this.fechasComprasVsVentas = ["", ""];
            this.ingresosComp = this.ingresosComp.map(i => !i);
            this.facturasComp = this.facturasComp.map(i => !i);
            this.comprasVsVentasComp = this.comprasVsVentasComp.map(i => !i);
        },
        async rangeFacturas(toRange, fromRange, toRange2, fromRange2){
            let extraLimit = typeof fromRange2 !== 'undefined' ? '&before-fecha_at='+fromRange2 : '';

            toRange2 =  typeof toRange2 !== 'undefined' ? toRange2 : toRange;

            await invoices().get('/cantidad?limit='+this.vuexInvoices.data.totalCount+'&after-fecha_at=' + fromRange + '&before-fecha_at='+toRange).then(response => {
                let data = {
                    cantidad: typeof response.data.count !== 'undefined' ? response.data.count : 0,
                    mesActual: 0,
                };

                this.apiFacturas.push(data);
                this.facturasComp[0] = true;
                this.facturasComp[2] = this.facturasComp.slice(0, 2).every(i => !i);

                if(!this.facturasComp[2])
                    if(this.createFacturaVsGrafico() === 500)
                        this.$toasted.error('¡Que pena! No hay información para este rango de fechas.', { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'error_outline'
                        });
            });

            await invoices().get('/cantidad?limit=' + this.vuexInvoices.data.totalCount + '&after-fecha_at=' + toRange2 + extraLimit).then(response => {
                let data = {
                    cantidad: typeof response.data.count !== 'undefined' ? response.data.count : 0,
                    mesActual: 1,
                };

                this.apiFacturas.push(data);
                this.facturasComp[1] = true;
                this.facturasComp[2] = this.facturasComp.slice(0, 2).every(i => !i);

                if(!this.facturasComp[2])
                    if(this.createFacturaVsGrafico() === 500)
                        this.$toasted.error('¡Que pena! No hay información para este rango de fechas.', { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'error_outline'
                        });
            });

        },
        async rangeIngresos(toRange, fromRange, toRange2, fromRange2){
            let extraLimit = typeof fromRange2 !== 'undefined' ? '&before-fecha_at='+fromRange2 : '';

            toRange2 =  typeof fromRange2 !== 'undefined' ? toRange2 : toRange;

            await invoices().get('/total?limit='+this.vuexInvoices.data.totalCount+'&after-fecha_at=' + fromRange + '&before-fecha_at='+toRange).then(response => {
                let data = {
                    bolivares: typeof response.data.data !== 'undefined' ? response.data.data[0].subtotal : 0,
                    dolares: typeof response.data.data !== 'undefined' ? response.data.data[0].subtotal_dolar : 0,
                    mesActual: 0,
                };

                this.apiIngresos.push(data);
                this.ingresosComp[0] = true;
                this.ingresosComp[2] = this.ingresosComp.slice(0, 2).every(i => !i);

                if(this.ingresosComp[2])
                    if(this.createIngresosVsGrafico() === 500)
                        this.$toasted.error('¡Que pena! No hay información para este rango de fechas.', { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'error_outline'
                        });
            });

            await invoices().get('/total?limit=' + this.vuexInvoices.data.totalCount + '&after-fecha_at=' + toRange2 + extraLimit).then(response => {
                let data = {
                    bolivares: typeof response.data.data !== 'undefined' ? response.data.data[0].subtotal : 0,
                    dolares: typeof response.data.data !== 'undefined' ? response.data.data[0].subtotal_dolar : 0,
                    mesActual: 1,
                };

                this.apiIngresos.push(data);
                this.ingresosComp[0] = true;
                this.ingresosComp[2] = this.ingresosComp.slice(0, 2).every(i => !i);

                if(this.ingresosComp[2])
                    if(this.createIngresosVsGrafico() === 500)
                        this.$toasted.error('¡Que pena! No hay información para este rango de fechas.', { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'error_outline'
                        });
            });

        },
        async rangeComprasVsVentas(toRange, fromRange){

            await compras().post('/costos?limit=' + this.totalCompras+'&after-fecha_at=' + fromRange + '&before-fecha_at='+toRange).then(response => {                
                let data;
                try{
                    data = {
                        bolivares: Math.round(response.data.data.map(i => +i.costo_total).reduce((a, b) => a + b) * 100) / 100,
                        dolares: Math.round(response.data.data.map(i => +i.costo_total_dolar).reduce((a, b) => a + b) * 100) / 100,
                        compras: 1,
                    };
                }catch(e){
                    data = {
                        bolivares: 0,
                        dolares: 0,
                        compras: 1,
                    };
                }

                this.apiComprasVsVentas.push(data);
                this.comprasVsVentasComp[0] = true;
                this.comprasVsVentasComp[2] = this.comprasVsVentasComp.slice(0, 2).every(i => !i);

                if (!this.comprasVsVentasComp[2]) 
                    if(this.createComprasVsVentasGrafico() === 500)
                        this.$toasted.error('¡Que pena! No hay información para este rango de fechas.', { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'error_outline'
                        });
            
            });

            await sellers().get('/mostsellers/?limit=' + this.totalVendedores+'&after-fecha_at=' + fromRange + '&before-fecha_at='+toRange).then(response => {
                
                let data 
                try {
                    data = {
                        bolivares: Math.round(response.data.data.map(i => +i.venta_total).reduce((a, b) => a + b) * 100) / 100,
                        dolares: Math.round(response.data.data.map(i => +i.venta_total_dolar).reduce((a, b) => a + b) * 100) / 100,
                        compras: 0,
                    };
                } catch (e) {
                    data = {
                        bolivares: 0,
                        dolares: 0,
                        compras: 0,
                    };
                }

                this.apiComprasVsVentas.push(data);
                this.comprasVsVentasComp[0] = true;
                this.comprasVsVentasComp[2] = this.comprasVsVentasComp.slice(0, 2).every(i => !i);

                if (!this.comprasVsVentasComp[2]) 
                    if(this.createComprasVsVentasGrafico() === 500)
                        this.$toasted.error('¡Que pena! No hay información para este rango de fechas.', { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'error_outline'
                        });
            });

        },
        rollbackFacturaVs(){
            this.rangoFacturaVs = ' Mes';
            this.dateFacturaVs.lapseA = ["", ""];
            this.dateFacturaVs.lapseB = ["", ""];
            this.apiFacturas = this.vuexFacturasVs;
            this.facturasComp = this.vuexFacturasComp;
            this.createFacturaVsGrafico();
            this.$forceUpdate();
        },
        proceedFacturaVs(){
            this.goFacturaVs = !this.goFacturaVs
            this.rangoFacturaVs = ' Rango';
        },
        rollbackIngresosVs(){
            this.rangoIngresosVs = ' Mes';
            this.dateIngresosVs.lapseA = ["", ""];
            this.dateIngresosVs.lapseB = ["", ""];
            this.apiIngresos = this.vuexIngresosVs;
            this.ingresosComp = this.vuexIngresosComp;
            this.createIngresosVsGrafico();
            this.$forceUpdate();
        },
        proceedIngresosVs(){
            this.goIngresosVs = !this.goIngresosVs
            this.rangoIngresosVs = ' Rango';
        }
    },
    watch:{
        vuexComprasVsVentasComp(newVal){
            if(newVal === this.apiComprasVsVentas || !this.vuexComprasVsVentasComp[2]) return;
            this.createComprasVsVentasComp();
        },
        vuexIngresosComp(newVal){
            if(newVal === this.apiIngresos || !this.vuexIngresosComp[2]) return;
            this.createIngresosComp();
        },
        vuexFacturasComp(newVal){
            if(newVal === this.apiFacturas || !this.vuexFacturasComp[2]) return;
            this.createFacturasComp();
        },
        moneda(){
            this.reload();
            this.createRentabilidad();
            this.reload();
        },
        async rangoFacturaVs(newVal, oldVal){
            if (newVal === oldVal || this.rangoFacturaVs === 'Personalizado' || this.rangoFacturaVs === ' Rango') return;
            
            this.isSearch = true;
            let fromRange, toRange;
            this.facturasComp = this.facturasComp.map(i => !i);
            this.apiFacturas = [];

            if (this.rangoFacturaVs === "Vs. Semana Pasada" && newVal !== oldVal ) {
                fromRange = moment(w.test).locale('es').subtract(14, 'days').format('YYYY-MM-DD');
                toRange = moment(w.test).locale('es').subtract(7, 'days').format('YYYY-MM-DD');

                this.fechasFacturaVs[0] = moment(fromRange).locale('es').format("MMMM Do [de] YYYY") + " al " + moment(toRange).locale('es').format("MMMM Do [de] YYYY");
                this.fechasFacturaVs[1] = moment(toRange).locale('es').format("MMMM Do [de] YYYY") + " al Presente" ;

                await this.rangeFacturas(toRange, fromRange);
            }else if (this.rangoFacturaVs === "Vs. Mes Pasado" && newVal !== oldVal ) {
                fromRange = moment(w.test).locale('es').subtract(1, 'months').format('YYYY-MM-DD');
                toRange = moment(w.test).locale('es').format('YYYY-MM-DD');
                
                this.fechasFacturaVs[0] = moment(fromRange).locale('es').format("MMMM Do [de] YYYY") + " al " + moment(toRange).locale('es').format("MMMM Do [de] YYYY");
                this.fechasFacturaVs[1] = moment(toRange).locale('es').format("MMMM Do [de] YYYY") + " al Presente";

                await this.rangeFacturas(toRange, fromRange);
            }else if (this.rangoFacturaVs === "Vs. Año Pasado" && newVal !== oldVal ) {
                fromRange = moment(w.test).locale('es').subtract(2, 'years').format('YYYY-MM-DD');
                toRange = moment(w.test).locale('es').subtract(1, 'years').format('YYYY-MM-DD');
                
                this.fechasFacturaVs[0] = moment(fromRange).locale('es').format("MMMM Do [de] YYYY") + " al " + moment(toRange).locale('es').format("MMMM Do [de] YYYY");
                this.fechasFacturaVs[1] = moment(toRange).locale('es').format("MMMM Do [de] YYYY") + " al Presente";

                await this.rangeFacturas(toRange, fromRange);
            }else{
                this.apiFacturas = this.vuexFacturasVs;
                this.facturasComp = this.vuexFacturasComp;
                this.createFacturaVsGrafico();
            }    
        },
        async rangoIngresosVs(newVal, oldVal){
            if (newVal === oldVal || this.rangoIngresosVs === 'Personalizado' || this.rangoIngresosVs === ' Rango' || this.rangoFacturaVs === ' Mes') return;
            
            this.isSearch = true;
            let fromRange, toRange;
            this.ingresosComp = this.ingresosComp.map(i => !i);
            this.apiIngresos = [];

            if (this.rangoIngresosVs === "Vs. Semana Pasada" && newVal !== oldVal ) {
                fromRange = moment(w.test).locale('es').subtract(14, 'days').format('YYYY-MM-DD');
                toRange = moment(w.test).locale('es').subtract(7, 'days').format('YYYY-MM-DD');

                this.fechasIngresosVs[0] = moment(fromRange).locale('es').format("MMMM Do [de] YYYY") + " al " + moment(toRange).locale('es').format("MMMM Do [de] YYYY");
                this.fechasIngresosVs[1] = moment(toRange).locale('es').format("MMMM Do [de] YYYY") + " al Presente";

                await this.rangeIngresos(toRange, fromRange);
            }else if (this.rangoIngresosVs === "Vs. Mes Pasado" && newVal !== oldVal ) {
                fromRange = moment(w.test).locale('es').subtract(2, 'months').format('YYYY-MM-DD');
                toRange = moment(w.test).locale('es').subtract(1, 'months').format('YYYY-MM-DD');
                
                this.fechasIngresosVs[0] = moment(fromRange).locale('es').format("MMMM Do [de] YYYY") + " al " + moment(toRange).locale('es').format("MMMM Do [de] YYYY");
                this.fechasIngresosVs[1] = moment(toRange).locale('es').format("MMMM Do [de] YYYY") + " al Presente";

                await this.rangeIngresos(toRange, fromRange);
            }else if (this.rangoIngresosVs === "Vs. Año Pasado" && newVal !== oldVal ) {
                fromRange = moment(w.test).locale('es').subtract(2, 'years').format('YYYY-MM-DD');
                toRange = moment(w.test).locale('es').subtract(1, 'years').format('YYYY-MM-DD');
                
                this.fechasIngresosVs[0] = moment(fromRange).locale('es').format("MMMM Do [de] YYYY") + " al " + moment(toRange).locale('es').format("MMMM Do [de] YYYY");
                this.fechasIngresosVs[1] = moment(toRange).locale('es').format("MMMM Do [de] YYYY") + " al Presente";

                await this.rangeIngresos(toRange, fromRange);
            }else{
                this.apiIngresos = this.vuexIngresosVs;
                this.ingresosComp = this.vuexIngresosComp;
                this.createIngresosVsGrafico();
            }
        },
        fechasComprasVsVentas: {
            async handler() {
                if (this.fechasComprasVsVentas.some(i => i === "")) return;

                this.isSearch = true;
                this.comprasVsVentasComp = this.comprasVsVentasComp.map(i => !i);
                this.apiComprasVsVentas = [];
                await this.rangeComprasVsVentas(this.fechasComprasVsVentas[1], this.fechasComprasVsVentas[0])
            }, 
            deep: true,
        },
        goFacturaVs: {
            async handler() {
                if (this.dateFacturaVs.lapseA.some(i => i === "") || this.dateFacturaVs.lapseB.some(i => i === "")) return;
                
                this.isSearch = true;
                this.facturasComp = this.facturasComp.map(i => !i);
                this.apiFacturas = [];
                
                this.rangeFacturas(
                    this.dateFacturaVs.lapseA[1],
                    this.dateFacturaVs.lapseA[0],
                    this.dateFacturaVs.lapseB[0],
                    this.dateFacturaVs.lapseB[1],
                    );
            },
            deep: true
        },
        goIngresosVs: {
            async handler() {
                if (this.dateIngresosVs.lapseA.some(i => i === "") || this.dateIngresosVs.lapseB.some(i => i === "")) return;
                
                this.isSearch = true;
                this.ingresosComp = this.ingresosComp.map(i => !i);
                this.apiIngresos = [];
                
                this.rangeIngresos(
                    this.dateIngresosVs.lapseA[1],
                    this.dateIngresosVs.lapseA[0],
                    this.dateIngresosVs.lapseB[0],
                    this.dateIngresosVs.lapseB[1],
                    );
            },
            deep: true
        }
    },
    created(){
        window.addEventListener('resize', this.onResize);
        this.onResize();
    },
    async beforeMount(){
        await this.createRentabilidad();
    },
    async beforeUpdate(){
        if (this.isSearch) {
            this.createFacturaVsGrafico();
            this.createIngresosVsGrafico();    
            return
        }
        this.createRentabilidad();
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },

}
</script>

<style lang="scss">

.report-container{
    .report{
        padding: 0px 15px!important;
    }
/*
    .report:nth-last-child(1):nth-child(odd){
        flex: 0 0 100%;
        max-width: 100%;
    }*/
}

</style>