<template>
    <v-card width="100%" fill-height style="min-height:495px">
        <div v-if="!loading">
            <v-card-text>
                <apexchart
                    type="donut"
                    :height=" isDesktop ? '350em' : '335em'"
                    :options="chart.chartOptions"
                    :series="chart.series"
                />
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions v-if="!isNaN((Math.round((formula) * 100)))">
                <p class="caption" style="padding: 5px 20px;width:100%;">
                    Durante el/la <span class="text-lowercase" style="color:#0D47A1"> {{ rango }} </span> de
                    <span class="text-capitalize" style="color:#0D47A1">{{ rangos[0].split("al")[0] }}</span>
                    hasta la fecha
                    <span class="text-capitalize" style="color:#0D47A1">{{ rangos[0].split("al")[1] }}</span>
                    se facturó un {{tipo}} con cantidad de 
                    <span style="color:#0D47A1">
                        {{
                            moneda === 'Bs' || moneda === '$' ?
                                formatMoney(data[0], { symbol: moneda, thousand : ".", decimal  : ",", })
                                : formatMoney(data[0], { symbol: "", thousand : ".", decimal  : ",", }).split(',')[0]
                        }}
                        {{
                            moneda !== 'Bs' && moneda !== '$' ? moneda : ''
                        }}.
                    </span>
                     Durante el actual curso de el/la <span class="text-capitalize" style="color:#0D47A1">{{ rangos[1].split("al")[0] }}</span>
                    hasta la fecha
                    <span class="text-capitalize" style="color:#0D47A1">{{ rangos[1].split("al")[1] }}</span>
                     se ha facturado un {{tipo}} de 
                    <span style="color:#0D47A1">
                        {{
                            moneda === 'Bs' || moneda === '$' ?
                                formatMoney(data[1], { symbol: moneda, thousand : ".", decimal  : ",", })
                                : formatMoney(data[1], { symbol: "", thousand : ".", decimal  : ",", }).split(',')[0]
                        }}
                        {{
                            moneda !== 'Bs' && moneda !== '$' ? moneda : ''
                        }}
                    </span>
                    <br><br>
                     Se estima que {{conectivo}} <span style="color:#0D47A1"> {{title}} </span>
                     <span style="color:#0D47A1">
                        {{
                            data[0] > data[1] ? 'disminuyó' : 'aumentó'                    
                        }}
                     </span>
                     en un 
                     <span style="color:#0D47A1">
                        {{
                            increment
                        }}
                     </span>
                     .
                </p>
            </v-card-actions>
            <v-card-actions v-else>
                <span>
                    Parece que usted no tiene facturas con montos en <span style="color:#0D47A1"> {{moneda === 'Bs' ? 'bolívares' : 'dólares'}}</span>, por lo tanto, este reporte no tiene nada que mostrar.
                </span>
            </v-card-actions>
        </div>
        <div v-else style="padding: 25px 0;">
            <v-spacer></v-spacer>
            <loader />
            <v-spacer></v-spacer>
        </div>
    </v-card>
</template>
<script>
import { formatMoney } from 'accounting';
import w from '@/services/variables';
import moment from 'moment';

export default {
    name:'compareCard',
    props:{
        title:{
            type: String,
            default: '',
        },
        moneda:{
            type: String,
            default:'',
        },
        tipo:{
            type: String,
            default: '',
        },
        conectivo:{
            type: String,
            default: 'el',
        },
        chart:{
            type: Object,
            default: () => {},
        },
        loading:{
            type:Boolean,
            default:false,
        },
        formula:{
            type:Number,
            default:0,
        },
        rango: {
            type: String,
            default: "mes",
        },
        rangos: {
            type: Array,
            default: () => []
        }
    },
    methods:{
        formatMoney,
        moment,
        onResize(){
            if (window.innerWidth > 599){
                this.isDesktop = true;
            }else
                this.isDesktop = false;
            
        },
    },
    computed: {
        increment() {
            let result = (this.data[0] > this.data[1] ? this.data[1] / this.data[0] : this.data[0] /this.data[1]);
            return (Math.round((100 - (result * 100) + Number.EPSILON) * 1000) / 1000) + "%"
        }
    },
    data(){
        return{
            w,
            data: [],
            isDesktop: true,
        }
    },
    created(){
        window.addEventListener('resize', this.onResize);
        this.onResize();
    },
    beforeMount(){
        this.data = this.chart.series;
        this.$forceUpdate();
    },
    beforeUpdate(){
        this.data = this.chart.series;
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
}
</script>