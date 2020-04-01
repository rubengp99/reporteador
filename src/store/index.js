import Vue from "vue";
import Vuex from "vuex";

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
    }
});