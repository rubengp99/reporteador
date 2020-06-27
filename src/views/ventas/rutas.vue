<template>
    <v-col cols="12">
        <v-card class="mx-auto" max-width="100vw" style="padding: 15px 25px;" :outlined="loading">
        <v-card-title class="title" style="padding:5px;">
            <v-spacer></v-spacer>
            Rutas de Servicio
            <v-spacer></v-spacer>
        </v-card-title>
        <v-col cols="12" sm="4">
            <v-autocomplete
                :items="rutas"
                :search-input.sync="search"
                hide-no-data
                hide-selected
                item-text="name"
                item-value="name"
                return-object
                :append-icon="search === '' ? 'search' : 'close'"
                label="Nombre"
                outlined
                hide-details
                dense
                :disabled="loading"
                style="height:39px;"
                @keypress.enter="goSearch = !goSearch"
                @click:append="search = ''"
                @change="goSearch = !goSearch"
            ></v-autocomplete>               
        </v-col>
        <v-row v-if="!loading">
            <masonry :cols="cols" style="width:100%;">
                <route v-for="(route) in rutasFilt.slice(offset, offset + itemsPerPage)" :key="route.id" :style="'margin: 15px '+gutter/2+'px'" :route="route"></route>
            </masonry>
            <v-pagination
                v-model="page"
                :length="Math.ceil(rutasFilt.length / itemsPerPage)"
                v-on:click.native="paginate(page)"
            ></v-pagination>
        </v-row>
        <div v-else class="mx-auto" width="100%" outlined>
            <br />
            <loader />
            <br />
            <div class="snake"></div>
        </div>
        </v-card>
    </v-col>
</template>

<script>
import variables from "@/services/variables";
import accounting from "accounting";
import route from "@/components/ventas/route"
import { mapState } from 'vuex';
import _ from "lodash";

export default {
    name: "rutas",
    components: {
        route,
    },
    data: () => {
        return {
            ...variables,
            apiRoutes: null,
            rutas: [],
            rutasFilt: [],
            loading: true,
            promedioVentas: null,
            cols: 0,
            gutter: 0,
            page:1,
            page_old: 1,
            offset: 0,
            itemsPerPage: 12,
            search: "",
            goSearch: false,
        };
    },
    computed:{
        ...mapState(['vuexRoutes','routesUpdated']),
    },
    head: {
        title() {
            return {
                inner:'Reporteador',
                separator:'|',
                complement:'Rutas'
            };
        }
    },
    methods:{
        paginate(page){
            if (page === 1) this.offset = 0;
            else if (page > this.page_old)
                this.offset += Math.abs(page - this.page_old) === 0 ? this.itemsPerPage : Math.abs(page - this.page_old) * this.itemsPerPage;
            else if (page < this.page_old)
                this.offset -= Math.abs(page - this.page_old) === 0 ? this.itemsPerPage : Math.abs(page - this.page_old) * this.itemsPerPage;
            this.page_old = page;
        },
        async createRoutes(){
            try {
                this.$data.loading = true;
                this.apiRoutes = this.vuexRoutes;
                this.apiRoutes.data.data.forEach(route => {
                    this.rutas.push({
                        id: route.id,
                        name: route.descripcion,
                        value: accounting.formatMoney(route.tarifa, { symbol   : "Bs", thousand : ".", decimal  : ",", }),
                    });
                });

                this.rutasFilt = this.rutas;
            } catch (e) {
                console.log('Error al crear rutas de ventas. '+ e)
            }
            
            this.$data.loading = false;
        },
        onResize() {
            if (window.innerWidth > 957){
                this.cols = 3;
                this.gutter = 20;
            }else if (window.innerWidth < 957 && window.innerWidth > 500) {
                this.cols = 2;
                this.gutter = 10;
            }else {
                this.cols = 1;
                this.gutter = 2;
            }
        },
    },
    watch:{
        vuexRoutes(){
            this.apiRoutes = this.vuexRoutes;
            this.rutas = [];
            this.createRoutes();
        },
        routesUpdated(){
            this.createRoutes();
        },
        search:  _.debounce(async function () {
            if (this.search == "" || this.search == null) {
                this.rutasFilt = this.rutas;
                return;
            } 
            //watch se activa cuando presionas enter en el text input de busqueda
            this.rutasFilt = this.rutas.filter(i => i.name.toLowerCase().includes(this.search.toLowerCase()))
            
        }, 555),
    },
    created(){
        window.addEventListener('resize', this.onResize);
        this.onResize();
    },
    async beforeMount(){
        try {
            if(this.routesUpdated){
                this.createRoutes();
            }
        } catch (error) {
            this.$data.rutas = [];
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
}
</script>