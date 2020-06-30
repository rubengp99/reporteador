<template>

    <v-card width="100%" class="storages" :outlined="loading" style="background:#fdfdfd;">
        <v-spacer v-show="loading"></v-spacer>
        <loader v-show="loading" class="absolute-center" />
        <v-spacer v-show="loading"></v-spacer>
        <v-row v-show="!loading" align="center" justify="center">
            <p class="title" style="margin: 5px auto;">Valor de Depósitos</p>
        </v-row>
        <v-row v-show="!loading" class="storage" align="center" justify="center">
            <v-simple-table fixed-header height="300px" style="width:100%; padding: 0 25px;">
                <template v-slot:default>
                    <thead>
                        <tr>
                        <th class="text-center">Depósito</th>
                        <th class="text-center">Nº</th>
                        <th class="text-center">Unidades</th>
                        <th class="text-center">Bolívares</th>
                        <th class="text-center">Dólares</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="object in objects" :key="object.id">

                        <td>
                            <p class="subtitle-2">
                                <v-row>
                                    <v-col>
                                        <v-img :src="require('@/assets/storage.svg')" style="width:50px;height:50x;"></v-img>  
                                    </v-col>
                                </v-row>
                            </p>
                        </td>
                        <td>
                            <p class="subtitle-2">
                                {{ typeof object.id !== 'undefined' ? object.id : '' }}
                            </p>
                        </td>
                        <td><p class="subtitle-2"> {{ typeof object.count !== 'undefined' ? object.count : '' }} </p></td>
                        <td><p class="subtitle-2"> {{ typeof object.Bs !== 'undefined' ? object.Bs : '' }} </p></td>
                        <td><p class="subtitle-2"> {{ typeof object.$ !== 'undefined' ? object.$ : '' }} </p></td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-row>
    </v-card>
</template>

<script>
import loader from "@/components/aplicacion/loading"

export default {
    name: "dTable",
    components: {
        loader: loader,
    },
    props: {
        objects: Array,
        loading:{
            type:Boolean,
            default: false,
        }
    },
    data() {
        return {};
    },
    beforeMount() {}
};
</script>

<style lang="scss">
.storages {
    position: relative;
    padding: 10px 0px;
    overflow: hidden;

    @media (max-width: 1024px) {
        min-height: 300px;
    }

    @media (min-width: 1024px) {
        height: 100%;
    }
}

.storages p {
     margin: 0;
}

.storages > .storage:not(:last-child) {
    border-bottom: 1px solid rgba($color: #0d0d0d, $alpha: 0.12);
}

.absC {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(0%, -50%);
}
</style>