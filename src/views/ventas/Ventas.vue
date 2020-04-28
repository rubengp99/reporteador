<template>
    <div class="ventas">
        <v-container data-app style="padding:0 2.5vw;margin-top: 74px;max-width:97vw;">
            <v-row>
                <dCard col="3" icon img="buyers" title="Clientes" hoverable path="/ventas/clientes" />
                <dCard col="3" icon img="sellers" title="Vendedores" hoverable path="/ventas/vendedores" />
                <dCard col="3" icon img="routes" title="Rutas" hoverable path="/ventas/rutas" />
                <dCard col="3" icon img="ranking" title="Más vendidos" hoverable path="/ventas/ranking" />
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-expansion-panels :value="opened">
                        <v-expansion-panel>
                            <v-expansion-panel-header class="title" style="text-align:center">
                                <v-btn color="#01579b" class="bold" small  :max-width="innerWidth > 375 ? '125px' : '25px'" style="color:White;" @click.stop.prevent="dialog = !dialog">
                                    <v-icon class="bold" :left="innerWidth > 375">mdi-plus</v-icon> <span v-if="innerWidth > 375">Nuevo</span>
                                </v-btn>
                                <v-spacer></v-spacer>
                                <p style="margin:0">Objetivos de Venta</p>
                                <v-spacer></v-spacer>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                            <v-list>
                                <v-list-item-group>
                                    <v-scroll-y-transition mode="out-in">
                                        <div>
                                            <p v-show="objetivos.length === 0" class="body-2 bold" style="margin:0">No se han establecido objetivos de venta aún...</p>
                                            <v-img v-show="objetivos.length === 0" :src="require('@/assets/nogoals.svg')" max-width="400px" style="margin: 15px auto;"></v-img>
                                        </div>
                                    </v-scroll-y-transition>
                                    <goal v-for="obj in objetivos" :key="obj.id" :id="obj.id" :responsable="obj.responsable" :meta="obj.meta" :fecha="obj.limite" :progreso-meta="obj.progreso/obj.meta" :tipo="obj.tipo" :moneda="obj.moneda">
                                        <template v-slot:actions>
                                            <v-row class="mt-2">
                                                <v-col md="12" style="padding:0 10px">
                                                    <v-btn small outlined dense color="red" style="width:80%;min-width:45px;" @click="remove(obj.id)">
                                                        <v-icon>close</v-icon>
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                        </template>
                                    </goal>
                                </v-list-item-group>
                            </v-list>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
            <v-row>
                <transition  :name="transitionName" mode="out-in" @beforeLeave="beforeLeave" @enter="enter" @afterEnter="afterEnter">
                    <router-view></router-view>
                </transition>
            </v-row>

            <newObjetivo v-if="dialog" :dialog="dialog" :innerWidth="innerWidth" ref="crearObj">
                <template v-slot:actions>
                    <v-btn color="error darken-1" class="bold" @click="close()">Cancelar</v-btn>
                    <v-btn color="#005598" class="bold" style="color:white;" @click="crear()">Crear</v-btn>
                </template>
            </newObjetivo>
        </v-container>
    </div>
</template>

<script>
import dCard from "@/components/aplicacion/Dashcard";
import transitions from '@/plugins/transitions'
import goal from '@/components/ventas/objetivo'
import newObjetivo from "@/components/ventas/crearObjetivo"
import { mapState, mapActions } from 'vuex';

const DEFAULT_TRANSITION = 'slide';

export default {
    name: "Ventas",
    components: {
        dCard: dCard,
        goal: goal,
        newObjetivo : newObjetivo   
    },
    data(){
        return{
            active: [false,false,false,false],
            transitionName: DEFAULT_TRANSITION,
            opened:0,
            objetivos:[],
            innerWidth: 0,
            dialog:false,
        }
    },
    computed:{
        ...mapState(['objetivo']),
    },
    head: {
        title() {
            return {
                inner: "Reporteador",
                separator:'|',
                complement:'Ventas'
            };
        }
    },
    methods:{
        ...mapActions(['resetNewGoal']),
        ...transitions,
        activate(pos){
            for (let i = 1; i < this.active.length+1; i++) {
                this.active[i-1] = (i === pos);
            }
        },
        onResize() {
            this.innerWidth = window.innerWidth;
        },
        close(){
            this.resetNewGoal();
            this.dialog = false;
        },
        crear(){
            this.objetivos.push(this.objetivo);
            this.resetNewGoal();
            this.dialog = false;
        },
        remove(id){
            this.objetivos = this.objetivos.filter(i => i.id !== id);
        }
    },
    created(){
        this.animate(this.transitionName);
        this.opened = (this.$route.name === 'ventas') ? 0 : 1;
        window.addEventListener('resize', this.onResize);
        this.onResize();
    },
    beforeUpdate(){
        this.opened = (this.$route.name === 'ventas') ? 0 : 1;
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
};
</script>

<style lang="scss">
    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active {
        transition-duration: .3s;
        transition-property: all;
        transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
        overflow: hidden;
    }
    
    .slide-left-enter,
    .slide-right-leave-active {
        opacity: 0;
        transform: translate(2em, 0);
    }
    
    .slide-left-leave-active,
    .slide-right-enter {
        opacity: 0;
        transform: translate(-2em, 0);
    }
</style>