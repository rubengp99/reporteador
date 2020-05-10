<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="800px">
            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-center">Más detalles</th>
                            <th class="text-center">Código</th>
                            <th class="text-center">Nombre</th>
                            <th class="text-center">Grupo</th>
                            <th class="text-center">Subgrupo</th>
                            <th class="text-center">Existencia {{existencia}}</th>
                            <th class="text-center">Existencia Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in concepts" :key="item.id">
                            <td>{{ item.name }}</td>
                            <td>{{ item.calories }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        
        </v-dialog>
    </v-row>
</template>


<script>
import inventario from '@/plugins/inventario/inventario';
import watchers  from '@/plugins/inventario/watchers';

export default {

    props: {
        concepts: Array,
        loading:{
            type:Boolean,
            default: false,
        },
        existencia:{
            type:String,
            default: '',
        }
    },
    data() {
        return {

        };
    },
    methods:{
        ...inventario,
        getExistencias(concept){
            return (Array.isArray(concept.existencias) ? concept.existencias.length > 0 ? concept.existencias.map(a => Math.trunc(+a.existencia)).reduce((a,b) => a+b) : 0 : concept.existencias);
        }
    },
    watch:{
        ...watchers,
    },
    created(){
        
    }
};
</script>