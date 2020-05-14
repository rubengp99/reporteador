<template>
    <v-card width="100%" fill-height>
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
                    El mes pasado 
                    <span class="text-capitalize" style="color:#0D47A1">{{ moment(w.test).locale('es').subtract(1,'months').format('MMMM [de] YYYY') }}</span>
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
                     Durante el curso de este mes <span class="text-capitalize" style="color:#0D47A1">{{ moment(w.test).locale('es').format('MMMM [de] YYYY') }}</span>
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
                            data[1] / data[0] >= 1 ? 'aumentó' : 'disminuyó'                   
                        }}
                     </span>
                     en un 
                     <span style="color:#0D47A1">
                        {{
                            (Math.round((formula) * 100)) + '%'
                        }}.
                     </span>
                </p>
            </v-card-actions>
            <v-card-actions v-else>
                <span>
                    Parece que usted no tiene facturas con montos en <span style="color:#0D47A1"> dólares</span>, por lo tanto, este reporte no tiene nada que mostrar.
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