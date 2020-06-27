<template>
    <v-col cols="12">
        <v-card class="mx-auto" max-width="100vw" style="padding: 15px 25px;" :outlined="loading">
        <v-card-title class="title" style="padding:5px;">
            <v-spacer></v-spacer>
            Vendedores de tu Empresa
            <v-spacer></v-spacer>
        </v-card-title>
        <v-row>
            <v-col cols="12" sm="4">
                <v-autocomplete
                    :items="vendedores"
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
            <v-col cols="12" sm="3">
                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="100%" offset-overflow>
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            dense
                            v-model="dates.from"
                            label="Desde"
                            placeholder="Formato YYYY/MM/DD."
                            prepend-icon="event"
                            outlined
                            v-on="on"
                        ></v-text-field>
                    </template>

                    <v-date-picker v-model="dates.from" landscape show-current  header-color="#005598" color="#005598"  locale="es"/>
                </v-menu>
            </v-col>
            <v-col cols="12" sm="3">
                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="100%" offset-overflow>
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            dense
                            v-model="dates.to"
                            label="Hasta"
                            placeholder="Formato YYYY/MM/DD."
                            prepend-icon="event"
                            outlined
                            v-on="on"
                        ></v-text-field>
                    </template>

                    <v-date-picker v-model="dates.to" landscape show-current  header-color="#005598" color="#005598"  locale="es"/>
                </v-menu>
            </v-col>
            <v-col cols="12" sm="2">
                <v-btn small outlined color="indigo" style="width:100%; height: 39px;" @click="goSearch = !goSearch"><v-icon>check</v-icon></v-btn>
            </v-col>
        </v-row>

        <v-alert dark elevation="2" v-show="results" color="#2A3B4D" style="margin: 20px 0;">
            Este fue tu ranking de ventas desde el día 
            <strong> {{ moment(dates.from).locale('es').format('MMMM Do [de] YYYY') }} </strong> 
            hasta el día
            <strong> {{ moment(dates.to).locale('es').format('MMMM Do [de] YYYY') }} </strong>. 
        </v-alert>

        <v-row v-if="!loading">
            <masonry :cols="cols" style="width:100%;">
                <seller v-for="(seller, i) in vendedoresFilt.slice(offset, offset + itemsPerPage)" :key="seller.id" :style="'margin: 15px '+gutter/2+'px'" :i="i" :seller="seller"  @click.native="open(seller)"></seller>
            </masonry>
            <v-pagination
                v-model="page"
                :length="Math.ceil(vendedoresFilt.length / itemsPerPage)"
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
import sellers from "@/services/Vendedores";
import reports from "@/plugins/reports"
import accounting from "accounting";
import seller from "@/components/ventas/seller"
import { mapState } from 'vuex';
import _ from "lodash";
import moment from "moment";

