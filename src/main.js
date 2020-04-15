import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import router from './router'
import ApexCharts from 'vue-apexcharts/src/ApexCharts.component'
//import FusionChart from 'vue-fusioncharts/src/vue-fusioncharts-component';
import VueFusionCharts from 'vue-fusioncharts';
import FusionCharts from 'fusioncharts';
import Maps from 'fusioncharts/fusioncharts.maps';
import World from 'fusioncharts/maps/fusioncharts.world';
import vueheader from 'vue-head';
import Toasted from 'vue-toasted';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import loader from '@/components/aplicacion/loading.vue';
import Auth from '@/services/auth';
import './assets/css/styles.scss';

let token = window.localStorage.getItem('token');
// register VueFusionCharts component
Vue.use(VueFusionCharts, FusionCharts, Maps, World, FusionTheme)
Vue.use(vueheader);
Vue.use(Toasted);
Vue.component('apexchart', ApexCharts);
Vue.component('loader',loader);
Vue.use(router);

Vue.config.productionTip = false

Auth().post("/sesion",{token:token}).then((response) => {
    store.state.user.data = response.data.data;
    store.state.user.loggedIn = true;
    store.state.user.token = token;
    new Vue({
        vuetify,
        store,
        router,
        render: h => h(App)
    }).$mount('#app')

}).catch(() => {
    new Vue({
        vuetify,
        store,
        router,
        render: h => h(App)
    }).$mount('#app')
});