<template>
    <v-col cols="12" :sm="!hideTitle ? '4' : '12'">
        <v-row :style="!hideTitle ? 'margin:0;' : 'margin:-12px'" justify="center">
            <!-- Select de Monedas -->
            <v-col v-if="!hideTitle" cols="12" sm="5" style="padding:0">
                <v-card-title class="title"><span style="margin-left:auto;">Lapso de Tiempo</span></v-card-title>
            </v-col>
            <!-- Select de Monedas -->
            <v-col cols="12" :sm="!hideTitle ? '7' : '12'"   :style="!hideTitle ? 'text-align:left;' : ''">
                <v-select
                    v-model="localRango"
                    :items="localRangos"
                    :loading="loading"
                    :disabled="loading"
                    label="Comparar"
                    outlined
                    dense
                    style="height:39px;min-width:100%;"
                    menu-props="offset-y"
                ></v-select>
            </v-col>
        </v-row>
    </v-col>
</template>

<script>
export default {
    name: 'timeLapseSelector',
    props:{
        rangos: {
            type: Array,
            default: () => []
        },
        rango: {
            type: String,
            default: "Mes",
        },
        hideTitle:{
            type: Boolean,
            default: false
        },
        isDate:{
            type: Boolean,
            default: false
        },
        loading:{
            type: Boolean,
            default: false
        }
    },
    computed: {
        localRangos: {
            get: function(){
                return this.$props.rangos;
            },
            set: function(newValue){
                this.$emit('update:rangos', newValue)
            }   
        },
        localRango: {
            get: function(){
                return this.$props.rango;
            },
            set: function(newValue){
                this.$emit('update:rango', newValue)
            }   
        },
    }
}
</script>