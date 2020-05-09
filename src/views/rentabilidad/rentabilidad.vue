<template>
    <div style="margin-top:79px;padding: 0 20px;">
        <v-row>
            <v-col cols="12" md="6">
                <v-card width="100%">
                    <compareCard 
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
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <compareCard
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
            </v-col>
            <v-col cols="12" md="6">
                <rentabilidadCard
                    title="Rentabilidad de Ventas" 
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
            </v-col>
        </v-row>
    </div>
</template>

<script>
import reports from '@/plugins/reports';
import compareCard from '@/components/rentabilidad/compareCard'
import rentabilidadCard from '@/components/rentabilidad/rentabilidadCard'
import facturas from '@/services/Factura';
import compras from '@/services/Compras';
import vendedores from '@/services/Vendedores';
import moment from 'moment';
import w from '@/services/variables';

export default {
    name:'rentabilidad',
    components:{
        compareCard,
        rentabilidadCard
    },
    data(){
        return{
            w,
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
            monedas: ['Bolivares','Dolares']
        }
    },
    methods:{
        moment,
        async createIngresosComp(){
            let aux = await facturas().get('?limit=1');
            let pastMonth = moment(w.test).locale('es').subtract(1,'months').format('YYYY-MM');
            let thisMonth = moment(w.test).locale('es').format('YYYY-MM');
            facturas().get('/total?limit='+aux.data.totalCount+'&after-fecha_at='+pastMonth+'-01').then(Response =>{
                let data = {
                    bolivares: Response.data.data.subtotal,
                    dolares:  Response.data.data.subtotal_dolar,
                    mesActual: 0,
                };
                this.apiIngresos.push(data);
                this.ingresosComp[0] = true;
            });
            facturas().get('/total?limit='+aux.data.totalCount+'&after-fecha_at='+thisMonth+'-01').then(Response =>{
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
            let pastMonth = moment(w.test).locale('es').subtract(1,'months').format('YYYY-MM');
            let thisMonth = moment(w.test).locale('es').format('YYYY-MM');
            facturas().get('/cantidad?limit='+aux.data.totalCount+'&after-fecha_at='+pastMonth+'-01').then(Response =>{
                let data = {
                    cantidad: Response.data.count,
                    mesActual: 0,
                };
                this.apiFacturas.push(data);
                this.facturasComp[0] = true;
            });
            facturas().get('/cantidad?limit='+aux.data.totalCount+'&after-fecha_at='+thisMonth+'-01').then(Response =>{
                let data = {
                    cantidad: Response.data.count,
                    mesActual: 1,
                };
                this.apiFacturas.push(data);
                this.facturasComp[1] = true;
            });
        },
        async createcomprasVsVentas(){
            let aux = await compras().get('?limit=1'); 
            compras().get('?limit='+aux.data.totalCount).then(Response =>{
                let data = {
                    bolivares: Math.round(Response.data.data.map(i=> +i.subtotal).reduce((a,b) => a+b) * 100) / 100,
                    dolares: Math.round(Response.data.data.map(i=> +i.subtotal_dolar).reduce((a,b) => a+b) * 100) / 100,
                    compras: 1,
                };
                this.apiComprasVsVentas.push(data);
                this.comprasVsVentasComp[0] = true;
            });
            
            vendedores().get('mostSellers/?limit='+window.localStorage.getItem('totalVendedores')).then(Response =>{
                let data = {
                    bolivares: Math.round(Response.data.data.map(i=> +i.venta_total).reduce((a,b) => a+b) * 100) / 100,
                    dolares: Math.round(Response.data.data.map(i=> +i.venta_total_dolar).reduce((a,b) => a+b) * 100) / 100,
                    compras: 0,
                };
                this.apiComprasVsVentas.push(data);
                this.comprasVsVentasComp[1] = true;
            });
            
            
        },
        async createData(){
            this.createIngresosComp();
            this.createFacturasComp();
            this.createcomprasVsVentas();
        }
    },
    watch:{
        apiIngresos:{
            handler(){
                if(this.ingresosComp.slice(1,2).some(i => !i)) return;

                if(this.ingresosComp.every(i => i)){
                    let data = this.apiIngresos.sort((a,b) => a.mesActual-b.mesActual);
                    this.ingresos = reports.chart__donut(
                        data.map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares),
                        data[0]/data[1] <= 1 ? 'Aumentó un' : 'Disminuyó un',             
                        data[0]/data[1] <= 1 ? ["Mes Actual", "Mes Pasado"] : ["Mes Pasado", "Mes Actual"] ,
                        data[0]/data[1] <= 1 ? ["#009688","#f73859"] : ["#f73859", "#009688"], 
                        null,
                        this.moneda
                    );

                    this.ingresosComp = this.ingresosComp.map(i => !i);
                }
            },
            deep:true,
        },
        apiFacturas:{
            handler(){                
                if(this.facturasComp.slice(1,2).some(i => !i)) return;

                if(this.facturasComp.every(i => i)){
                    let data = this.apiFacturas.sort((a,b) => a.mesActual-b.mesActual);
                    this.facturas = reports.chart__donut(
                        data.map(i=> +i.cantidad),
                        data[0]/data[1] <= 1 ? 'Aumentó un' : 'Disminuyó un',             
                        data[0]/data[1] <= 1 ? ["Mes Actual", "Mes Pasado"] : ["Mes Pasado", "Mes Actual"] ,
                        data[0]/data[1] <= 1 ? ["#3F51B5","#009688"] : ["#009688", "#3F51B5"], 
                        'cantidad'
                    )
                    this.facturasComp = this.facturasComp.map(i => !i);
               }                
            },
            deep:true,
        },
        apiComprasVsVentas:{
            handler(){                
                if(this.comprasVsVentasComp.slice(1,2).some(i => !i)) return;

                if(this.comprasVsVentasComp.every(i => i)){
                    let data = this.apiComprasVsVentas.sort((a,b) => a.compras-b.compras);
                    this.comprasVsVentas = reports.chart__donut(
                        data.map(i=> this.moneda === 'Bs' ? +i.bolivares : +i.dolares),
                        'Rentabilidad del',
                        data[0]/data[1] <= 1 ? ["Costos","Ventas"] : ["Ventas", "Costos"] ,
                        data[0]/data[1] <= 1 ? ["#3F51B5","#f73859"] : ["#f73859", "#3F51B5"], 
                        'benefits',
                        this.moneda
                    )
                    this.comprasVsVentasComp = this.comprasVsVentasComp.map(i => !i);
               }                
            },
            deep:true,
        }
    },
    async beforeMount(){
        await this.createData();
    },
}
</script>