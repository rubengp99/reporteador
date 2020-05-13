<template>
    <div class="home">
        <div class="charts">
            <v-row data-app style="padding:0 2.5vw;">
                <v-col cols="12">
                    <stock title="Análisis de Inventario"></stock>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import stock from "@/components/inventario/stock"
import expandibles from '@/plugins/inventario/expandibles';
import inventario from '@/plugins/inventario/inventario';
import inventarioData from '@/plugins/inventario/data'

export default {
    name: "inventario",
    components: {
        stock
    },
    head: {
        title: {
            inner: 'Reporteador',
            separator: '|',
            complement: 'Inventario'
        },
    },
    data() {
        return {
            ...inventarioData,
            dialog: false,
        };
    },
    methods: {
        //VISTA LA CARPETA @/PLUGINS/INVENTARIO
        ...expandibles,
        ...inventario,
    },
     
};
</script>
