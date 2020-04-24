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
        dataCache:[],
     };
   },
   computed:{
     ...mapState(['init']),
   },
    methods:{
      ...transitions,
      ...mapActions(['setInitAplicacion','setUpdateInventario','setUpdateDashboard',
          'setUpdateVentas','setConcepts','setInvoices','setConceptSales','setGroups','setSubgroups',
          'setGroupSales','setSubgroupSales','setWeeklySales','setStorages','setSellers',
          'setBuyers','setTotalClientes','setTotalVendedores', 'restoreFromCache'
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
          JSON.parse(window.localStorage.getItem('totalClientes'))
        ];
      },
      cacheApp(){
        this.setConcepts(JSON.parse(window.localStorage.getItem('Concepts')));
        this.setInvoices(JSON.parse(window.localStorage.getItem('Invoices')));
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
        this.setUpdateInventario(null);
        this.setUpdateDashboard(null);
        this.setUpdateVentas(null);
        setInterval(async ()=>{
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

