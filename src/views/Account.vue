 
<template>
    <div>
        <v-row justify="center" :class="$vuetify.breakpoint.smAndDown ? 'margen-movil mx-10':'margen mx-10'">
            <v-col cols="12" sm="12" md="3">
                <div class="shadow">
                    <v-card width="100%" height="400" elevation="0">
                        <v-row justify="center" align="center" class="mx-4 py-8">
                            <v-avatar size="100" class="elevation-3">
                                <v-img :src="user.data.fotografia === 'default.png' ? require('@/assets/user.svg') : image+user.data.fotografia"></v-img>
                            </v-avatar>
                            <div>
                                <div class="caption font-weigth-black grey--text mx-4">Mi perfil</div>
                                <div class="title font-weigth-black mx-4">{{user.data.nombre}}</div>
                            </div>
                        </v-row>
                        
                        <v-divider></v-divider>

                        <v-list class="mt-5">
                            <v-list-item v-for="(opcion,i) in opciones" :key="i" :to="opcion.path" active-class="grey--text">
                                <v-list-item-icon>
                                    <v-icon color="#005598" small>{{opcion.icon}}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    {{opcion.text}}
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </div>
            </v-col>
            <v-col cols="12" sm="12" md="9">
                <div class="shadow">
                    <v-card elevation="0" height="600" width="100%" class="pa-5">
                        <router-view></router-view>
                    </v-card>
                </div>
            </v-col>
        </v-row>

    </div>
</template>

<script>
import {mapState} from 'vuex';
import variables from '@/services/variables';
    export default {
        components:{
        },
        data() {
            return {
                ...variables,
                opciones:[
                    {icon:'settings',path:'/cuenta/perfil',text:'Ajustes de cuenta'},
                  //  {icon:'history',path:'/account/notificaciones',text:'Centro de notificaciones'},
                    //{icon:'error',path:'/account/ordenes',text:'últimas ordenes'},
                   // {icon:'error_outline',path:'/account/ayuda',text:'Centro de ayuda'},
                ]
            }
        },
        head:{
            title(){
                return {
                    inner:'Reporteador',
                    separator:'|',
                    complement: 'Perfil'
                }
            }
        },
        computed:{
            ...mapState(['user'])
        }
    }
</script>

<style lang="css" scoped>
    .margen{
        margin-top:75px;
    }
    .margen-movil{
        margin-top:120px;
    }
    .margen-footer{
        margin-top:200px;
    }
    .shadow{
        box-shadow: 0px 6px 5px -4px rgba(35,35,35,0.4);
    }
</style>