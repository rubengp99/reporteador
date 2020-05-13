<template>
    <v-row justify="center" >
        <v-dialog v-if="show" v-model="show" fullscreen content-class="overflow-x-hidden stock" style="position:relative!important;">
            <slot name="close" style="z-index:3"></slot>
            <stock :title="`Conceptos con Existencia ${existencia}`" :isExistencia="isExistencia" :headers="headers" :concepts="concepts"/> 
        </v-dialog>
    </v-row>
</template>


<script>
import stock from "@/components/inventario/stock"
import inventarioData from '@/plugins/inventario/data';
import { mapState } from 'vuex';

export default {
    components:{
        stock
    },
    props: {
        concepts: Array,
        show:{
            type:Boolean,
            default: false,
        },
        existencia:{
            type:String,
            default: '',
        },
        isExistencia:{
            type: Boolean,
            default:true,
        }
    },
    data() {
        return {
            ...inventarioData,
            headers:[],
        };
    },
    computed:{
        ...mapState(['vuexConceptReturns','vuexConcepts','vuexConceptSales','vuexInvoices','vuexGroups','vuexSubGroups','vuexWeeklySales','inventoryUpdated']),
    },
    created(){
        this.loading = true;
    },
    async beforeMount(){
        this.headers = [
            { text: "Más Detalles", align: "center", sortable: false, value: "image" },
            { text: "Código", align: "center", value: "codigo", sortable: false, },
            { text: "Producto", align: "center", value: "name", sortable: false, },
            { text: "Grupo", align: "center", value: "category.name", sortable: false, },
            { text: "Sub-Grupo", align: "center", value: "subCategory.name", sortable: false, },
            { text: 'Existencia '+this.$props.existencia, align: "center", value: this.$props.existencia === 'Mínima' ? 'stockMin' : 'stockMax', sortable: false, },
            { text: "Existencia", align: "center", value: "stock", sortable: false, },            
        ];


    },
};
</script>