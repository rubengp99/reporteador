<template>
    <v-col cols="12" :sm="!hideTitle ? '12' : '4'">
        <v-row :style="!hideTitle ? 'margin:0;' : 'margin:-12px'" justify="center">
            <!-- Select de Monedas -->
            <v-col v-if="!hideTitle" cols="12" sm="5" style="padding:0">
                <v-card-title class="title"><span style="margin-left:auto;">Moneda</span></v-card-title>
            </v-col>
            <!-- Select de Monedas -->
            <v-col cols="12" :sm="!hideTitle ? '7' : '12'"   :style="!hideTitle ? 'text-align:left;' : ''">
                <v-select
                    v-model="$parent.$parent.moneda"
                    :items="$parent.$parent.monedas"
                    label="Moneda"
                    outlined
                    dense
                    style="height:39px;max-width:100%;"
                    menu-props="offset-y"
                ></v-select>
            </v-col>
        </v-row>
    </v-col>
</template>

<script>
export default {
    name: 'coinSelector',
    props:{
        hideTitle:{
            type: Boolean,
            default: false
        }
    }
}
</script>