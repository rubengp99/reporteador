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
    state: {
        user: { //variabla de sesion
            token: null,
            data: {},
            loggedIn: false
        },
        objetivo: {//variable para crear objetivos
            id: null,
            tipo: null,
            responsable: null,
            meta: null,
            progreso: 0,
            moneda: null,
            limite: null,
        },
        //banderas
        drawer: false,
        foto: '',
        fotoChanged: false,
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
        initAux: [false, false, false, false, false, false, false],
        init: false,
        inventoryUpdatedAux: [false, false, false, false, false],
        inventoryUpdated: false,
        dashboardUpdatedAux: [false, false, false, false],
        dashboardUpdated: false,
        rankingUpdated: false,
        sellersUpdated: false,
        buyersUpdated: false,
        totalClientes: 0,
        totalVendedores: 0,
        restoredFromCache: false,
    },
    getters: {

    },
    mutations: {
        //banderas
        SET_DRAWER(state, val) {
            val ? state.drawer = true : state.drawer = false;
        },
        //autenticacion
        SET_LOGGED(state, val) { //logea al usuario
            state.user.loggedIn = true;
            state.user.token = val.token;
            state.user.data = val.data;
            window.localStorage.setItem('token', val.token);
        },
        LOGOUT(state) { //cierra la sesion
            state.user.token = null;
            state.user.data = {};
            state.user.loggedIn = false;
            window.localStorage.removeItem('token');
        },
        SET_FOTO(state, val) {
            state.foto = val;
        },
        SET_FOTOFILE(state, val) {
            state.fotoFile = val;
        },
        SET_CHANGEFOTO(state, val) {
            state.fotoChanged = val;
        },
        SET_CHOSENRANKED(state, val) {
            state.chosenRanked = val;
        },
        SET_CONCEPTS(state, val) {
            state.vuexConcepts = val;
        },
        SET_INVOICES(state, val) {
            state.vuexInvoices = val;
        },
        SET_CONCEPT_SALES(state, val) {
            state.vuexConceptSales = val;
        },
        SET_TODAY_INVOICES(state, val) {
            state.vuexTodayInvoices = val;
        },
        SET_GROUPS(state, val) {
            state.vuexGroups = val;
        },
        SET_SUBGROUPS(state, val) {
            state.vuexSubGroups = val;
        },
        SET_GROUP_SALES(state, val) {
            state.vuexGroupSales = val;
        },
        SET_SUBGROUP_SALES(state, val) {
            state.vuexSubGroupSales = val;
        },
        SET_WEEKLY_SALES(state, val) {
            state.vuexWeeklySales = val;
        },
        SET_STORAGES(state, val) {
            state.vuexStorages = val;
        },
        SET_BUYERS(state, val) {
            state.vuexBuyers = val;
        },
        SET_SELLERS(state, val) {
            state.vuexSellers = val;
        },
        SET_TOTAL_VENDEDORES(state, val) {
            state.totalVendedores = val;
        },
        SET_TOTAL_CLIENTES(state, val) {
            state.totalClientes = val;
        },
        SET_NEW_GOAL(state,val){
            state.objetivo = val;
        },
        RESET_NEW_GOAL(state){
            state.objetivo = Object.assign({}, {
                id: null,
                tipo: null,
                responsable: null,
                meta: null,
                progreso: 0,
                moneda: '',
                limite: null,
            });
        },
        async SET_UPDATE_INVENTARIO(state) {
            concept().get('?limit=' + state.vuexConcepts.data.totalCount + '&fields=existencias&orderField=id&order=DESC').then(response => {
                state.vuexConcepts = response;
                window.localStorage.setItem('Concepts', JSON.stringify(response));
                state.inventoryUpdatedAux[0] = true;
                if (state.inventoryUpdatedAux.every(i => i))
                    state.inventoryUpdated = true;
                if (state.inventoryUpdatedAux.slice(0,3).every(i => i))
                    state.rankingUpdated = true;
            });
            concept().get('/mostSold/?limit=' + state.vuexConcepts.data.totalCount).then(response => {
                state.vuexConceptSales = response;
                window.localStorage.setItem('ConceptSales', JSON.stringify(response));
                state.inventoryUpdatedAux[1] = true;
                if (state.inventoryUpdatedAux.every(i => i))
                    state.inventoryUpdated = true;
                if (state.inventoryUpdatedAux.slice(0,3).every(i => i))
                    state.rankingUpdated = true;
            });
            groups().get('?limit=' + state.vuexGroups.data.totalCount).then(response => {
                state.vuexGroups = response;
                window.localStorage.setItem('Groups', JSON.stringify(response));
                state.inventoryUpdatedAux[2] = true;
                if (state.inventoryUpdatedAux.every(i => i))
                    state.inventoryUpdated = true;
                if (state.inventoryUpdatedAux.slice(0,3).every(i => i))
                    state.rankingUpdated = true;
            });
            subGroups().get('?limit=' + state.vuexSubGroups.data.totalCount).then(response => {
                state.vuexSubGroups = response;
                window.localStorage.setItem('SubGroups', JSON.stringify(response));
                state.inventoryUpdatedAux[3] = true;
                if (state.inventoryUpdatedAux.every(i => i))
                    state.inventoryUpdated = true;
                if (state.inventoryUpdatedAux.slice(0,3).every(i => i))
                    state.rankingUpdated = true;
            });
            let weeklySales = [];
            for (let i = 6; i > -1; i--)
                weeklySales.push(await invoices().get('?limit=' + state.vuexInvoices.data.totalCount + '&fields=id&fecha_at=' + moment(w.test).locale('es').subtract(i, 'days').format('YYYY-MM-DD')));
            state.vuexWeeklySales = weeklySales;
            state.inventoryUpdatedAux[4] = true;
            if (state.inventoryUpdatedAux.every(i => i))
                state.inventoryUpdated = true;
            window.localStorage.setItem('WeeklySales', JSON.stringify(weeklySales));
        },
        async SET_INIT_APLICACION(state) {
            concept().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    state.vuexConcepts = response;
                    state.initAux[0] = true;
                    if (state.initAux.every(i => i))
                        state.init = true;
                } else {
                    state.init = true;
                }
            });
            concept().get('/mostSold/?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    state.vuexConceptSales = response;
                    state.initAux[1] = true;
                    if (state.initAux.every(i => i))
                        state.init = true;
                } else {
                    state.init = true;
                }
            });
            invoices().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    state.vuexInvoices = response;
                    window.localStorage.setItem('Invoices', JSON.stringify(response));
                    state.initAux[2] = true;
                    if (state.initAux.every(i => i))
                        state.init = true;
                } else {
                    state.init = true;
                }
            });
            groups().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    state.vuexGroups = response;
                    state.initAux[3] = true;
                    if (state.initAux.every(i => i))
                        state.init = true;
                }
            });
            subGroups().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    state.vuexSubGroups = response;
                    state.initAux[4] = true;
                    if (state.initAux.every(i => i))
                        state.init = true;
                } else {
                    state.init = true;
                }
            });
            sellers().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    state.vuexSellers = response;
                    state.totalVendedores = state.vuexSellers.data.totalCount;
                    window.localStorage.setItem('totalVendedores', state.totalVendedores);
                    state.initAux[5] = true;
                    if (state.initAux.every(i => i))
                        state.init = true;
                } else {
                    state.init = true;
                }
            });
            buyers().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    state.vuexBuyers = response;
                    state.totalClientes = state.vuexBuyers.data.totalCount;
                    window.localStorage.setItem('totalClientes', state.totalClientes);
                    state.initAux[6] = true;
                    if (state.initAux.every(i => i))
                        state.init = true;
                } else {
                    state.init = true;
                }
            });

        },
        async SET_UPDATE_DASHBOARD(state) {
            storages().get().then(response => {
                state.vuexStorages = response;
                window.localStorage.setItem('Storages', JSON.stringify(response));
                state.dashboardUpdatedAux[0] = true;
                if (state.dashboardUpdatedAux.every(i => i))
                    state.dashboardUpdated = true;
            });
            groups().get('/mostSold/?limit=' + state.vuexGroups.data.totalCount + '&fecha_at=' + moment(w.test).format('YYYY-MM-DD')).then(response => {
                state.vuexGroupSales = response;
                window.localStorage.setItem('GroupSales', JSON.stringify(response));
                state.dashboardUpdatedAux[1] = true;
                if (state.dashboardUpdatedAux.every(i => i))
                    state.dashboardUpdated = true;
            });
            subGroups().get('/mostsold/?limit=' + state.vuexSubGroups.data.totalCount + '&fecha_at=' + moment(w.test).format('YYYY-MM-DD')).then(response => {
                state.vuexSubGroupSales = response;
                window.localStorage.setItem('SubGroupSales', JSON.stringify(response));
                state.dashboardUpdatedAux[2] = true;
                if (state.dashboardUpdatedAux.every(i => i))
                    state.dashboardUpdated = true;
            });
            invoices().get('?limit=' + state.vuexInvoices.data.totalCount + '&fecha_at=' + moment(w.test).format('YYYY-MM-DD')).then(response => {
                state.vuexTodayInvoices = response;
                window.localStorage.setItem('TodayInvoices', JSON.stringify(response));
                state.dashboardUpdatedAux[3] = true;
                if (state.dashboardUpdatedAux.every(i => i))
                    state.dashboardUpdated = true;
            });
        },
        async SET_UPDATE_VENTAS(state) {
            sellers().get('/mostSellers/?limit=' + state.totalVendedores).then(response => {
                state.vuexSellers = response;
                window.localStorage.setItem('Sellers', JSON.stringify(response));
                state.sellersUpdated = true;
            });
            buyers().get('/mostBuyers/?limit=' + state.totalClientes).then(response => {
                state.vuexBuyers = response;
                window.localStorage.setItem('Buyers', JSON.stringify(response));
                state.buyersUpdated = true;
            });
        },
        RESTORE_FROM_CACHE(state) {
            state.restoredFromCache = true;
            state.dashboardUpdated = true;
            state.inventoryUpdated = true;
            state.rankingUpdated = true;
            state.buyersUpdated = true;
            state.sellersUpdated = true;
        }
    },
    actions: {
        setDrawer({ commit }, val) {
            commit('SET_DRAWER', val);
        },
        setModalSesion({ commit }, val) {
            commit('SET_MODAL_SESION', val);
        },
        logged({ commit }, val) {
            commit('SET_LOGGED', val);
        },
        logout({ commit }) {
            commit('LOGOUT');
        },
        setFoto({ commit }, val) {
            commit('SET_FOTO', val);
        },
        setFotoChanged({ commit }, val) {
            commit('SET_CHANGEFOTO', val);
        },
        setFotoFile({ commit }, val) {
            commit('SET_FOTOFILE', val);
        },
        setUpdateInventario({ commit }, val) {
            commit('SET_UPDATE_INVENTARIO', val);
        },
        setInitAplicacion({ commit }, val) {
            commit('SET_INIT_APLICACION', val);
        },
        setUpdateDashboard({ commit }, val) {
            commit('SET_UPDATE_DASHBOARD', val);
        },
        setChosenRanked({ commit }, val) {
            commit('SET_CHOSENRANKED', val);
        },
        setUpdateVentas({ commit }, val) {
            commit('SET_UPDATE_VENTAS', val);
        },
        setConcepts({ commit }, val) {
            commit('SET_CONCEPTS', val);
        },
        setConceptSales({ commit }, val) {
            commit('SET_CONCEPT_SALES', val);
        },
        setGroups({ commit }, val) {
            commit('SET_GROUPS', val);
        },
        setInvoices({ commit }, val) {
            commit('SET_INVOICES', val);
        },
        setTodayInvoices({ commit }, val) {
            commit('SET_TODAY_INVOICES', val);
        },
        setSubgroups({ commit }, val) {
            commit('SET_SUBGROUPS', val);
        },
        setGroupSales({ commit }, val) {
            commit('SET_GROUP_SALES', val);
        },
        setSubgroupSales({ commit }, val) {
            commit('SET_SUBGROUP_SALES', val);
        },
        setWeeklySales({ commit }, val) {
            commit('SET_WEEKLY_SALES', val);
        },
        setStorages({ commit }, val) {
            commit('SET_STORAGES', val);
        },
        setSellers({ commit }, val) {
            commit('SET_SELLERS', val);
        },
        setBuyers({ commit }, val) {
            commit('SET_BUYERS', val);
        },
        setTotalClientes({ commit }, val) {
            commit('SET_TOTAL_CLIENTES', val);
        },
        setTotalVendedores({ commit }, val) {
            commit('SET_TOTAL_VENDEDORES', val);
        },
        restoreFromCache({ commit }) {
            commit('RESTORE_FROM_CACHE');
        },
        setNewGoal({ commit }, val){
            commit('SET_NEW_GOAL',val);
        },
        resetNewGoal({ commit }){
            commit('RESET_NEW_GOAL');
        }
    }
});