<template>
    <div style="margin-top:79px;padding: 0 20px;">
        <v-row class="report-container">
            <v-col cols="12" md="6" class="report">
                <dCard col="12" icon img="facturacion" :title="`Facturas - ${rango}`" hoverable rmPadding :path="`/rentabilidad/incremento-facturas-${rango}`" />
                <v-card width="100%">
                    <v-expand-transition>
                        <compareCard 
                            style="margin-bottom: 20px;"
                            v-if="$route.params.reporte === `incremento-facturas-${rango}`"
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
            <v-col cols="12" md="6" class="report">
                <dCard col="12" icon img="savings" :title="`Ingresos - ${rango}`" hoverable rmPadding :path="`/rentabilidad/incremento-ingresos-${rango}`" />
                <v-expand-transition>
                    <compareCard
                        style="margin-bottom: 20px;"
                        v-if="$route.params.reporte === `incremento-ingresos-${rango}`"
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
            <v-col cols="12" md="6" class="report">
                <dCard col="12" icon img="benefits" :title="`Rentabilidad de Ventas`" hoverable rmPadding :path="`/rentabilidad/rentabilidad-ventas-${rango}`"/>
                <v-expand-transition>
                    <rentabilidadCard
                        style="margin-bottom: 20px;"
                        v-if="$route.params.reporte === `rentabilidad-ventas-${rango}`"
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
import compareCard from '@/components/rentabilidad/compareCard';
import rentabilidadCard from '@/components/rentabilidad/rentabilidadCard';
import dCard from "@/components/aplicacion/Dashcard";
import router from '@/router';
import { mapState } from 'vuex';

import w from '@/services/variables';

export default {
    name:'rentabilidad',
    components:{
        compareCard,
        rentabilidadCard,
        dCard
    },
    data(){
        return{
            w,
            router,
            ingresos: {},
            apiIngresos:[],
            facturas: {},
            apiFacturas:[],
            comprasVsVentas: {},
            apiComprasVsVentas:[],
            //Los primeros dos Boolean son para saber si se cargaron los datos
            //el tercero es para avisar que ya se aún sigue cargando el analisis.
            ingresosComp: [false, false, true],
            facturasComp: [false, false, true],
            comprasVsVentasComp: [false, false, true],
            moneda: 'Bs',
            monedas: ['Bolivares','Dolares'],
            rango: 'Mes',
            rangos: ['Semana','Mes','Año']
        }
    },
    computed:{
        ...mapState([
            'vuexComprasVsVentas', 'vuexIngresosVs','vuexFacturasVs', 'vuexComprasVsVentasComp', 
            'vuexFacturasComp', 'vuexIngresosComp','ingresosVsUpdated','facturasVsUpdated', 'comprasVsVentasUpdated'
        ]),
    },
    methods:{
        createFacturasComp(){
            this.apiFacturas = this.vuexFacturasVs;
            this.facturasComp = this.vuexFacturasComp;
            let data = this.apiFacturas.sort((a,b) => a.mesActual-b.mesActual);
            this.facturas = reports.chart__donut(
                data.map(i=> +i.cantidad),
                data[0]/data[1] <= 1 ? 'Aumentó un' : 'Disminuyó un',             
                data[0]/data[1] <= 1 ? [`${this.rango} Actual`, `${this.rango} Pasad${this.rango === 'Semana' ? 'a' : 'o'}`] : [`${this.rango} Actual`, `${this.rango} Pasad${this.rango === 'Semana' ? 'a' : 'o'}`] ,
                data[0]/data[1] <= 1 ? ["#3F51B5","#009688"] : ["#009688", "#3F51B5"], 
                'cantidad'
            );
        },
        createIngresosComp(){
            this.apiIngresos = this.vuexIngresosVs;
            this.ingresosComp = this.vuexIngresosComp;
            let data = this.apiIngresos.sort((a,b) => a.mesActual-b.mesActual);
            this.ingresos = reports.chart__donut(
                data.map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares),
                data[0]/data[1] <= 1 ? 'Aumentó un' : 'Disminuyó un',             
                data[0]/data[1] <= 1 ? [`${this.rango} Actual`, `${this.rango} Pasad${this.rango === 'Semana' ? 'a' : 'o'}`] : [`${this.rango} Actual`, `${this.rango} Pasad${this.rango === 'Semana' ? 'a' : 'o'}`] ,
                data[0]/data[1] <= 1 ? ["#009688","#f73859"] : ["#f73859", "#009688"], 
                null,
                this.moneda
            );
        },
        createComprasVsVentasComp(){
            this.apiComprasVsVentas = this.vuexComprasVsVentas;
            this.comprasVsVentasComp = this.vuexComprasVsVentasComp;
            let data = this.apiComprasVsVentas.sort((a,b) => a.compras-b.compras);
            this.comprasVsVentas = reports.chart__donut(
                data.map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares),
                'Rentabilidad del',
                data[0]/data[1] <= 1 ? ["Costos","Ventas"] : ["Ventas", "Costos"] ,
                data[0]/data[1] <= 1 ? ["#3F51B5","#f73859"] : ["#f73859", "#3F51B5"], 
                'benefits',
                this.moneda
            );  
        },
        createRentabilidad(){
            if(this.facturasVsUpdated) this.createFacturasComp();
            if(this.ingresosVsUpdated) this.createIngresosComp();
            if(this.comprasVsVentasUpdated) this.createComprasVsVentasComp();
        },
    },
    watch:{
        vuexComprasVsVentas(newVal){
            if(newVal === this.apiComprasVsVentas) return;
            this.createComprasVsVentasComp();
        },
        vuexIngresosVs(newVal){
            if(newVal === this.apiIngresos) return;
            this.createIngresosComp();
        },
        vuexFacturasVs(newVal){
            if(newVal === this.apiFacturas) return;
            this.createFacturasComp();
        },
    },
    beforeMount(){
        this.createRentabilidad();
    },
    beforeUpdate(){
        this.createRentabilidad();

    }

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