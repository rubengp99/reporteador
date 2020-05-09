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
        navigation: navigation,
    },
    data() {
        return {
            prevHeight: 0,
            transitionName: DEFAULT_TRANSITION,
            dataCache:[],
        };
   },
   computed:{
        ...mapState(['init','logged']),
   },
    methods:{
        ...transitions,
        ...mapActions(['setInitAplicacion','setUpdateInventario','setUpdateDashboard','setGoals',
            'setUpdateVentas','setConcepts','setInvoices','setConceptSales','setGroups','setSubgroups',
            'setGroupSales','setSubgroupSales','setWeeklySales','setStorages','setSellers','setConceptReturns',
            'setBuyers','setTotalClientes','setTotalVendedores','setTodayInvoices', 'setTotalObjetivos',
            'setTotalRutas','setRoutes','restoreFromCache',
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
                JSON.parse(window.localStorage.getItem('totalObjetivos')),
                JSON.parse(window.localStorage.getItem('TodayInvoices')),
                JSON.parse(window.localStorage.getItem('ConceptReturns')),
                JSON.parse(window.localStorage.getItem('Goals')),
                JSON.parse(window.localStorage.getItem('Routes')),
                JSON.parse(window.localStorage.getItem('totalRutas')),
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
            this.setTotalObjetivos(JSON.parse(window.localStorage.getItem('totalObjetivos')));
            this.setTotalRutas(JSON.parse(window.localStorage.getItem('totalRutas')));
            this.setSellers(JSON.parse(window.localStorage.getItem('Sellers')));
            this.setBuyers(JSON.parse(window.localStorage.getItem('Buyers')));
            this.setConceptReturns(JSON.parse(window.localStorage.getItem('ConceptReturns')));
            this.setGoals(JSON.parse(window.localStorage.getItem('Goals')));
            this.setRoutes(JSON.parse(window.localStorage.getItem('Routes')));
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
                this.$toasted.info("Se actualizó la información.", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'done_all'
                });
            },240000)
        }
    },
    created() {
        this.checkCache();
        if(this.dataCache.every(val => val !== null))
            this.cacheApp();
        else
            this.setInitAplicacion();
        this.animate(this.transitionName);
    }
}
</script>
