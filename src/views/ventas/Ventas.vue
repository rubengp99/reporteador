<template>
  <div class="ventas">
    <v-container data-app style="padding:0 2.5vw;margin-top: 74px;max-width:97vw;">
        <v-row>
            <dCard col="3" icon img="buyers" title="Clientes" hoverable path="/clientes"/>
            <dCard col="3" icon img="sellers" title="Vendedores" hoverable path="/vendedores"/>
            <dCard col="3" icon img="routes" title="Rutas" hoverable path="/rutas"/>
            <dCard col="3" icon img="ranking" title="Más vendidos" hoverable path="/ranking"/>
        </v-row>

        <v-row>
           <transition :name="transitionName" mode="out-in" @beforeLeave="beforeLeave" @enter="enter" @afterEnter="afterEnter">
              <router-view/>
          </transition>
        </v-row>
    </v-container>
  </div>
</template>

<script>
import dCard from "@/components/aplicacion/Dashcard";
import transitions from '@/plugins/transitions'
//import loader from "../components/aplicacion/loading"

export default {
  name: "Ventas",
  components: {
    dCard: dCard,
    //loader: loader,    
  },
  methods:{
    ...transitions
  },
  created(){
    this.animate('fade');
  }
};
</script>

<style lang="scss">
</style>