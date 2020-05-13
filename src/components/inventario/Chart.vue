<template>
    <transition name="fade" mode="out-in">
        <v-col  cols="12" sm="6">
            <div  v-if="loading">
                <loader/>
            </div>
            <transition  v-else-if="!loading" :name="transitionName" mode="out-in" @beforeLeave="beforeLeave" @enter="enter" @afterEnter="afterEnter">
                <div>
                    <v-row >
                        <v-col  cols="12">
                            <!-- Primer texto TITULO -->
                            <p  class="body-1" style="line-height:normal;">
                                <!--Rotación de stock-->
                                <span  v-if="type === 'Rotación'">Rotación de Inventario para </span>
                                <!--Demanda Diaria-->
                                <span  v-if="type === 'Demanda'">Demanda de Semanal para </span>
                                <!--Reclamos-->
                                <span  v-if="type === 'Reclamos'"> Indice de Reclamos para </span>
                                <!--Devoluciones-->
                                <span  v-if="type === 'Devoluciones'"
                                    >Indice de Devoluciones para
                                </span>
                                <!--Días de inventario-->
                                <span  v-if="type === 'Agotamiento'">¿Cuando se acabará </span>
                                <!--Rentabilidad-->
                                <span  v-if="type === 'Rentabilidad'">Rentabilidad de </span>

                                <span  style="color:#0D47A1"><br>{{ item.name }}</span>
                                

                                <!--Días de Inventario-->
                                <span  v-if="type === 'Agotamiento'">?</span>
                            </p>
                        </v-col>
                    </v-row>
                    <!-- GRAFICO -->
                    <div >
                        <apexchart
                            :type="ctype"
                            :height="height"
                            :options="options.chartOptions"
                            :series="options.series"
                        />
                        <v-divider></v-divider>
                        
                        <!-- TEXTO LARGO DEL FINAL  -->
                        <p  class="caption" style="padding-bottom:15px;padding-top:5px;" >
                            <!--Días de inventario-->
                            <span  v-if="type === 'Agotamiento' && Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 + Number.EPSILON) * 100) / 100 > 0">Si la demanda de </span>

                            <span  style="color:#0D47A1" v-if="!(type === 'Agotamiento' && Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 + Number.EPSILON) * 100) / 100 === 0)">{{ item.name }}</span>

                            <!--Rotacion de stock-->
                            <span  v-if="type === 'Rotación' && options.series[1] > 0 && options.series[0] > 0"> ha rotado un </span>

                            <!--Reclamos-->
                            <span  v-if="type === 'Reclamos' && options.series[1] > 0"> ha recibido reclamos de un </span>

                            <!--Devoluciones-->
                            <span  v-if="type === 'Devoluciones' && options.series[1] > 0"> ha devuelto un </span>
                            
                            <!--Demanda diaria-->
                            <span  v-if="type === 'Demanda'">
                            tiene una demanda promedio de
                            </span>


                            <!-- Si el gráfico es de area -->
                            <span style="color:#0D47A1" v-if="ctype === 'area' && type === 'Demanda'">
                                {{
                                    Math.round((item.stock_daily_sells.reduce((a, b) => a + b) / 7 +Number.EPSILON) *100 ) / 100
                                }}
                            </span>


                            <!-- Si el grafico es una dona -->
                            <!--Rentabilidad-->
                            <span  v-if="ctype === 'donut' && type === 'Rentabilidad'">
                                proporciona un
                                <span  style="color:#0D47A1">margen de beneficios</span>
                                del
                                <span  style="color:#0D47A1">
                                    {{
                                        isNaN(Math.round(((item.stock_costs.series[0] - item.stock_costs.series[1]) / item.stock_costs.series[0] + Number.EPSILON) * 100  ))  ? 0 + "%."
                                        : Math.round( ((item.stock_costs.series[0] - item.stock_costs.series[1]) / item.stock_costs.series[0] + Number.EPSILON) * 100 ) + "%."
                                    }}
                                </span>
                            </span>
                            <span style="color:#0D47A1"
                                v-else-if="ctype === 'donut' && type !== 'Rotación' && type !== 'Rentabilidad' && type !== 'Devoluciones' && type !== 'Reclamos' ||  (options.series[1] > 0 && options.series[0] > 0 )"
                            >
                                {{
                                    isNaN(Math.round((options.series[0] / options.series[1] + Number.EPSILON) * 100 )) || !isFinite(Math.round((options.series[0] / options.series[1] + Number.EPSILON) * 100 )) ? 0 +'% '
                                    : Math.round((options.series[0] / options.series[1] + Number.EPSILON) * 100 ) + "% "
                                }}
                            </span>

                            <!--Rotacion de stock-->
                            <span  v-if="type === 'Rotación' && options.series[1] > 0 && options.series[0] > 0">
                                <span  style="color:#0D47A1">{{ "(" + options.series[0] + " unidades)" }}</span> de sus existencias en el
                                almacén.
                            </span>

                            <!--Demanda diaria-->
                            <span  v-if="type === 'Demanda'">
                                unidades diarias en el mercado.
                            </span>

                            <!--Reclamos
                            <span  v-if="type === 'Reclamos'">
                            {{ "(" + options.series[0] + " unidades)" }} de sus
                            {{ options.series[1] }} unidades vendidas.
                            </span>
                            -->

                            <!--Devoluciones, reclamos y rotacion en 0-->
                            <span   v-if="(type === 'Devoluciones'  && +options.series[1] > 0) || (type === 'Reclamos'  && options.series[1] > 0)">
                                <span  style="color:#0D47A1">{{ "(" + options.series[0] + " unidades)" }}</span> de sus
                                <span  style="color:#0D47A1">{{ options.series[1] }}</span> unidades vendidas.
                            </span>
                            <span   v-else-if="(type === 'Devoluciones'  && +options.series[1] === 0) || (type === 'Reclamos'  && options.series[1] === 0)">
                                <span > no ha vendido unidades, por lo tanto no existen {{type.toLowerCase()}}.</span>
                            </span>
                            <span   v-else-if="(type === 'Rotación'  && (+options.series[1] === 0 || +options.series[0] === 0))">
                                <span > no cuenta con {{+options.series[0] === 0 ? 'unidades ventidas' : 'existencias'}}, por lo tanto no existe {{type.toLowerCase()}}.</span>
                            </span>


                            <!--Días de inventario-->
                            <span  v-if="type === 'Agotamiento'">
                                <span  v-if="Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 + Number.EPSILON) * 100) / 100 > 0"> se mantiene en</span>
                                <span  style="color:#0D47A1" v-if="Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 + Number.EPSILON) * 100) / 100 > 0">
                                    {{
                                        Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 +Number.EPSILON) * 100) / 100
                                    }}
                                </span>
                                <span  v-if="Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 + Number.EPSILON) * 100) / 100 === 0">
                                    Actualmente este producto no cuenta con una demanda en el mercado, las <span  style="color:#0D47A1">{{item.stock}} unidades</span> de <span  style="color:#0D47A1">{{item.name}}</span> se mantendrán estancadas en el inventario.
                                </span>
                                <span  v-if="Math.trunc((item.stock_daily_sells.reduce((a, b) => a + b) / 7 + Number.EPSILON) * 100) / 100 > 0">
                                    unidades diarias, se estima que las existencias del producto se
                                    agotaran el día
                                </span>
                                <span  style="color:#0D47A1"> {{ item.stock_lastDay }} </span>
                            </span>
                        </p>
                    </div>
                </div>
            </transition>
        </v-col>
    </transition>
</template>

<script>
import ApexCharts from "vue-apexcharts/src/ApexCharts.component";
import transitions from '@/plugins/transitions';
const DEFAULT_TRANSITION = 'fade';

export default {
    name: "chart",
    components: {
        apexchart: ApexCharts
    },
    props: {
        item: Object,
        type: String,
        options: Object,
        ctype: String,
        height: String,
        wait: String,
    },
    data() {
        return {
            prevHeight: 0,
            transitionName: DEFAULT_TRANSITION,
            loading: true,
        };
    },
    methods:{
        ...transitions,
    },
    created() {
        this.animate(this.transitionName);
    },
    mounted(){
        setTimeout(()=>{
            this.loading = false;
        },(+this.wait)*750);
    },
    
};
</script>
