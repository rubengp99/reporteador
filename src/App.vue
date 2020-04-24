<template>
  <v-app id="app" style="background: #F5F5F5;">
    <navigation  class="v-application"/>
    <transition :name="transitionName" mode="out-in" @beforeLeave="beforeLeave" @enter="enter" @afterEnter="afterEnter">
        <router-view/>
    </transition>

    <Snackbar v-if="!mensaje === ''" :mensaje="mensaje" :icon="icon" :color="color" />
  </v-app>
</template>

<script>
  import navigation from './components/aplicacion/Navigation'
  import transitions from './plugins/transitions'
  import {mapState, mapActions} from 'vuex';
  import Snackbar from '@/components/aplicacion/Snackbar';

  const DEFAULT_TRANSITION = 'fade';
  export default {
    name: 'app',
    components: {
      navigation: navigation,
      Snackbar
    },
    data() {
     return {
        mensaje:'Actualizando información...',
        color:'#388E3C',
        icon:'done',
        prevHeight: 0,
        transitionName: DEFAULT_TRANSITION,
        dataCache:[],
     };
   },
   computed:{
     ...mapState(['init','snackBar','logged']),
   },
    methods:{
      ...transitions,
      ...mapActions(['setInitAplicacion','setUpdateInventario','setUpdateDashboard',
          'setUpdateVentas','setConcepts','setInvoices','setConceptSales','setGroups','setSubgroups',
          'setGroupSales','setSubgroupSales','setWeeklySales','setStorages','setSellers',
          'setBuyers','setTotalClientes','setTotalVendedores','setTodayInvoices', 'restoreFromCache', 'setSnackbar'
        ]),
      checkCache(){
        this.dataCache = [
          JSON.parse(window.localStorage.getItem('Concepts')),
          JSON.parse(window.localStorage.getItem('Invoices')),
          JSON.parse(window.localStorage.getItem('ConceptSales')),
          JSON.parse(window.localStorage.getItem('Groups')),
          JSON.parse(window.localStorage.getItem('SubGroups')),
          JSON.parse(window.localStorage.getItem('GroupSales')),
          JSON.parse(window.localStorage.getItem('SubGroupSales')),
          JSON.parse(window.localStorage.getItem('WeeklySales')),
          JSON.parse(window.localStorage.getItem('Storages')),
          JSON.parse(window.localStorage.getItem('Sellers')),
          JSON.parse(window.localStorage.getItem('Buyers')),
          JSON.parse(window.localStorage.getItem('totalVendedores')),
          JSON.parse(window.localStorage.getItem('totalClientes')),
          JSON.parse(window.localStorage.getItem('TodayInvoices'))
        ];
      },
      cacheApp(){
        this.setConcepts(JSON.parse(window.localStorage.getItem('Concepts')));
        this.setInvoices(JSON.parse(window.localStorage.getItem('Invoices')));
        this.setTodayInvoices(JSON.parse(window.localStorage.getItem('TodayInvoices')));
        this.setConceptSales(JSON.parse(window.localStorage.getItem('ConceptSales')));
        this.setGroups(JSON.parse(window.localStorage.getItem('Groups')));
        this.setSubgroups(JSON.parse(window.localStorage.getItem('SubGroups')));
        this.setGroupSales(JSON.parse(window.localStorage.getItem('GroupSales')));
        this.setSubgroupSales(JSON.parse(window.localStorage.getItem('SubGroupSales')));
        this.setWeeklySales(JSON.parse(window.localStorage.getItem('WeeklySales')));
        this.setStorages(JSON.parse(window.localStorage.getItem('Storages')));
        this.setTotalVendedores(JSON.parse(window.localStorage.getItem('totalVendedores')));
        this.setTotalClientes(JSON.parse(window.localStorage.getItem('totalClientes')));
        this.setSellers(JSON.parse(window.localStorage.getItem('Sellers')));
        this.setBuyers(JSON.parse(window.localStorage.getItem('Buyers')));
        this.restoreFromCache();
      }
    },
    watch:{
      init: async function(){
        this.setSnackbar(true);
        this.setUpdateInventario(null);
        this.setUpdateDashboard(null);
        this.setUpdateVentas(null);
        setInterval(async ()=>{
          this.setSnackbar(true);
          this.setUpdateInventario(null);
          this.setUpdateDashboard(null);
          this.setUpdateVentas(null);
        },180000)
      }
    },
    created() {
      this.checkCache();
      if(this.dataCache.every(val => val !== null))
        this.cacheApp();        
      this.animate(this.transitionName);
      this.setInitAplicacion(null);
      
    },
  }
</script>

