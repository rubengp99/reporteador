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
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header class="title" style="text-align:center"><p style="margin:0">Objetivos de Venta</p></v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list>
                    <v-list-item-group>
                      <goal :id="1" responsable="Empresa" meta="40000" fecha="27 de febrero 2020" :progreso="(20000/40000)" tipo="ventas" />
                      <goal :id="1" responsable="Empresa" meta="40000" fecha="27 de febrero 2020" :progreso="(20000/40000)" tipo="ventas" />
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
    </v-container>
  </div>
</template>

<script>
import dCard from "@/components/aplicacion/Dashcard";
import transitions from '@/plugins/transitions'
import goal from '@/components/ventas/objetivo'
//import loader from "../components/aplicacion/loading"

const DEFAULT_TRANSITION = 'slide';

export default {
  name: "Ventas",
  components: {
    dCard: dCard,
    goal: goal   
  },
  data(){
    return{
      active: [false,false,false,false],
      transitionName: DEFAULT_TRANSITION,
    }
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
    ...transitions,
    activate(pos){
      for (let i = 1; i < this.active.length+1; i++) {
        this.active[i-1] = (i === pos);
      }
    }
  },
  created(){
    this.animate(this.transitionName);
  }
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