import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading:[false,false,false,false,false,false],
  },
  mutations: {
    CHANGE(state,val){
      if(val.value){
        state.loading[val.id] = true;
      }else{
        state.loading[val.id] = false;
      }
    }
  },
  actions: {
    change({commit},val){
      commit('CHANGE',val);
    }
  },
  modules: {
  },
  getters: {
    getStatebyIndex: state => id => {
      return state.loading[id];
    }
  }
})
