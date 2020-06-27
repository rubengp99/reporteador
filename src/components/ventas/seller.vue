<template>
    <div>
        <v-card style="background:#FAFAFA;" class="mx-auto hoverable" active-class="active" max-width="100%" :height=" seller.expand ? '100%': 'auto'" elevation="4">
            <v-list-item three-line>
                <v-list-item-content>
                    <div class="overline mb-2"><span class="bold">{{seller.sales.split(",")[0]}}</span> <br> ventas realizadas.</div>
                        <v-list-item-title class="subtitle-1 mb-1" style="line-height: 1.25rem;text-overflow:none;white-space:normal;word-wrap:nowrap;">
                            {{seller.name}}
                        </v-list-item-title>
                        <v-list-item-title class="caption"> PUESTO {{offset + i + 1}}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-avatar tile size="100" >
                    <v-avatar size="100">
                        <v-img :src="getImagen(seller)"></v-img>
                    </v-avatar>
                </v-list-item-avatar>
            </v-list-item>
            <v-divider></v-divider>
            <v-card-actions>
                <v-row style="text-align:center;" align="center">
                    <v-col cols=12 style="padding:2.5px 0;"> 
                        <v-list-item-title class="subtitle-1"> <span class="bold">Aporte de Venta</span></v-list-item-title>
                    </v-col>
                    <v-col cols=12 style="padding:2.5px 0;">
                        <v-row style="text-align:center;">
                            <v-col cols=4 md=5 style="text-align:right;padding: 0;">
                                <v-list-item-title class="subtitle-2"> <span class="bold">Bolivares </span></v-list-item-title>
                            </v-col>
                            <v-col cols=1 style="padding:0;">
                                <v-icon>mdi-chevron-right</v-icon> 
                            </v-col>
                            <v-col cols=7 md=5 style="text-align:left;padding: 0;">
                                <v-list-item-title class="subtitle-2"> {{seller.gainsBs}}</v-list-item-title>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols=12 style="padding:2.5px 0;">
                        <v-row style="text-align:center;">
                            <v-col cols=4 md=5 style="text-align:right;padding:0;">
                                <v-list-item-title class="subtitle-2"> <span class="bold">Dólares </span></v-list-item-title>
                            </v-col>
                            <v-col cols=1 style="padding:0;">
                                <v-icon>mdi-chevron-right</v-icon> 
                            </v-col>
                            <v-col cols=7 md=5 style="text-align:left;padding:0;">
                                <v-list-item-title class="subtitle-2"> {{seller.gains$}}</v-list-item-title>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-actions>
            <v-expand-transition>
                <v-col cols="12" v-show="seller.expand" @click.stop.prevent>
                    <v-divider></v-divider>
                    <p  class="body-1" style="line-height:normal;margin-top:15px;">
                        Volumen de Ventas de  <span  style="color:#0D47A1"><br>{{ seller.name }}</span>
                    </p>
                    <apexchart
                        type="donut"
                        height="298"
                        :options="seller.percentSales.chartOptions"
                        :series="seller.percentSales.series"
                    />
                    <v-divider></v-divider>
                    <p class="caption" style="margin-top:10px;">El vendedor <span  style="color:#0D47A1">{{seller.name}}</span> 
                        posee el {{ Math.round((seller.percentSales.series[0] / seller.percentSales.series[1] + Number.EPSILON) * 100) > 100 ? 100 + '%' : Math.round((seller.percentSales.series[0] / seller.percentSales.series[1] + Number.EPSILON) * 100) +'%'}}
                        del total de las ventas realizadas por el negocio.
                    </p>
                </v-col>
            </v-expand-transition>
        </v-card>
    </div>
</template>

<script>
import w from "@/services/variables";

export default {
    props:{
        seller:{
            type:Object,
            default: () => {}
        },
        offset:{
            type:Number,
            default:0,
        },
        i:{
            type:Number,
            default:0,
        }
    },
    data() {
        return {
            ...w
        }
    },
    methods: {
        getImagen(buyer) {
           
            if (typeof buyer.imagen === 'undefined') 
                return require("@/assets/person.jpg")
            else 
                return  buyer.imagen === 'person.jpg' ? require("@/assets/person.jpg") : this.imagen + buyer.imagen
        }
    }
}
</script>