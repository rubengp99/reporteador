<template>
     <v-col cols="12">
        <v-card class="mx-auto" max-width="100vw" style="padding: 15px 25px;" :outlined="loading">
            <v-card-title class="title" style="padding:5px;">
                <v-spacer></v-spacer>
                Clientes de tu Empresa
                <v-spacer></v-spacer>
            </v-card-title>
            <v-row v-if="!loading">
                <masonry :cols="cols" style="width:100%;">
                    <buyer v-for="(buyer, i) in compradores.slice(offset, offset + itemsPerPage)" :key="buyer.id" :style="'margin: 15px '+gutter/2+'px'" :buyer="buyer" :i="i" :offset="offset" @click.native="open(buyer)"></buyer>
                </masonry>
                <v-pagination
                v-model="page"
                :length="Math.ceil(compradores.length / itemsPerPage)"
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
import reports from "@/plugins/reports"
import buyer from '@/components/ventas/buyer'
import accounting from "accounting";
import { mapState } from 'vuex';

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
            loading: true,
            promedioVentas: null,
            cols: 0,
            gutter: 0,
            page:1,
            page_old: 1,
            offset: 0,
            itemsPerPage: 12,  
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
        async createBuyers(){
            try {
                this.$data.loading = true;
                this.apiBuyers = this.vuexBuyers;
                let totalBuys = this.apiBuyers.data.response.data.map(a => a.compras).reduce((a,b) => a+b);
                this.apiBuyers.data.response.data.forEach(buyer => {
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
            } catch (e) {
                console.log('Error al crear clientes. '+e)
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
        vuexBuyers(){
            this.apiBuyers = this.vuexBuyers;
            this.compradores = [];
            this.createBuyers();
        },
        buyersUpdated(){
            this.createBuyers();
        }
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