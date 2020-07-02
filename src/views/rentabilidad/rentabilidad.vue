<template>
    <div style="margin-top:79px;padding: 0 20px;">
        <v-row justify="center">
            <v-col cols="12" md="5">
                <v-card width="100%" outlined>
                    <v-row justify="center">
                        <coinType />
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="report-container">
            <v-col cols="12" lg="6" class="report">
                <dCard col="12" icon img="facturacion" :title="`Facturación`" hoverable rmPadding :path="!isDesktop ? `/rentabilidad/incremento-facturas-${rango}` : ''" last />
                <v-card width="100%">
                    <v-expand-transition>
                        <compareCard 
                            style="margin-bottom: 20px;"
                            v-if="$route.params.reporte === `incremento-facturas-${rango}` || isDesktop"
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
                        
                        />
                    </v-expand-transition>
                </v-card>
            </v-col >
            <v-col cols="12" lg="6" class="report">
                <dCard col="12" icon img="savings" :title="`Ingreso Mensual`" hoverable rmPadding :path="!isDesktop ? `/rentabilidad/incremento-ingresos-${rango}` : ''" last/>
                <v-expand-transition>
                    <compareCard
                        style="margin-bottom: 20px;"
                        v-if="$route.params.reporte === `incremento-ingresos-${rango}` || isDesktop"
                        title="Ingreso Mensual"
                        :moneda="moneda" 
                        tipo="ingreso" 
                        :loading="ingresosComp[2]"
                        :chart="ingresos" 
                        :formula="
                            apiIngresos
                                .map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares)[0] 
                            / apiIngresos
                                .map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares)[1]"
                    />
                </v-expand-transition>
            </v-col >
            <v-col cols="12" lg="6" class="report">
                <dCard col="12" icon img="benefits" :title="`Rentabilidad de Ventas`" hoverable rmPadding :path="!isDesktop ? `/rentabilidad/rentabilidad-ventas-${rango}` : ''" last/>
                <v-expand-transition>
                    <rentabilidadCard
                        style="margin-bottom: 20px;"
                        v-if="$route.params.reporte === `rentabilidad-ventas-${rango}` || isDesktop" 
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
import dCard from "@/components/aplicacion/Dashcard";
import router from '@/router';
import { mapState } from 'vuex';

import w from '@/services/variables';

export default {
    name:'rentabilidad',
    components:{
        compareCard,
        rentabilidadCard,
        dCard,
        coinType
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
            rango: 'Mes',
            rangos: ['Semana','Mes','Año', 'Todo'],
            isDesktop:true,
            ...monedas,
        }
    },
    computed:{
        ...mapState([
            'vuexComprasVsVentas', 'vuexIngresosVs','vuexFacturasVs', 'vuexComprasVsVentasComp', 
            'vuexFacturasComp', 'vuexIngresosComp','ingresosVsUpdated','facturasVsUpdated', 'comprasVsVentasUpdated'
        ]),
    },
    methods:{
        async createFacturasComp(){
            try {
                if (this.vuexFacturasVs === null) return;

                this.apiFacturas = this.vuexFacturasVs;
                this.facturasComp = this.vuexFacturasComp;
                let data = this.apiFacturas.sort((a,b) => b.mesActual+a.mesActual);
                this.facturas = reports.chart__donut(
                    data.map(i=> +i.cantidad),
                    data[0]/data[1] <= 1 ? 'Aumentó un' : 'Disminuyó un',             
                    data[0]/data[1] <= 1 ? [`${this.rango} Actual`, `${this.rango} Pasad${this.rango === 'Semana' ? 'a' : 'o'}`] : [`${this.rango} Actual`, `${this.rango} Pasad${this.rango === 'Semana' ? 'a' : 'o'}`] ,
                    data[0]/data[1] <= 1 ? ["#3F51B5","#009688"] : ["#009688", "#3F51B5"], 
                    'cantidad'
                );
                
            } catch (error) {
                this.$toasted.error("Ha habido un problema analizando las facturas...", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'error_outline'
                });
            }
        },
        async createIngresosComp(){
            try {
                if (this.vuexIngresosVs === null) return;

                this.apiIngresos = this.vuexIngresosVs;
                this.ingresosComp = this.vuexIngresosComp;
                let data = this.apiIngresos.sort((a,b) => b.mesActual+a.mesActual);
                this.ingresos = reports.chart__donut(
                    data.map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares),
                    data[0]/data[1] <= 1 ? 'Aumentó un' : 'Disminuyó un',             
                    data[0]/data[1] <= 1 ? [`${this.rango} Actual`, `${this.rango} Pasad${this.rango === 'Semana' ? 'a' : 'o'}`] : [`${this.rango} Actual`, `${this.rango} Pasad${this.rango === 'Semana' ? 'a' : 'o'}`] ,
                    data[0]/data[1] <= 1 ? ["#009688","#f73859"] : ["#f73859", "#009688"], 
                    null,
                    this.moneda
                );

            } catch (error) {
                this.$toasted.error("Ha habido un problema analizando los ingresos...", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'error_outline'
                });
            }
            
        },
        async createComprasVsVentasComp(){
            try {
                if (this.vuexComprasVsVentas === null) return;

                this.apiComprasVsVentas = this.vuexComprasVsVentas;
                this.comprasVsVentasComp = this.vuexComprasVsVentasComp;
                let data = this.apiComprasVsVentas.sort((a,b) => b.compras+a.compras);
                this.comprasVsVentas = reports.chart__donut(
                    data.map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares),
                    'Rentabilidad del',
                    data[0]/data[1] <= 1 ? ["Costos","Ventas"] : ["Ventas", "Costos"] ,
                    data[0]/data[1] <= 1 ? ["#3F51B5","#f73859"] : ["#f73859", "#3F51B5"], 
                    'benefits',
                    this.moneda
                );

            } catch (error) {
                this.$toasted.error("Ha habido un problema analizando la rentabilidad...", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'error_outline'
                });
            }
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
            this.ingresosComp = this.ingresosComp.map(i => !i);
            this.facturasComp = this.facturasComp.map(i => !i);
            this.comprasVsVentasComp = this.comprasVsVentasComp.map(i => !i);
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
        this.createRentabilidad();
        console.log("a")
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

    .report:nth-last-child(1):nth-child(odd){
        flex: 0 0 100%;
        max-width: 100%;
    }
}

</style>