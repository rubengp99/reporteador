<template>
    <div>
        <v-card style="background:#FAFAFA;" class="mx-auto hoverable" active-class="active" max-width="100%" :height=" buyer.expand ? '100%': 'auto'" elevation="4" >
            <v-list-item three-line>
                <v-list-item-content>
                    <div class="overline mb-2"><span class="bold">{{buyer.sales.split(",")[0]}}</span> <br> compras realizadas.</div>
                        <v-list-item-title class="subtitle-1 mb-1" style="line-height: 1.25rem;text-overflow:none;white-space:normal;word-wrap:nowrap;">
                            {{buyer.name}}
                        </v-list-item-title>
                        <v-list-item-title class="caption"> PUESTO {{offset + i + 1}}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-avatar tile size="100" >
                    <v-avatar size="100">
                        <v-img :src="getImagen(buyer)"></v-img>
                    </v-avatar>
                </v-list-item-avatar>
            </v-list-item>
            <v-divider></v-divider>
            <v-card-actions>
                <v-row style="text-align:center;" align="center">
                    <v-col cols=12 style="padding:2.5px 0;"> 
                        <v-list-item-title class="subtitle-1"> <span class="bold">Aporte de Compra</span></v-list-item-title>
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
                                <v-list-item-title class="subtitle-2"> {{buyer.buysBs}}</v-list-item-title>
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
                                <v-list-item-title class="subtitle-2"> {{buyer.buys$}}</v-list-item-title>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-actions>
            <v-expand-transition>
                <v-col cols="12" v-show="buyer.expand" @click.stop.prevent>
                    <v-divider></v-divider>
                    <p  class="body-1" style="line-height:normal;margin-top:15px;">
                        Volumen de Compras de  <span  style="color:#0D47A1"><br>{{ buyer.name }}</span>
                    </p>
                    <apexchart
                        type="donut"
                        height="298"
                        :options="buyer.percentBuys.chartOptions"
                        :series="buyer.percentBuys.series"
                    />
                    <v-divider></v-divider>
                    <p class="caption" style="margin-top:10px;">El comprador <span  style="color:#0D47A1">{{buyer.name}}</span> 
                        posee el <span style="color:#0D47A1">{{ ((Math.round((buyer.percentBuys.series[0] / buyer.percentBuys.series[1] + Number.EPSILON) * 100) > 100 ? 100 + '%' : Math.round((buyer.percentBuys.series[0] / buyer.percentBuys.series[1] + Number.EPSILON ) * 1000) / 1000) * 100).toFixed(2) +'%'}}</span>
                        del total de compras en el negocio.
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
        buyer:{
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
                return require("@/assets/entity.jpg")
            else 
                return  buyer.imagen === 'entity.jpg' ? require("@/assets/entity.jpg") : this.imagen + buyer.imagen
        }
    }
}
</script>