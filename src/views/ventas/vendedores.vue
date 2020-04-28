<template>
    <v-col cols="12">
        <v-card class="mx-auto" max-width="100vw" style="padding: 15px 25px;" :outlined="loading">
        <v-card-title class="title" style="padding:5px;">
            <v-spacer></v-spacer>
            Vendedores de tu Empresa
            <v-spacer></v-spacer>
        </v-card-title>
        <v-row v-if="!loading">
            <masonry :cols="cols" style="width:100%;">
                <seller v-for="(seller, i) in vendedores.slice(offset, offset + itemsPerPage)" :key="seller.id" :style="'margin: 15px '+gutter/2+'px'" :i="i" :seller="seller"  @click.native="open(seller)"></seller>
            </masonry>
            <v-pagination
                v-model="page"
                :length="Math.ceil(vendedores.length / itemsPerPage)"
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
import accounting from "accounting";
import { mapState } from 'vuex';

export default {
    name: "vendedores",
    components: {
    },
    data: () => {
        return {
            ...variables,
            apiSellers: null,
            vendedores: [],
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
            this.apiSellers = this.vuexSellers;
            let totalSales = this.apiSellers.data.data.map(a => a.ventas).reduce((a,b) => a+b);
            this.apiSellers.data.data.forEach(seller => {
                this.vendedores.push({
                    id: seller.id,
                    name: seller.nombre,
                    sales: accounting.formatMoney(+Math.trunc(seller.ventas), { symbol   : "", thousand : ".", decimal  : ",", }),
                    gainsBs: accounting.formatMoney(+seller.venta_total, { symbol   : "Bs", thousand : ".", decimal  : ",", }),
                    gains$: accounting.formatMoney(+seller.venta_total_dolar, { symbol   : "$", thousand : ".", decimal  : ",", }),
                    percentSales: reports.chart__donut([seller.ventas, totalSales],"Volumen del",["Mis ventas","Total de Ventas"],["#FFC107", "#3f72af"],'volumen'),
                    expand: false,
                });
            });
            
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
        vuexSellers(){
            this.apiSellers = this.vuexSellers;
        },
        sellersUpdated(){
            this.createSellers();
        }
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