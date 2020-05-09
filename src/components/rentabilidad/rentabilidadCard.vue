<template>
    <v-card width="100%">
        <div v-if="!loading">
            <v-card-title class="title" style="justify-content:center;padding-bottom:0;">
                {{title}}
            </v-card-title>
            <v-card-text>
                <apexchart
                    type="donut"
                    height="335em"
                    :options="chart.chartOptions"
                    :series="chart.series"
                />
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <p class="caption" style="padding: 5px 20px;">
                    La <span style="color:#0D47A1">{{ entidad }}</span> ha tenido <span style="color:#0D47A1">{{variableA}}</span> por una cantidad de
                    <span style="color:#0D47A1">
                        {{
                            moneda === 'Bs' || moneda === '$' ?
                                formatMoney(data[0], { symbol   : moneda === 'Bs' || moneda === '$ ' ? moneda : "", thousand : ".", decimal  : ",", })
                                : formatMoney(data[0], { symbol   : moneda === 'Bs' || moneda === '$ ' ? moneda : "", thousand : ".", decimal  : ",", }).split(',')[0]
                        }}
                        {{
                            moneda !== 'Bs' && moneda !== '$' ? moneda : ''
                        }}
                    </span>
                    . Sin embargo posee <span style="color:#0D47A1">{{variableB}}</span>
                     por una cantidad de
                    <span style="color:#0D47A1">
                        {{
                            moneda === 'Bs' || moneda === '$' ?
                                formatMoney(data[1], { symbol   : moneda === 'Bs' || moneda === '$ ' ? moneda : "", thousand : ".", decimal  : ",", })
                                : formatMoney(data[1], { symbol   : moneda === 'Bs' || moneda === '$ ' ? moneda : "", thousand : ".", decimal  : ",", }).split(',')[0]
                        }}
                        {{
                            moneda !== 'Bs' && moneda !== '$' ? moneda : ''
                        }}.
                    </span>
                    <br><br>
                     Determinando la relación entre estas dos variables, se estima que 
                     <span style="color:#0D47A1">{{entidad}}</span> 
                     ofrece un <span style="color:#0D47A1">Margen de Beneficios</span> del 
                     <span style="color:#0D47A1">
                        {{
                            Math.round(formula * 100) + '%'
                        }}.
                     </span>
                </p>
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
    name:'compare',
    props:{
        title:{
            type: String,
            default: '',
        },
        moneda:{
            type: String,
            default:'',
        },
        entidad:{
            type: String,
            default: '',
        },
        variableA:{
            type: String,
            default: '',
        },
        variableB:{
            type: String,
            default: '',
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
    },
    data(){
        return{
            w,
            data: [],
        }
    },
    beforeUpdate(){
        this.data = this.chart.series;
    }
}
</script>