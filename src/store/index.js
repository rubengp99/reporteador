import Vue from "vue";
import Vuex from "vuex";
import buyers from "@/services/Clientes"
import sellers from "@/services/Vendedores"
import concept from "@/services/Conceptos";
import invoices from "@/services/Factura";
import groups from "@/services/Grupos"
import subGroups from '@/services/SubGrupos'
import storages from '@/services/Depositos';
import w from '@/services/variables'
import moment from "moment";

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        user:{//variabla de sesion
            token:null,
            data:{},
            loggedIn:false
        },
        //banderas
        drawer:false,
        snackbar:false,
        modalsesion:false,
        foto: '',
        fotoChanged:false,
        fotoFile: null,
        vuexConcepts: null,
        vuexConceptSales: null,
        vuexInvoices: null,
        vuexGroups: null,
        vuexSubGroups: null,
        vuexWeeklySales: null,
        vuexStorages: null,
        vuexGroupSales: null,
        vuexSubGroupSales: null,
        vuexTodayInvoices: null,
        vuexSellers: null,
        vuexBuyers: null,
        initAux: [false,false,false,false,false,false,false],
        init: false,
        inventoryUpdatedAux: [false,false,false,false,false,false],
        inventoryUpdated: false,
        dashboardUpdatedAux: [false,false,false,false],
        dashboardUpdated: false,
        rankingUpdated: false,
        sellersUpdated: false,
        buyersUpdated: false,
        chosenRanked: 0,
    },
    getters: {
        
    },
    mutations: {
        //banderas
        SET_DRAWER(state,val){
            val ? state.drawer = true:state.drawer = false;
        },
        SET_MODAL_SESION(state,val){
            val ? state.modalsesion = true:state.modalsesion = false;
        },
        SET_MODAL_CARRITO(state,val){
            val ? state.modalcarrito = true:state.modalcarrito = false;
        },
        SET_SNACKBAR(state,val){
            val ? state.snackbar = true:state.snackbar = false;
        },
        //autenticacion
        SET_LOGGED(state,val){//logea al usuario
            state.user.loggedIn = true;
            state.user.token= val.token;
            state.user.data = val.data;
            window.localStorage.setItem('token',val.token);
        },
        LOGOUT(state){//cierra la sesion
            state.user.token=null;
            state.user.data={};
            state.user.loggedIn=false;
            window.localStorage.setItem('token',"");//se elimina el token del storage
        },
        SET_FOTO(state, val){
            state.foto = val;
        },
        SET_FOTOFILE(state, val){
            state.fotoFile = val;
        },
        SET_CHANGEFOTO(state, val){
            state.fotoChanged = val;
        },
        SET_CHOSENRANKED(state, val){
            state.chosenRanked = val;
        },
        async SET_UPDATE_INVENTARIO(state){
            concept().get('?limit='+state.vuexConcepts.data.totalCount+'&fields=existencias').then(reponse =>{
                state.vuexConcepts = reponse;
                state.vuexConcepts.data.data.reverse();
                state.inventoryUpdatedAux[0] = true;
                if(state.inventoryUpdatedAux[0] && state.inventoryUpdatedAux[1] && state.inventoryUpdatedAux[2] && state.inventoryUpdatedAux[3] && state.inventoryUpdatedAux[4])
                    state.inventoryUpdated = true;
                if(state.inventoryUpdatedAux[0] && state.inventoryUpdatedAux[1] && state.inventoryUpdatedAux[2] && state.inventoryUpdatedAux[3])
                    state.rankingUpdated = true;
            });
            concept().get('/mostSold/?limit='+state.vuexConcepts.data.totalCount).then(reponse =>{
                state.vuexConceptSales = reponse;
                state.inventoryUpdatedAux[1] = true;
                if(state.inventoryUpdatedAux[0] && state.inventoryUpdatedAux[1] && state.inventoryUpdatedAux[2] && state.inventoryUpdatedAux[3] && state.inventoryUpdatedAux[4])
                    state.inventoryUpdated = true;
                if(state.inventoryUpdatedAux[0] && state.inventoryUpdatedAux[1] && state.inventoryUpdatedAux[2] && state.inventoryUpdatedAux[3])
                    state.rankingUpdated = true;
            });
            groups().get('?limit='+state.vuexGroups.data.totalCount).then(reponse =>{
                state.vuexGroups = reponse;
                state.inventoryUpdatedAux[2] = true;
                if(state.inventoryUpdatedAux[0] && state.inventoryUpdatedAux[1] && state.inventoryUpdatedAux[2] && state.inventoryUpdatedAux[3] && state.inventoryUpdatedAux[4])
                    state.inventoryUpdated = true;
                if(state.inventoryUpdatedAux[0] && state.inventoryUpdatedAux[1] && state.inventoryUpdatedAux[2] && state.inventoryUpdatedAux[3])
                    state.rankingUpdated = true;
            });
            subGroups().get('?limit='+state.vuexSubGroups.data.totalCount).then(reponse =>{
                state.vuexSubGroups = reponse;
                state.inventoryUpdatedAux[3] = true;
                if(state.inventoryUpdatedAux[0] && state.inventoryUpdatedAux[1] && state.inventoryUpdatedAux[2] && state.inventoryUpdatedAux[3] && state.inventoryUpdatedAux[4])
                    state.inventoryUpdated = true;
                if(state.inventoryUpdatedAux[0] && state.inventoryUpdatedAux[1] && state.inventoryUpdatedAux[2] && state.inventoryUpdatedAux[3])
                    state.rankingUpdated = true;
            });
            let weeklySales = [];
            for (let i = 6; i > -1; i--)
                weeklySales.push(await invoices().get('?limit='+state.vuexInvoices.data.totalCount+'&fecha_at='+moment(w.test).locale('es').subtract(i,'days').format('YYYY-MM-DD')));
            state.vuexWeeklySales = weeklySales;
            state.inventoryUpdatedAux[4] = true;
            if(state.inventoryUpdatedAux[0] && state.inventoryUpdatedAux[1] && state.inventoryUpdatedAux[2] && state.inventoryUpdatedAux[3] && state.inventoryUpdatedAux[4])
                state.inventoryUpdated = true;
        },
        SET_INIT_APLICACION(state){
            concept().get('?limit=1').then(reponse =>{
                state.vuexConcepts = reponse;
                state.initAux[0] = true;
                if(state.initAux.every(i => i))
                    state.init = true;
            });
            concept().get('/mostSold/?limit=1').then(reponse =>{
                state.vuexConceptSales = reponse;
                state.initAux[1] = true;
                if(state.initAux.every(i => i))
                    state.init = true;
            });
            invoices().get('?limit=1').then(reponse =>{
                state.vuexInvoices = reponse;
                state.initAux[2] = true;
                if(state.initAux.every(i => i))
                    state.init = true;
            });
            groups().get('?limit=1').then(reponse =>{
                state.vuexGroups = reponse;
                state.initAux[3] = true;
                if(state.initAux.every(i => i))
                    state.init = true;
            });
            subGroups().get('?limit=1').then(reponse =>{
                state.vuexSubGroups = reponse;
                state.initAux[4] = true;
                if(state.initAux.every(i => i))
                    state.init = true;
            });
            sellers().get('?limit=1').then(reponse =>{
                state.vuexSellers = reponse;
                state.initAux[5] = true;
                if(state.initAux.every(i => i))
                    state.init = true;
            });
            buyers().get('?limit=1').then(reponse =>{
                state.vuexBuyers = reponse;
                state.initAux[6] = true;
                if(state.initAux.every(i => i))
                    state.init = true;
            }); 

        },
        async SET_UPDATE_DASHBOARD(state){
            storages().get().then(response =>{
                state.vuexStorages = response;
                state.dashboardUpdatedAux[0] = true;
                if(state.dashboardUpdatedAux[0] && state.dashboardUpdatedAux[1] && state.dashboardUpdatedAux[2] && state.dashboardUpdatedAux[3])
                    state.dashboardUpdated = true;
            });
            groups().get('/mostSold/?limit='+state.vuexGroups.data.totalCount+'&fecha_at='+moment(w.test).format('YYYY-MM-DD')).then(response =>{
                state.vuexGroupSales = response;
                state.dashboardUpdatedAux[1] = true;
                if(state.dashboardUpdatedAux[0] && state.dashboardUpdatedAux[1] && state.dashboardUpdatedAux[2] && state.dashboardUpdatedAux[3])
                    state.dashboardUpdated = true;
            });
            subGroups().get('/mostsold/?limit='+state.vuexSubGroups.data.totalCount+'&fecha_at='+moment(w.test).format('YYYY-MM-DD')).then(response =>{
                state.vuexSubGroupSales = response;
                state.dashboardUpdatedAux[2] = true;
                if(state.dashboardUpdatedAux[0] && state.dashboardUpdatedAux[1] && state.dashboardUpdatedAux[2] && state.dashboardUpdatedAux[3])
                    state.dashboardUpdated = true;
            });
            invoices().get('?limit='+state.vuexInvoices.data.totalCount+'&fecha_at='+moment(w.test).format('YYYY-MM-DD')).then(reponse =>{
                state.vuexTodayInvoices = reponse;
                state.dashboardUpdatedAux[3] = true;
                if(state.dashboardUpdatedAux[0] && state.dashboardUpdatedAux[1] && state.dashboardUpdatedAux[2] && state.dashboardUpdatedAux[3])
                    state.dashboardUpdated = true;
            });
        },
        SET_UPDATE_VENTAS(state){
            sellers().get('/mostSellers/?limit='+state.vuexSellers.data.totalCount).then(reponse =>{
                state.vuexSellers = reponse;
                state.sellersUpdated = true;
            });
            buyers().get('/mostBuyers/?limit='+state.vuexSellers.data.totalCount).then(reponse =>{
                state.vuexBuyers = reponse;
                state.buyersUpdated = true;
            });
        },
    },
    actions: {
        setDrawer({commit},val){
            commit('SET_DRAWER',val);
        },
        setModalSesion({commit},val){
            commit('SET_MODAL_SESION',val);
        },
        setSnackbar({commit},val){
            commit('SET_SNACKBAR',val);
        },
        logged({commit},val){
            commit('SET_LOGGED',val);
        },
        logout({commit}){
            commit('LOGOUT');
        },
        setFoto({commit},val){
            commit('SET_FOTO',val);
        },
        setFotoChanged({commit},val){
            commit('SET_CHANGEFOTO',val);
        },
        setFotoFile({commit},val){
            commit('SET_FOTOFILE',val);
        },
        setUpdateInventario({commit},val){
            commit('SET_UPDATE_INVENTARIO',val);
        },
        setInitAplicacion({commit},val){
            commit('SET_INIT_APLICACION',val);
        },
        setUpdateDashboard({commit},val){
            commit('SET_UPDATE_DASHBOARD',val);
        },
        setChosenRanked({commit},val){
            commit('SET_CHOSENRANKED',val);
        },
        setUpdateVentas({commit},val){
            commit('SET_UPDATE_VENTAS',val);
        },
    }
});