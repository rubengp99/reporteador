<template>
     <v-col cols="12">
        <v-card v-if="loading" class="mx-auto" max-width="100vw" style="padding: 15px 25px;" :outlined="loading">
            <v-spacer></v-spacer>
            <loader />
            <v-spacer></v-spacer>
        </v-card>

        <v-card v-else class="mx-auto" max-width="100vw" style="padding: 15px 25px;" :outlined="loading">
            <v-card-title class="title" style="padding:5px;">
                <v-spacer></v-spacer>
                Clientes de tu Empresa
                <v-spacer></v-spacer>
            </v-card-title>
            <v-row>
                <v-col cols="12" sm="4">
                    <v-autocomplete
                        :items="compradores"
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
                Este fue tu ranking de clientes desde el día 
                <strong> {{ moment(dates.from).locale('es').format('MMMM Do [de] YYYY') }} </strong> 
                hasta el día
                <strong> {{ moment(dates.to).locale('es').format('MMMM Do [de] YYYY') }} </strong>. 
            </v-alert>

            <v-row v-if="!loading">
                <masonry :cols="cols" style="width:100%;">
                    <buyer v-for="(buyer, i) in compradoresFilt.slice(offset, offset + itemsPerPage)" :key="buyer.id" :style="'margin: 15px '+gutter/2+'px'" :buyer="buyer" :i="i" :offset="offset" @click.native="open(buyer)"></buyer>
                </masonry>
                <v-pagination
                v-model="page"
                :length="Math.ceil(compradoresFilt.length / itemsPerPage)"
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
import buyers from "@/services/Clientes";
import reports from "@/plugins/reports";
import buyer from '@/components/ventas/buyer';
import accounting from "accounting";
import { mapState } from 'vuex';
import _ from "lodash";
import moment from "moment";

export default {
    name: "compradores",
    components: {
        buyer: buyer
    },
    data: () => {
        return {
            ...variables,
            apiBuyers: null,
            compradores: [],
            compradoresFilt: [],
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
        ...mapState(['vuexBuyers','buyersUpdated']),
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
            this.compradores.slice(this.offset, this.offset + this.itemsPerPage).forEach(buyer => buyer.expand = (openItem.id === buyer.id && !openItem.expand));
        },
        paginate(page){
            if (page === 1) this.offset = 0;
            else if (page > this.page_old)
                this.offset += Math.abs(page - this.page_old) === 0 ? this.itemsPerPage : Math.abs(page - this.page_old) * this.itemsPerPage;
            else if (page < this.page_old)
                this.offset -= Math.abs(page - this.page_old) === 0 ? this.itemsPerPage : Math.abs(page - this.page_old) * this.itemsPerPage;
            this.page_old = page;
        },
        createBuyers: _.debounce(async function(){
            try {
                this.compradores = [];

                this.$data.loading = true;
                this.apiBuyers = this.vuexBuyers;

                let totalBuys = this.apiBuyers.data.data.map(a => a.compras).reduce((a,b) => a+b);
                this.apiBuyers.data.data.forEach(buyer => {
                    this.compradores.push({
                        id: buyer.id,
                        name: buyer.nombre,
                        sales: accounting.formatMoney(+Math.trunc(buyer.compras), { symbol   : "", thousand : ".", decimal  : ",", }),
                        buysBs: accounting.formatMoney(+buyer.total, { symbol   : "Bs", thousand : ".", decimal  : ",", }),
                        buys$: accounting.formatMoney(+buyer.totalDolar, { symbol   : "$", thousand : ".", decimal  : ",", }),
                        percentBuys: reports.chart__donut([buyer.compras, totalBuys],"Volumen del",["Mis compras","Total de Compras"],["#FFC107", "#3F51B5"],'volumen'),
                        expand: false,
                    });
                });

                this.compradoresFilt = this.compradores.filter(i => i.name.contains(this.search));
                this.loading = (this.compradores.length === 0);
            } catch (e) {
                this.$toasted.error('Error al crear clientes. '+e,{ 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 5000,
                    icon : 'error_outline'
                })
            }
           
        }, 555),
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
        vuexBuyers(){
            this.apiBuyers = this.vuexBuyers;
            this.compradores = [];
            this.createBuyers();
            this.$forceUpdate();
        },
        buyersUpdated(){
            this.createBuyers();
            this.$forceUpdate();
        },
        goSearch(){
            this.loading = true;
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

                let limit = this.vuexBuyers.data.count;
                let after = moment(this.dates.from).format("YYYY-MM-DD");
                let before = moment(this.dates.to).format("YYYY-MM-DD");

                buyers().get(`/mostBuyers?limit=${limit}&after-fecha_at=${after}&before-fecha_at=${before}`).then(response => {
                    if (typeof response.data.data !== 'undefined') {
                        this.loading = true
                        let aux = [];
                        let totalBuys = response.data.data.map(a => a.compras).reduce((a,b) => a+b);
                        
                        response.data.data.forEach(buyer => {
                            aux.push({
                                id: buyer.id,
                                name: buyer.nombre,
                                sales: accounting.formatMoney(+Math.trunc(buyer.compras), { symbol   : "", thousand : ".", decimal  : ",", }),
                                buysBs: accounting.formatMoney(+buyer.total, { symbol   : "Bs", thousand : ".", decimal  : ",", }),
                                buys$: accounting.formatMoney(+buyer.totalDolar, { symbol   : "$", thousand : ".", decimal  : ",", }),
                                percentBuys: reports.chart__donut([buyer.compras, totalBuys],"Volumen del",["Mis compras","Total de Compras"],["#FFC107", "#3F51B5"],'volumen'),
                                expand: false,
                            });
                        });

                        this.compradoresFilt = aux.filter(i => i.name.contains(this.search));

                        this.$toasted.success("¡Ranking actualizado!", { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'done_all'
                        });

                        this.results = (aux.length > 0);
                        this.loading = false;
                    }else {
                        this.$toasted.error('¡Que pena! No hay información para este rango de fechas.', { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'error_outline'
                        });
                        this.createBuyers();
                    }
                    
                    this.$forceUpdate();
                });
            }
        },
        search:  _.debounce(async function () {
            if (this.search == "" || this.search == null) {
                this.compradoresFilt = this.compradores;
                return;
            } 
            //watch se activa cuando presionas enter en el text input de busqueda
            this.compradoresFilt = this.compradores.filter(i => i.name.toLowerCase().includes(this.search.toLowerCase()))
            
        }, 555),
    },
    created(){
        window.addEventListener('resize', this.onResize);
        this.onResize();
    },
    async beforeMount(){
        try {
            if(this.buyersUpdated){
                this.createBuyers();
            }
        } catch (error) {
            this.$data.compradores = [];
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
}
</script>