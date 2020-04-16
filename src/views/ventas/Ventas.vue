<template>
  <div class="ventas">
    <v-container data-app style="padding:0 2.5vw;margin-top: 74px;max-width:97vw;">
        <v-row>
            <dCard col="3" icon img="buyers" title="Clientes" hoverable path="/ventas/clientes" :active="active[0]" v-on:click.native="activate(0)"/>
            <dCard col="3" icon img="sellers" title="Vendedores" hoverable path="/ventas/vendedores" :active="active[1]" v-on:click.native="activate(1)"/>
            <dCard col="3" icon img="routes" title="Rutas" hoverable path="/ventas/rutas" :active="active[2]" v-on:click.native="activate(2)"/>
            <dCard col="3" icon img="ranking" title="Más vendidos" hoverable path="/ventas/ranking" :active="active[3]" v-on:click.native="activate(3)"/>
        </v-row>

        <v-row>
           <transition :name="'slide'" mode="out-in" @beforeLeave="beforeLeave" @enter="enter" @afterEnter="afterEnter">
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
  data(){
    return{
      active: [false,false,false,false],
    }
  },
  methods:{
    ...transitions,
    activate(pos){
      for (let i = 0; i < this.active.length; i++) {
        this.active[i] = (i === pos);
      }
    }
  },
  created(){
    this.animate('fade');
  }
};
</script>

<style lang="scss">
</style>