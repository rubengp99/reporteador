<template>
    <div style="margin-top:79px;padding: 0 20px;">
        <v-row>
            <v-col cols="12" md="6">
                <v-card width="100%">
                    <compareCard 
                        title="N° de Facturas" 
                        tipo="total" 
                        :loading="loading" 
                        :chart="facturas"
                        moneda='facturas' 
                    />
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <compareCard
                    title="Ingreso Mensual" 
                    :moneda="moneda" 
                    tipo="ingreso" 
                    :loading="loading" 
                    :chart="ingresos" 
                />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import reports from '@/plugins/reports';
import compareCard from '@/components/rentabilidad/compareCard'
import facturas from '@/services/Factura';
import moment from 'moment';
import w from '@/services/variables';

export default {
    name:'rentabilidad',
    components:{
        compareCard
    },
    data(){
        return{
            w,
            ingresos: {},
            apiIngresos:[],
            facturas: {},
            apiFacturas:[],
            loading: true,
            ingresosComp: [false, false],
            facturasComp: [false, false],
            moneda: 'Bs',
            monedas: ['Bolivares','Dolares']
        }
    },
    methods:{
        moment,
        async createIngresosComp(){
            let aux = await facturas().get('?limit=1');
            let pastMonth = moment(w.test).locale('es').subtract(1,'months').format('MM');
            facturas().get('/total?limit='+aux.data.totalCount+'&after-fecha_at=2019-'+pastMonth+'-01').then(Response =>{
                let data = {
                    bolivares: Response.data.data.subtotal,
                    dolares:  Response.data.data.subtotal_dolar,
                    mesActual: 0,
                };
                this.apiIngresos.push(data);
                this.ingresosComp[0] = true;
            });
            facturas().get('/total?limit='+aux.data.totalCount+'&after-fecha_at=2019-'+(+pastMonth+1)+'-01').then(Response =>{
                let data = {
                    bolivares: Response.data.data.subtotal,
                    dolares:  Response.data.data.subtotal_dolar,
                    mesActual: 1,
                };
                this.apiIngresos.push(data);
                this.ingresosComp[1] = true;
            });
            
        },
        async createFacturasComp(){
            let aux = await facturas().get('?limit=1');
            let pastMonth = moment(w.test).locale('es').subtract(1,'months').format('MM');
            facturas().get('/cantidad?limit='+aux.data.totalCount+'&after-fecha_at=2019-'+pastMonth+'-01').then(Response =>{
                let data = {
                    cantidad: Response.data.count,
                    mesActual: 0,
                };
                this.apiFacturas.push(data);
                this.facturasComp[0] = true;
            });
            facturas().get('/cantidad?limit='+aux.data.totalCount+'&after-fecha_at=2019-'+(+pastMonth+1)+'-01').then(Response =>{
                let data = {
                    cantidad: Response.data.count,
                    mesActual: 1,
                };
                this.apiFacturas.push(data);
                this.facturasComp[1] = true;
            });
        }
    },
    watch:{
        apiIngresos:{
            handler(){
                if(this.ingresosComp.some(i => !i)) return;

                if(this.ingresosComp.every(i => i)){
                    let data = this.apiIngresos;
                    this.ingresos = reports.chart__donut(
                        data.sort((a,b) => a.mesActual-b.mesActual)
                            .map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares),
                        data[0]/data[1] <= 1 ? 'Aumentó un' : 'Disminuyó un',             
                        ["Mes Pasado", "Mes Actual"],
                        data[0]/data[1] <= 1 ? ["#15b7b9","#f73859"] : ["#f73859", "#15b7b9"], 
                        null
                    );

                    this.loading = !(this.ingresosComp.every(i => i) && this.facturasComp.every(i => i));
                    
                    if(!this.loading){
                        this.ingresosComp = this.ingresosComp.map(i => !i);
                    }
                }
            },
            deep:true,
        },
        apiFacturas:{
            handler(){
                if(this.facturasComp.some(i => !i)) return;

                if(this.facturasComp.every(i => i)){
                    let data = this.apiFacturas;
                    this.facturas = reports.chart__donut(
                        data.sort((a,b) => a.mesActual-b.mesActual)
                            .map(i=> +i.cantidad),
                        data[0]/data[1] <= 1 ? 'Aumentó un' : 'Disminuyó un',             
                        ["Mes Pasado", "Mes Actual"],
                        data[0]/data[1] <= 1 ? ["#3F51B5","#009688"] : ["#009688", "#3F51B5"], 
                        'cantidad'
                    );

                    this.loading = !(this.ingresosComp.every(i => i) && this.facturasComp.every(i => i));
                    
                    if(!this.loading){
                        this.facturasComp = this.facturasComp.map(i => !i);
                    }
               }                
            },
            deep:true,
        }
    },
    async beforeMount(){
        await this.createIngresosComp();
        await this.createFacturasComp();
    }
}
</script>