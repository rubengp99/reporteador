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
                                <v-list-item-group v-if="!loading">
                                    <v-scroll-y-transition mode="out-in">
                                        <div>
                                            <p v-show="objetivos.length === 0" class="body-2 bold" style="margin:0">No se han establecido objetivos de venta aún...</p>
                                            <v-img v-show="objetivos.length === 0" :src="require('@/assets/nogoals.svg')" max-width="400px" style="margin: 15px auto;"></v-img>
                                        </div>
                                    </v-scroll-y-transition>
                                    <goal v-for="obj in objetivos" :key="obj.id" :id="obj.id" :responsable="obj.responsable" :meta="obj.meta" :fecha="obj.limite" :progreso-meta="obj.progreso" :tipo="obj.tipo" :moneda="obj.moneda" :stream="loading">
                                        <template v-slot:actions>
                                            <v-row class="mt-2">
                                                <v-col md="6" style="padding:0 10px">
                                                    <v-btn small outlined dense color="indigo" style="width:80%;min-width:45px;" @click="edit(obj.id)">
                                                        <v-icon>edit</v-icon>
                                                    </v-btn>
                                                </v-col>
                                                 <v-col md="6" style="padding:0 10px">
                                                    <v-btn small outlined dense color="red" style="width:80%;min-width:45px;" @click="remove(obj.id)">
                                                        <v-icon>close</v-icon>
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                        </template>
                                    </goal>
                                </v-list-item-group>
                                <div v-else>
                                    <v-spacer></v-spacer>
                                    <loader />
                                    <v-spacer></v-spacer>
                                </div>
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
                    <v-btn color="#005598" class="bold" style="color:white;" @click="!editMode ? crear() : actualizar()">{{ !editMode ? 'Crear' : 'Actualizar'}}</v-btn>
                </template>
            </newObjetivo>
        </v-container>
    </div>
</template>

<script>
import dCard from "@/components/aplicacion/Dashcard";
import transitions from '@/plugins/transitions';
import goal from '@/components/ventas/objetivo';
import newObjetivo from "@/components/ventas/crearObjetivo";
import Objetivo from "@/services/Objetivos";
import Sellers from "@/services/Vendedores";
import moment from 'moment';
import w from "@/services/variables";
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
            editMode: false,
            loading:true,
            editId: 0,
        }
    },
    computed:{
        ...mapState(['objetivo','vuexGoals','goalsUpdated']),
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
        ...mapActions(['resetNewGoal','setNewGoal','setGoals']),
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
            let newObjetivo = this.objetivo;
            delete newObjetivo.progreso;
            Objetivo().post('/',{data:{...newObjetivo}}).then(async () => {
                this.$toasted.info("Se ha creado un nuevo Objetivo de Ventas.", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'done_all'
                });
                await this.updateRecords();
                this.crearObjetivos();
            }).catch((e)=>{
                console.log(e);
                this.$toasted.error("Ha ocurrido un error al crear el Objetivo.", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'done_all'
                });
            });
            this.resetNewGoal();
            this.dialog = false;
        },
        remove(id){
            Objetivo().delete('/'+id).then( async () => {
                this.$toasted.info("Se ha eliminado un Objetivo de Ventas.", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'done_all'
                });
                await this.updateRecords();
                this.crearObjetivos();
            }).catch((e)=>{
                console.log(e);
                this.$toasted.error("Ha ocurrido un error al eliminar el Objetivo.", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'done_all'
                });
            });
        },
        edit(id){
            this.setNewGoal(this.objetivos.find(i => i.id === id));
            this.editMode = true;
            this.editId = id;
            this.dialog = true;
        },
        actualizar(){
            let newObjetivo = this.objetivo;
            delete newObjetivo.progreso;
            delete newObjetivo.fecha_at;
            delete newObjetivo.id
            newObjetivo.limite = moment(newObjetivo.limite).locale('es').format('YYYY-MM-DD');
            Objetivo().post('/'+this.editId,{data:{...newObjetivo}}).then(async () => {
                this.$toasted.info("Se ha Actualizado un Objetivo de Ventas.", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'done_all'
                });
                await this.updateRecords();
                this.editId = 0;
                this.resetNewGoal();
                this.dialog = false;
                this.editMode = false;
                this.crearObjetivos();
            }).catch((e)=>{
                console.log(e);
                this.$toasted.error("Ha ocurrido un error al Actualizar el Objetivo.", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'done_all'
                });
            });
        },
        async crearObjetivos(){
            try {
                let aux = typeof this.vuexGoals.data.data !== undefined ? this.vuexGoals.data.data : [];
                
                for (const goal of aux) {
                    let fecha_in = w.test !== '' ? w.test : goal.fecha_at;
                    let limites = 'after-fecha_at=' +moment(fecha_in).locale('es').format('YYYY-MM-DD') +'&before-fecha_at='+moment(goal.limite).locale('es').format('YYYY-MM-DD');
                    let progreso = await Sellers().get('/mostSellers/?'+limites+'&limit='+JSON.parse(window.localStorage.getItem('totalVendedores')));
                    if(goal.tipo.toLowerCase() === 'ingresos'){
                        if(goal.responsable === 0){
                            if (goal.moneda === 'Bs')
                                goal.progreso = +progreso.data.data.map(i => i.venta_total).reduce((a,b) => +a+b);
                            else
                                goal.progreso = +progreso.data.data.map(i => i.venta_total_dolar).reduce((a,b) => +a+b);
                        }else{
                            if (goal.moneda === 'Bs')
                                goal.progreso = +progreso.data.data.filter(i => i.id === goal.responsable)[0].venta_total;
                            else
                                goal.progreso = +progreso.data.data.filter(i => i.id === goal.responsable)[0].venta_total_dolar;
                       }
                    }else if(goal.tipo.toLowerCase() === 'ventas'){
                        if(goal.responsable === 0){
                            goal.progreso = +progreso.data.data.map(i => i.ventas).reduce((a,b) => +a+b);
                        }else{
                            goal.progreso = +progreso.data.data.find(i => i.id === goal.responsable).ventas;
                        }
                    }
                }       
                this.objetivos = aux;
                this.$forceUpdate();
            } catch (e) {
                console.log(e);
                this.objetivos = [];
            }

            this.loading = false;
        },
        async updateRecords(){
            let aux;
            aux = await Objetivo().get('?limit=1');
            window.localStorage.setItem('totalObjetivos', JSON.stringify(typeof aux.data.totalCount !== undefined ? aux.data.totalCount : 0));
            aux = await Objetivo().get('?limit='+JSON.parse(window.localStorage.getItem('totalObjetivos')));
            this.setGoals(aux);
            window.localStorage.setItem('Goals', JSON.stringify(aux));
            try {
                this.objetivos = this.vuexGoals.data.data;
            } catch (e) {
                this.objetivos = [];
            }
        }
    },
    watch:{
        async vuexGoals(){
            this.crearObjetivos();
        },
        async goalsUpdated(){
            this.crearObjetivos();
        },
    },
    created(){
        if(this.goalsUpdated)
            this.crearObjetivos();
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