<template>
    <div>
        <v-card style="background:#FAFAFA;" class="mx-auto hoverable" active-class="active" max-width="100%" :height=" route.expand ? '100%': 'auto'" elevation="4">
            <v-list-item three-line>
                <v-list-item-content>
                    <div class="overline mb-2"><span class="bold">{{route.sales.split(",")[0]}}</span> <br> ventas realizadas.</div>
                        <v-list-item-title class="subtitle-1 mb-1" style="line-height: 1.25rem;text-overflow:none;white-space:normal;word-wrap:nowrap;">
                            {{route.name}}
                        </v-list-item-title>
                        <v-list-item-title class="caption"><!-- Coloca data para ranking --></v-list-item-title>
                </v-list-item-content>
                <v-list-item-avatar tile size="100" >
                    <v-img :src="require('@/assets/routes.svg')"></v-img>
                </v-list-item-avatar>
            </v-list-item>
            <v-divider></v-divider>
           <v-card-actions>
                <v-row style="text-align:center;" align="center">
                    <v-col cols=12 style="padding:2.5px 0;">
                        <v-row style="text-align:center;">
                            <v-col cols=4 md=5 style="text-align:right;padding: 0;">
                                <v-list-item-title class="subtitle-2"> <span class="bold">Tarifa </span></v-list-item-title>
                            </v-col>
                            <v-col cols=1 style="padding:0;">
                                <v-icon>mdi-chevron-right</v-icon> 
                            </v-col>
                            <v-col cols=7 md=5 style="text-align:left;padding: 0;">
                                <v-list-item-title class="subtitle-2"> {{route.value}}</v-list-item-title>
                            </v-col>
                        </v-row>
                    </v-col>
                    
                </v-row>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
export default {
    props:{
        route:{
            type:Object,
            default: () => {}
        },
    }        
}
</script>