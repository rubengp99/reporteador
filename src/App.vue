<template>
  <v-app id="app" style="background: #F5F5F5;">
    <navigation  class="v-application"/>
    <transition :name="transitionName" mode="out-in" @beforeLeave="beforeLeave" @enter="enter" @afterEnter="afterEnter">
        <router-view/>
    </transition>
  </v-app>
</template>

<script>
  import navigation from './components/aplicacion/Navigation'
  import transitions from './plugins/transitions'
  import {mapState, mapActions} from 'vuex';

  const DEFAULT_TRANSITION = 'fade';
  export default {
    name: 'app',
    components: {
      navigation: navigation
    },
    data() {
     return {
        prevHeight: 0,
        transitionName: DEFAULT_TRANSITION,
     };
   },
   computed:{
     ...mapState(['init']),
   },
    methods:{
      ...transitions,
      ...mapActions(['setInitAplicacion','setUpdateInventario','setUpdateDashboard','setUpdateVentas']),
    },
    watch:{
      init: async function(){
        this.setUpdateInventario(null);
        this.setUpdateDashboard(null);
        this.setUpdateVentas(null);
        setInterval(async ()=>{
          this.setUpdateInventario(null);
          this.setUpdateDashboard(null);
          this.setUpdateVentas(null);
        },300000)
      }
    },
    created() {
      this.animate(this.transitionName);
      this.setInitAplicacion(null);
    },
  }
</script>

