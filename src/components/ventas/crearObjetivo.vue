<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="800px">
            <v-card>
                <v-card-title>
                    <span class="headline bold mt-1" style="margin: 0 auto;text-align:center;">Objetivo de Venta</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm=4>
                                <v-img :src="require('@/assets/goal.svg')" width="75px" style="margin:0 auto;"></v-img>
                            </v-col>
                            <v-col cols="12" sm=8>
                                <v-select
                                    v-model="model.tipo"
                                    :items="tipos"
                                    label="Tipo"
                                    outlined
                                    dense
                                    style="height:39px;"
                                    class="align-aux"
                                    append-icon="mdi-view-list"
                                    required
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-expand-transition>
                            <v-row v-if="model.tipo !== null">
                                <v-col cols="12" sm=6 style="height:64px;">
                                    <v-select
                                        v-model="model.responsable"
                                        :items="responsables"
                                        label="Responsable"
                                        outlined
                                        dense
                                        style="height:39px;"
                                        append-icon="person"
                                        required
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm=6 style="height:64px;">
                                    <v-text-field
                                        dense
                                        v-model="model.meta"
                                        label="Meta"
                                        placeholder="Ej: 4000"
                                        color="#005598"
                                        append-icon="local_atm"
                                        outlined
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-scroll-y-transition>
                                    <v-col cols="12" sm=6 style="height:64px;" v-if="model.tipo === 'Ingresos'">
                                        <v-select
                                            v-model="model.moneda"
                                            :items="monedas"
                                            label="Moneda"
                                            outlined
                                            dense
                                            style="height:39px;"
                                            append-icon="monetization_on"
                                            required
                                        ></v-select>
                                    </v-col>
                                </v-scroll-y-transition>
                                <v-col cols="12" sm="6" style="height:64px;">
                                    <v-menu :close-on-content-click="false" transition="scale-transition" max-width="100%" offset-overflow>
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                dense
                                                v-model="model.limite"
                                                label="Límite"
                                                color="#005598"
                                                append-icon="event"
                                                outlined
                                                v-on="on"
                                                required
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="model.limite" :landscape="innerWidth >= 600" show-current  header-color="#005598" color="#005598"  locale="es"/>
                                    </v-menu>
                                </v-col>   
                            </v-row>
                        </v-expand-transition>
                    </v-container>
                    <small>Todos los campos son requeridos.</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <slot name="actions"></slot>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    props:{
        dialog:{
            type:Boolean,
            default:false,
        },
        innerWidth:{
            type: Number,
            default: 0,
        }
    },
    data(){
        return{
            tipos:['Ingresos', 'Ventas'],
            responsables:[{text:'Empresa', value:0}],
            monedas:[
                {text:'Dolares', value:'$'},
                {text:'Bolívares', value:'Bs'}
            ],
            model:{},
        }
    },
    computed:{
        ...mapState(['objetivo','vuexSellers']),
    
    },
    methods:{
        ...mapActions(['setNewGoal','resetNewGoal']),
    },
    watch:{
        model:{
            handler(){
                this.setNewGoal(this.model);
            },
            deep:true
        },
        vuexSellers(){
            this.responsables = [{text:'Empresa', value:0}];
            this.vuexSellers.data.data.forEach(seller => this.responsables.push({text: seller.nombre, value: seller.id}));
        },
    },
    beforeMount(){
        this.resetNewGoal();
        this.model = Object.assign({},this.objetivo);
        this.vuexSellers.data.data.forEach(seller => this.responsables.push({text: seller.nombre, value: seller.id}));
    }
}
</script>

<style lang="scss">
.align-aux{
   @media only screen and (min-width:600px){
        margin-top:20px!important;
   }
}
</style>