export default {
    name: "vendedores",
    components: {
        seller,
    },
    data: () => {
        return {
            ...variables,
            apiSellers: null,
            vendedores: [],
            vendedoresFilt: [],
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
            dates: {
                from:  new Date().toISOString().substr(0, 10),
                to:  new Date().toISOString().substr(0, 10),
            },
            results: false,
        };
    },
    computed:{
        ...mapState(['vuexSellers','sellersUpdated']),
    },
    head: {
        title() {
            return {
                inner:'Reporteador',
                separator:'|',
                complement:'Vendedores'
            };
        }
    },
    methods:{
        open(openItem){
            this.vendedores.slice(this.offset, this.offset + this.itemsPerPage).forEach(seller => seller.expand = (openItem.id === seller.id && !openItem.expand));
        },
        paginate(page){
            if (page === 1) this.offset = 0;
            else if (page > this.page_old)
                this.offset += Math.abs(page - this.page_old) === 0 ? this.itemsPerPage : Math.abs(page - this.page_old) * this.itemsPerPage;
            else if (page < this.page_old)
                this.offset -= Math.abs(page - this.page_old) === 0 ? this.itemsPerPage : Math.abs(page - this.page_old) * this.itemsPerPage;
            this.page_old = page;
        },
        async createSellers(){
            try{
                this.apiSellers = this.vuexSellers;
                let totalSales = this.apiSellers.data.data.map(a => a.ventas).reduce((a,b) => a+b);
                this.apiSellers.data.data.forEach(seller => {
                    this.vendedores.push({
                        id: seller.id,
                        name: seller.nombre,
                        sales: accounting.formatMoney(+Math.trunc(seller.ventas), { symbol   : "", thousand : ".", decimal  : ",", }),
                        gainsBs: accounting.formatMoney(+seller.venta_total, { symbol   : "Bs", thousand : ".", decimal  : ",", }),
                        gains$: accounting.formatMoney(+seller.venta_total_dolar, { symbol   : "$", thousand : ".", decimal  : ",", }),
                        percentSales: reports.chart__donut([seller.ventas, totalSales],"Volumen del",["Mis ventas","Total de Ventas"],["#FFC107", "#3F51B5"],'volumen'),
                        expand: false,
                    });
                });

                this.vendedoresFilt = this.vendedores
            }catch(e){
                console.log('Error al crear vendedores. '+e)
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
        moment
    },
    watch:{
        vuexSellers(){
            this.apiSellers = this.vuexSellers;
        },
        sellersUpdated(){
            this.createSellers();
        },
        goSearch(){
            if (this.dates.to < this.dates.from){
                this.$toasted.error('El campo "Hasta" no puede ser menor al campo "Desde".', { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'error_outline'
                });
            }else {
                this.results = false;
                this.$toasted.info("Obteniendo registros...", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'timer'
                });

                let limit = this.vuexSellers.data.data.length;
                let after = moment(this.dates.from).format("YYYY-MM-DD");
                let before = moment(this.dates.to).format("YYYY-MM-DD");

                sellers().get(`/mostsellers?limit=${limit}&after-fecha_at=${after}&before-fecha_at=${before}`).then(response => {
                    if (typeof response.data.data !== 'undefined') {
                        let aux = [];
                        let totalSales = response.data.data.map(a => a.ventas).reduce((a,b) => a+b);
                        response.data.data.forEach(seller => {
                            aux.push({
                                id: seller.id,
                                name: seller.nombre,
                                sales: accounting.formatMoney(+Math.trunc(seller.ventas), { symbol   : "", thousand : ".", decimal  : ",", }),
                                gainsBs: accounting.formatMoney(+seller.venta_total, { symbol   : "Bs", thousand : ".", decimal  : ",", }),
                                gains$: accounting.formatMoney(+seller.venta_total_dolar, { symbol   : "$", thousand : ".", decimal  : ",", }),
                                percentSales: reports.chart__donut([seller.ventas, totalSales],"Volumen del",["Mis ventas","Total de Ventas"],["#FFC107", "#3F51B5"],'volumen'),
                                expand: false,
                            });
                        });

                        this.vendedoresFilt = aux;

                        this.$toasted.success("¡Ranking actualizado!", { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'done_all'
                        });

                        this.results = true;
                    }else {
                        this.$toasted.error('¡Que pena! No hay información para este rango de fechas.', { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'error_outline'
                        });
                    }
                    
                    this.$forceUpdate();
                });
            }
        },
        search:  _.debounce(async function () {
            if (this.search == "" || this.search == null) {
                this.vendedoresFilt = this.vendedores;
                return;
            } 
            //watch se activa cuando presionas enter en el text input de busqueda
            this.vendedoresFilt = this.vendedores.filter(i => i.name.toLowerCase().includes(this.search.toLowerCase()))
            
        }, 555),
    },
    created(){
        window.addEventListener('resize', this.onResize);
        this.onResize();
    },
    async beforeMount(){
        try {
            if(this.sellersUpdated){
                this.createSellers();
            }
        } catch (error) {
            this.$data.vendedores = [];
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
}
</script>