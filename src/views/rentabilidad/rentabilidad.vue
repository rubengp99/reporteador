<template>
    <div style="margin-top:84px;padding: 0 20px;">
        <v-row>
            <v-col cols="12" md="6">
                <v-card width="100%">
                    <v-card-title class="title" style="justify-content:center;">
                        N° de Facturas
                    </v-card-title>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card width="100%">
                    <div v-if="!loading">
                        <v-card-title class="title" style="justify-content:center;padding-bottom:0;">
                            Ingresos
                        </v-card-title>
                        <v-card-text>
                            <apexchart
                                type="bar"
                                height="298"
                                :options="ingresos.chartOptions"
                                :series="ingresos.series"
                            />
                        </v-card-text>
                    </div>
                    <div v-else style="padding: 25px 0;">
                        <v-spacer></v-spacer>
                        <loader />
                        <v-spacer></v-spacer>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import reports from '@/plugins/reports';
import facturas from '@/services/Factura';
import moment from 'moment';
import w from '@/services/variables';

export default {
    name:'rentabilidad',
    data(){
        return{
            ingresos: {},
            aux:[],
            facturas: {},
            loading: true,
            ingresosComp: [false, false],
            moneda: 'bolivares',
            monedas: ['Bolivares','Dolares']
        }
    },
    methods:{
        async createIngresosComp(){
            let aux = await facturas().get('?limit=1');
            let pastMonth = moment(w.test).locale('es').subtract(1,'months').format('MM');
            facturas().get('?limit='+aux.data.totalCount+'&fields=id,subtotal,subtotal_dolar&after-fecha_at=2019-'+pastMonth+'-01').then(Response =>{
                let data = {
                    tipo:'ingresos',
                    bolivares: Response.data.data.map(i => +i.subtotal).reduce((a,b) => a+b),
                    dolares:  Response.data.data.map(i => +i.subtotal_dolar).reduce((a,b) => a+b),
                    mesActual: 0,
                };
                this.aux.push(data);
                this.ingresosComp[0] = false;
            });
            facturas().get('?limit='+aux.data.totalCount+'&fields=id,subtotal,subtotal_dolar&after-fecha_at=2019-'+(+pastMonth+1)+'-01').then(Response =>{
                let data = {
                    tipo:'ingresos',
                    bolivares: Response.data.data.map(i => +i.subtotal).reduce((a,b) => a+b),
                    dolares:  Response.data.data.map(i => +i.subtotal_dolar).reduce((a,b) => a+b),
                    mesActual: 1,
                };
                this.aux.push(data);
                this.ingresosComp[1] = false;
            });
            
        },
        createFacturasComp(){
            this.facturas = reports.chart__barCompare([10, 15], ["#ffc93c","#15b7b9"]);
        }
    },
    watch:{
        ingresosComp(){
            if(this.ingresosComp.every(i => i)){
                let data = this.aux.filter(i => i.data === 'ingresos')
                                   .sort((a,b) => a.mesActual + b.mesActual)
                                   .map(i=> this.moneda === 'Bolivares' ? i.bolivares : i.dolares);
                this.ingresos = reports.chart__barCompare(
                    data, ['#005792','#263238'], 'Ingresos', '$'
                );
            }

        }
    },
    async beforeMount(){
        await this.createIngresosComp();
    }
}
</script>