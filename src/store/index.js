import Vue from "vue";
import Vuex from "vuex";
import buyers from "@/services/Clientes"
import sellers from "@/services/Vendedores"
import concept from "@/services/Conceptos";
import invoices from "@/services/Factura";
import groups from "@/services/Grupos"
import subGroups from '@/services/SubGrupos'
import storages from '@/services/Depositos';
import goals from "@/services/Objetivos";
import compras from "@/services/Compras";
import routes from "@/services/Rutas";
import w from '@/services/variables'
import moment from "moment";

Vue.use(Vuex);
export const conceptsFields = "&fields=id,referencia,codigo,nombre,existencia_minima,existencia_maxima,descripcion,imagen,existencias,precio_dolar,costo_dolar,precio_a,ultimo_costo,adm_grupos_id,adm_subgrupos_id";

export default new Vuex.Store({
    state: {
        user: { //variabla de sesion
            token: null,
            data: {},
            loggedIn: false
        },
        objetivo: {//variable para crear objetivos
            tipo: null,
            responsable: null,
            meta: null,
            moneda: '',
            limite: moment(w.test).locale('es').format('YYYY-MM-DD'),
        },
        //banderas
        drawer: false,
        foto: '',
        fotoChanged: false,
        fotoFile: null,
        vuexIngresosVs:null,
        vuexConcepts: null,
        vuexConceptSales: null,
        vuexConceptReturns: null,
        vuexInvoices: null,
        vuexFacturasVs: null,
        vuexGroups: null,
        vuexSubGroups: null,
        vuexWeeklySales: null,
        vuexStorages: null,
        vuexGroupSales: null,
        vuexSubGroupSales: null,
        vuexTodayInvoices: null,
        vuexComprasVsVentas: null,
        vuexSellers: null,
        vuexRoutes: null,
        vuexGoals: null,
        vuexBuyers: null,
        initAux: [false, false, false, false, false, false, false, false, false, false, false],
        init: false,
        inventoryUpdatedAux: [false, false, false, false, false, false],
        inventoryUpdated: false,
        dashboardUpdatedAux: [false, false, false, false],
        dashboardUpdated: false,
        rankingUpdated: false,
        sellersUpdated: false,
        buyersUpdated: false,
        goalsUpdated: false,
        routesUpdated: false,
        facturasVsUpdated:false,
        ingresosVsUpdated:false,
        comprasVsVentasUpdated: false,
        vuexIngresosComp: [false, false, true],
        vuexFacturasComp: [false, false, true],
        vuexComprasVsVentasComp: [false, false, true],
        totalClientes: 0,
        totalVendedores: 0,
        totalObjetivos:0,
        totalRutas: 0,
        totalCompras: 0,
        restoredFromCache: false,
        valueFixArr: function(response){
            let emptyResArr = {
                data:{
                    totalCount: 0,
                    count: 0,
                    data: [],
                }
            };

            return typeof response.data.data !== 'undefined' ?
                response :
                emptyResArr;

        },
        valueFix: function (response) {
            let emptyRes = {
                data: {
                    totalCount: 0,
                    count: 0,
                    data: {},
                }
            };
            
            return typeof response.data.data !== 'undefined' ?
                response :
                emptyRes

        }
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
            window.sessionStorage.setItem('token', val.token);
        },

        LOGOUT(state) { //cierra la sesion
            state.user.token = null;
            state.user.data = {};
            state.user.loggedIn = false;
            window.sessionStorage.removeItem('token');
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

        SET_ROUTES(state, val) {
            state.vuexRoutes = val;
        },

        SET_COMPRAS(state, val) {
            state.vuexComprasVsVentas = val;
        },

        SET_FACTURAS_VS(state, val) {
            state.vuexFacturasVs = val;
        },

        SET_INGRESOS_VS(state, val) {
            state.vuexIngresosVs = val;
        },

        SET_TOTAL_RUTAS(state, val) {
            state.totalRutas = val;
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

        SET_CONCEPT_RETURNS(state,val){
            state.vuexConceptReturns = val;
        },

        SET_GOALS(state, val) {
            state.vuexGoals = val;
        },

        SET_TOTAL_GOALS(state, val) {
            state.totalObjetivos = val;
        },

        SET_TOTAL_COMPRAS(state, val) {
            state.totalCompras = val;
        },
        
        RESET_NEW_GOAL(state){
            state.objetivo = Object.assign({}, {
                tipo: null,
                responsable: null,
                meta: null,
                moneda: '',
                limite: moment(w.test).locale('es').format('YYYY-MM-DD'),
            });
        },

        //HACE UPDATE DE LA DATA DEL INVENTARIO
        async SET_UPDATE_INVENTARIO(state) {

            //Usamos depositos() porque es mucho más eficiente que conceptos()
            let deposits = await storages().get("?limit=1");
            
            //el storage 1 siempre tiene TODOS los conceptos registrados.
            let count =  await storages().get("1/conceptos?limit=1"+conceptsFields);
            deposits = await storages().get("?limit="+deposits.data.totalCount)
            let concepts = [];
            for (const storage of deposits.data.data) {
                let result = state.valueFixArr(await storages().get(storage.id+"/conceptos?limit="+count.data.totalCount+conceptsFields));

                result.data.data.forEach(r => {
                    if (!r.existencias)
                        r.existencias = [];
                    if (typeof concepts.find(i => i.id === r.id) !== 'undefined'){
                        concepts.find(i => i.id === r.id).existencias.push(Object.assign({ existencia: r.existencia }));
                    }else { 
                        r.existencias.push(Object.assign({ existencia: r.existencia }));
                        concepts.push(r);
                    }
                    
                    
                })
            }

            state.vuexConcepts = Object.assign({
                data:{
                    totalCount: count.data.totalCount,
                    count: count.data.totalCount,
                    data: concepts,
                }
            });

            window.localStorage.setItem('Concepts', JSON.stringify(state.vuexConcepts));
            state.inventoryUpdatedAux[0] = true;
            state.inventoryUpdated = state.inventoryUpdatedAux.every(i => i);
            state.rankingUpdated = state.inventoryUpdatedAux.slice(0,3).every(i => i);

            concept().get('/mostSold/?limit=' + state.vuexConcepts.data.totalCount+conceptsFields).then(response => {
                
                state.vuexConceptSales = state.valueFixArr(response);

                window.localStorage.setItem('ConceptSales', JSON.stringify(response));
                state.inventoryUpdatedAux[1] = true;
                state.inventoryUpdated = state.inventoryUpdatedAux.every(i => i)
                state.rankingUpdated = state.inventoryUpdatedAux.slice(0,3).every(i => i)
            });

            groups().get('?limit=' + state.vuexGroups.data.totalCount).then(response => {

                state.vuexGroups = state.valueFixArr(response);

                window.localStorage.setItem('Groups', JSON.stringify(response));
                state.inventoryUpdatedAux[2] = true;
                state.inventoryUpdated = state.inventoryUpdatedAux.every(i => i)
                state.rankingUpdated = state.inventoryUpdatedAux.slice(0,3).every(i => i)
            });

            subGroups().get('?limit=' + state.vuexSubGroups.data.totalCount).then(response => {

                state.vuexSubGroups = state.valueFixArr(response);

                window.localStorage.setItem('SubGroups', JSON.stringify(response));
                state.inventoryUpdatedAux[3] = true;
                state.inventoryUpdated = state.inventoryUpdatedAux.every(i => i)
                state.rankingUpdated = state.inventoryUpdatedAux.slice(0,3).every(i => i)
            });

            concept().get('/mostreturned/?fields=devueltos,id&limit=' + state.vuexConcepts.data.totalCount).then(response => {
                
                state.vuexConceptReturns = state.valueFixArr(response);

                window.localStorage.setItem('ConceptReturns', JSON.stringify(response));
                state.inventoryUpdatedAux[4] = true;
                state.inventoryUpdated = state.inventoryUpdatedAux.every(i => i)
            });

            let weeklySales = [];
            let aux = [];
            for (let i = 6; i > -1; i--)
                weeklySales.push(await invoices().get('?limit=' + state.vuexInvoices.data.totalCount + '&fields=id&fecha_at=' + moment(w.test).locale('es').subtract(i, 'days').format('YYYY-MM-DD')));
            
            weeklySales.forEach(week => aux.push(state.valueFixArr(week)))
            state.vuexWeeklySales = aux;
            state.inventoryUpdatedAux[5] = true;
            state.inventoryUpdated = state.inventoryUpdatedAux.every(i => i)
            window.localStorage.setItem('WeeklySales', JSON.stringify(weeklySales));
        },

        //INICIALIZA TODA LA DATA DEL PROYECTO SI NO SE USÓ CACHE
        async SET_INIT_APLICACION(state) {

            concept().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    response.data.totalCount = 10000
                    state.vuexConcepts = state.valueFixArr(response);
                    
                    state.initAux[0] = true;
                    state.init = state.initAux.every(i => i)
                } else {
                    state.init = true;
                }
            });

            concept().get('/mostSold/?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    response.data.totalCount = 10000
                    state.vuexConceptSales = state.valueFixArr(response);

                    state.initAux[1] = true;
                    state.init = state.initAux.every(i => i)
                } else {
                    state.init = true;
                }
            });

            invoices().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {

                    state.vuexInvoices = state.valueFixArr(response);

                    window.localStorage.setItem('Invoices', JSON.stringify(response));
                    state.initAux[2] = true;
                    state.init = state.initAux.every(i => i)
                } else {
                    state.init = true;
                }
            });

            groups().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {

                    state.vuexGroups = state.valueFixArr(response);

                    state.initAux[3] = true;
                    state.init = state.initAux.every(i => i)
                }
            });

            subGroups().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {

                    state.vuexSubGroups = state.valueFixArr(response);

                    state.initAux[4] = true;
                    state.init = state.initAux.every(i => i)
                } else {
                    state.init = true;
                }
            });

            sellers().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    state.vuexSellers = state.valueFixArr(response);

                    typeof response.data.totalCount !== 'undefined' ?
                        state.totalVendedores = state.vuexSellers.data.totalCount :
                        state.totalVendedores = 0;

                    window.localStorage.setItem('totalVendedores', state.totalVendedores);
                    state.initAux[5] = true;
                    state.init = state.initAux.every(i => i)
                } else {
                    state.init = true;
                }
            });

            buyers().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    state.vuexBuyers = state.valueFixArr(response);
                    
                    typeof response.data.totalCount !== 'undefined' ?
                        state.totalClientes = state.vuexBuyers.data.totalCount :
                        state.totalClientes = 0;

                    window.localStorage.setItem('totalClientes', state.totalClientes);
                    state.initAux[6] = true;
                    state.init = state.initAux.every(i => i)
                } else {
                    state.init = true;
                }
            });

            concept().get('/mostreturned/?fields=id&limit=1').then(response => {
                if (!state.restoredFromCache) {

                    state.vuexConceptReturns = state.valueFixArr(response);
                        
                    state.initAux[7] = true;
                    state.init = state.initAux.every(i => i)
                } else {
                    state.init = true;
                }
            });

            goals().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    state.vuexGoals = state.valueFixArr(response);

                    typeof response.data.totalCount !== 'undefined' ?
                        state.totalObjetivos = response.data.totalCount :
                        state.totalObjetivos = 0;

                    window.localStorage.setItem('totalObjetivos', state.totalObjetivos);
                    state.initAux[8] = true;
                    state.init = state.initAux.every(i => i)
                } else {
                    state.init = true;
                }
            });

            routes().get('?limit=1').then(response => {
                if (!state.restoredFromCache) {
                    state.vuexRoutes = state.valueFixArr(response);

                    typeof response.data.totalCount !== 'undefined' ?
                        state.totalRutas = response.data.totalCount :
                        state.totalRutas = 0;

                    window.localStorage.setItem('totalRutas', state.totalRutas);
                    state.initAux[9] = true;
                    state.init = state.initAux.every(i => i)
                } else {
                    state.init = true;
                }
            });

            compras().get('?limit=1').then(response => {
                if(!state.restoredFromCache) {

                   typeof response.data.totalCount !== 'undefined' ?
                       state.totalCompras = response.data.totalCount :
                       state.totalCompras = 0;

                    window.localStorage.setItem('totalCompras', state.totalCompras);
                    state.initAux[10] = true;
                    state.init = state.initAux.every(i => i)
                } else {
                    state.init = true;
                }
            });

        },
        
        /// HACE UPDATE AL DASHBOARD
        async SET_UPDATE_DASHBOARD(state) {
            
            storages().get().then(response => {

                state.vuexStorages = state.valueFixArr(response);

                window.localStorage.setItem('Storages', JSON.stringify(response));
                state.dashboardUpdatedAux[0] = true;
                state.dashboardUpdated = state.dashboardUpdatedAux.every(i => i)
            });

            groups().get('/mostSold/?limit=' + state.vuexGroups.data.totalCount + '&fecha_at=' + moment(w.test).format('YYYY-MM-DD')).then(response => {
                
                state.vuexGroupSales = state.valueFixArr(response);

                window.localStorage.setItem('GroupSales', JSON.stringify(response));
                state.dashboardUpdatedAux[1] = true;
                state.dashboardUpdated = state.dashboardUpdatedAux.every(i => i)
            });

            subGroups().get('/mostsold/?limit=' + state.vuexSubGroups.data.totalCount + '&fecha_at=' + moment(w.test).format('YYYY-MM-DD')).then(response => {
                
                state.vuexSubGroupSales = state.valueFixArr(response);

                window.localStorage.setItem('SubGroupSales', JSON.stringify(response));
                state.dashboardUpdatedAux[2] = true;
                state.dashboardUpdated = state.dashboardUpdatedAux.every(i => i)
            });

            invoices().get('?limit=' + state.vuexInvoices.data.totalCount + '&fecha_at=' + moment(w.test).format('YYYY-MM-DD')).then(response => {
                
                state.vuexTodayInvoices = state.valueFixArr(response);

                window.localStorage.setItem('TodayInvoices', JSON.stringify(response));
                state.dashboardUpdatedAux[3] = true;
                state.dashboardUpdated = state.dashboardUpdatedAux.every(i => i)
            });
        },

        /// HACE UPDATE AL MODULO DE VENTAS
        async SET_UPDATE_VENTAS(state) {
            state.vuexComprasVsVentas = [];

            sellers().get('/mostSellers/?limit=' + state.totalVendedores).then(response => {
                
                state.vuexSellers = state.valueFixArr(response);

                window.localStorage.setItem('Sellers', JSON.stringify(response));
                state.sellersUpdated = true;

                //esta data se usa en rentabilidad
                let data 

                try {
                    data = {
                        bolivares: Math.round(response.data.data.map(i => +i.venta_total).reduce((a, b) => a + b) * 100) / 100,
                        dolares: Math.round(response.data.data.map(i => +i.venta_total_dolar).reduce((a, b) => a + b) * 100) / 100,
                        compras: 0,
                    };
                } catch (e) {
                    data = {
                        bolivares: 0,
                        dolares: 0,
                        compras: 0,
                    };
                }

                state.vuexComprasVsVentas.push(data);
                state.vuexComprasVsVentasComp[1] = true;
                state.vuexComprasVsVentasComp[2] = state.vuexComprasVsVentasComp.slice(0, 2).every(i => !i);
               
                if (!state.vuexComprasVsVentasComp[2]) 
                    window.localStorage.setItem('ComprasVsVentas', JSON.stringify(state.vuexComprasVsVentas));
                
                state.comprasVsVentasUpdated = state.vuexComprasVsVentasComp[2];
            });

            buyers().get('/mostBuyers/?limit=' + state.totalClientes).then(response => {
                
                state.vuexBuyers = state.valueFixArr(response);

                window.localStorage.setItem('Buyers', JSON.stringify(response));
                state.buyersUpdated = true;
            });

            goals().get('?orderField=fecha_at&order=ASC&limit=' + state.totalObjetivos).then(response => {
                
                state.vuexGoals = state.valueFixArr(response);

                window.localStorage.setItem('Goals', JSON.stringify(response));
                window.localStorage.setItem('totalObjetivos', JSON.stringify(typeof response.data.totalCount !== 'undefined' ? response.data.totalCount : 0));
                state.goalsUpdated = true;
            });

            routes().get('?limit='+state.totalRutas).then(response => {
                
                state.vuexRoutes = state.valueFixArr(response);

                window.localStorage.setItem('Routes', JSON.stringify(response));
                window.localStorage.setItem('totalRutas', JSON.stringify(typeof response.data.totalCount !== 'undefined' ? response.data.totalCount : 0));
                state.routesUpdated = true;
            });

        },

        //HACE UPDATE AL MODULO RENTABILIDAD
        async SET_UPDATE_RENTABILIDAD(state){

            state.vuexIngresosVs = [];
            state.vuexFacturasVs = [];
            state.vuexIngresosComp = [false, false, true];
            state.vuexFacturasComp = [false, false, true];
            state.vuexComprasVsVentasComp = [false, false, true]
            
            let pastMonth = moment(w.test).locale('es').subtract(1, 'months').format('YYYY-MM');
            let thisMonth = moment(w.test).locale('es').format('YYYY-MM');

            invoices().get('/total?limit='+state.vuexInvoices.data.totalCount+'&after-fecha_at='+pastMonth+'-01&before-fecha_at='+thisMonth+'-01').then(response =>{
                
                let data = {
                    bolivares: typeof response.data.data !== 'undefined' ? response.data.data.subtotal : 0,
                    dolares: typeof response.data.data !== 'undefined' ? response.data.data.subtotal_dolar : 0,
                    mesActual: 0,
                };

                state.vuexIngresosVs.push(data);
                state.vuexIngresosComp[0] = true;
                state.vuexIngresosComp[2] = state.vuexIngresosComp.slice(0, 2).every(i => !i);

                if (!state.vuexIngresosComp[2]) 
                    window.localStorage.setItem('IngresosVs', JSON.stringify(state.vuexIngresosVs));
                
                state.ingresosVsUpdated = state.vuexIngresosComp[2];
            });

            invoices().get('/total?limit='+state.vuexInvoices.data.totalCount+'&after-fecha_at='+thisMonth+'-01').then(response =>{
                let data = {
                    bolivares: typeof response.data.data !== 'undefined' ? response.data.data.subtotal : 0,
                    dolares: typeof response.data.data !== 'undefined' ? response.data.data.subtotal_dolar : 0,
                    mesActual: 1,
                };

                state.vuexIngresosVs.push(data);
                state.vuexIngresosComp[1] = true;  
                state.vuexIngresosComp[2] = state.vuexIngresosComp.slice(0, 2).every(i => !i);
                
                if (!state.vuexIngresosComp[2]) 
                    window.localStorage.setItem('IngresosVs', JSON.stringify(state.vuexIngresosVs));
                
                state.ingresosVsUpdated = state.vuexIngresosComp[2];
            });

            invoices().get('/cantidad?limit='+state.vuexInvoices.data.totalCount+'&after-fecha_at=' + pastMonth + '-01&before-fecha_at='+thisMonth+'-01').then(response => {
                let data = {
                    cantidad: typeof response.data.count !== 'undefined' ? response.data.count : 0,
                    mesActual: 0,
                };

                state.vuexFacturasVs.push(data);
                state.vuexFacturasComp[0] = true;
                state.vuexFacturasComp[2] = state.vuexFacturasComp.slice(0, 2).every(i => !i);

                if (!state.vuexFacturasComp[2]) 
                    window.localStorage.setItem('FacturasVs', JSON.stringify(state.vuexFacturasVs));
                
                state.facturasVsUpdated = state.vuexFacturasComp[2];
            });

            invoices().get('/cantidad?limit=' + state.vuexInvoices.data.totalCount + '&after-fecha_at=' + thisMonth + '-01').then(response => {
                let data = {
                    cantidad: typeof response.data.count !== 'undefined' ? response.data.count : 0,
                    mesActual: 1,
                };

                state.vuexFacturasVs.push(data);
                state.vuexFacturasComp[1] = true;
                state.vuexFacturasComp[2] = state.vuexFacturasComp.slice(0, 2).every(i => !i);
                
                if (!state.vuexFacturasComp[2]) 
                    window.localStorage.setItem('FacturasVs', JSON.stringify(state.vuexFacturasVs));
            
                state.facturasVsUpdated = state.vuexFacturasComp[2];
            });

            compras().get('?limit=' + state.totalCompras).then(response => {
                
                response = state.valueFixArr(response);
                
                let data;
                try{
                    data = {
                        bolivares: Math.round(response.data.data.map(i => +i.subtotal).reduce((a, b) => a + b) * 100) / 100,
                        dolares: Math.round(response.data.data.map(i => +i.subtotal_dolar).reduce((a, b) => a + b) * 100) / 100,
                        compras: 1,
                    };
                }catch(e){
                    data = {
                        bolivares: 0,
                        dolares: 0,
                        compras: 1,
                    };
                }

                state.vuexComprasVsVentas.push(data);
                state.vuexComprasVsVentasComp[0] = true;
                state.vuexComprasVsVentasComp[2] = state.vuexComprasVsVentasComp.slice(0, 2).every(i => !i);

                if (!state.vuexComprasVsVentasComp[2]) 
                    window.localStorage.setItem('ComprasVsVentas', JSON.stringify(state.vuexComprasVsVentas));
            
                state.comprasVsVentasUpdated = state.vuexComprasVsVentasComp[2];
            });

        },

        // ACTIVA TODAS LAS BANDERAS LUEGO DE CARGAR LA DATA DEL CACHE
        RESTORE_FROM_CACHE(state) {
            state.restoredFromCache         = true;
            state.dashboardUpdated          = true;
            state.inventoryUpdated          = true;
            state.rankingUpdated            = true;
            state.buyersUpdated             = true;
            state.sellersUpdated            = true;
            state.goalsUpdated              = true;
            state.routesUpdated             = true;
            state.facturasVsUpdated         = true;
            state.ingresosVsUpdated         = true;
            state.comprasVsVentasUpdated    = true;
            state.vuexIngresosComp          = [true, true, false];
            state.vuexFacturasComp          = [true, true, false];
            state.vuexComprasVsVentasComp   = [true, true, false];
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
        },

        setConceptReturns({ commit },val ) {
            commit('SET_CONCEPT_RETURNS',val);
        },

        setGoals({ commit },val ) {
            commit('SET_GOALS',val);
        },

        setTotalObjetivos({ commit },val ) {
            commit('SET_TOTAL_GOALS',val);
        },

        setRoutes({ commit },val ) {
            commit('SET_ROUTES',val);
        },

        setTotalRutas({ commit },val ) {
            commit('SET_TOTAL_RUTAS',val);
        },

        setTotalCompras({ commit },val ) {
            commit('SET_TOTAL_COMPRAS',val);
        },

        setComprasVsVentas({ commit },val ) {
            commit('SET_COMPRAS',val);
        },

        setUpdateRentabilidad({ commit },val ) {
            commit('SET_UPDATE_RENTABILIDAD',val);
        },

        setFacturasVs({ commit },val ) {
            commit('SET_FACTURAS_VS',val);
        },

        setIngresosVs({ commit },val ) {
            commit('SET_INGRESOS_VS',val);
        },

    }
});
