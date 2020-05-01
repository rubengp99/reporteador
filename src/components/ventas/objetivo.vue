<template>
    <v-scroll-y-transition mode="out-in">
        <v-list-item style="padding: 0 10px 0 0;" class="border-b">
            <v-list-item-icon
                class="d-none d-sm-none d-md-flex"
                style="margin: auto 10px!important;padding: 10px!important;border-right: thin solid rgba(0, 0, 0, 0.12)!important;"
            >
                <v-img :src="require('@/assets/goal.svg')" width="55px"></v-img>
            </v-list-item-icon>
            <v-list-item-content>
                <v-row>
                    <v-col cols=12 style="text-align:center;">
                        <v-img :src="require('@/assets/goal.svg')" class="d-flex d-md-none" width="75px" style="margin:auto;"></v-img>
                    </v-col>
                    <v-col cols=12 md="4" class="border-l">
                        <v-list-item-title class="subtitle-1">
                            <span class="bold">Completado</span>
                        </v-list-item-title>
                        <v-progress-linear color="#01579b" :buffer-value="meta" height="20" :value="progreso" class="mt-2 subtitle-2 bold" reactive>
                            <template v-slot="{ value }">
                                <span class="mask" :style="'background:'+'linear-gradient(to right, #F5F5F5 ' +percent+'%, #0D0D0D '+ percent+'%);'">{{value +'%'}}</span>
                            </template>
                        </v-progress-linear>
                    </v-col>
                    <v-col cols=12 md="2" class="border-l">
                        <v-list-item-title class="subtitle-1">
                            <span class="bold">Fecha límite</span>
                        </v-list-item-title>
                        <v-list-item-title class="body-2 mt-2">
                            <span class="text-capitalize">{{ limiteMoment }}</span>
                        </v-list-item-title>
                    </v-col>
                    <v-col cols=6 md="2" class="border-l">
                        <v-list-item-title class="subtitle-1">
                            <span class="bold">Asignado a</span>
                        </v-list-item-title>
                        <v-list-item-title class="body-2 mt-2">
                            <span>{{ responsable === 0 ? 'Empresa' : vuexSellers.data.data.find(i => i.id === responsable).nombre }}</span>
                        </v-list-item-title>
                    </v-col>
                    <v-col cols=6 md="2" class="border-l">
                        <v-list-item-title class="subtitle-1">
                            <span class="bold">Meta</span>
                        </v-list-item-title>
                        <v-list-item-title class="body-2 mt-2">
                            <span>{{ format(meta) }} {{ tipo.toLowerCase() }}.</span>
                        </v-list-item-title>
                    </v-col>
                    <v-col cols="12" md="2" class="border-l">
                        <v-list-item-title class="subtitle-1">
                            <span class="bold">Acciones</span>
                        </v-list-item-title>
                        <slot name="actions"></slot>
                    </v-col>
                </v-row>
            </v-list-item-content>
        </v-list-item>
    </v-scroll-y-transition>
</template>

<script>
import accounting from "accounting";
import moment from 'moment';
import { mapState } from 'vuex';

export default {
    name:'goal',
    props:{
        id:{
            type: Number,
            default: 0
        },
        responsable:{
            type: [Number, String],
            default: '',
        },
        meta:{
            type: [Number, String],
            default: 0,
        },
        progresoMeta:{
            type: Number,
            default: 0,
        },
        fecha:{
            type: String,
            default: '',
        },
        tipo:{
            type: [String,Number],
            default:''
        },
        moneda:{
            type:String,
            default:'$',
        }
    },
    data(){
        return{
            cssClass:'',
            percent:100,
        }
    },
    methods:{
        format(val){
            switch (this.tipo.toLowerCase()) {
                case 'ingresos':
                    return accounting.formatMoney(val,{symbol:this.moneda,thousand:'.',decimal:','});
                default:
                    return accounting.formatMoney(val,{symbol:'',thousand:'.',decimal:','}).split(',')[0];
            }
        }
    },
    computed:{
        ...mapState(['vuexSellers']),
        progreso(){
            return Math.trunc(this.progresoMeta * 100);
        },
        limiteMoment(){
            return moment(this.fecha).locale('es').format("MMM Do YYYY") !== moment().locale('es').format("MMM Do YYYY") ? 
                moment(this.fecha).locale('es').format("MMM Do YYYY") :
                moment(this.fecha).locale('es').calendar(); 
        }
    },
    beforeMount(){
        if(this.progreso >= 47){
            switch (this.progreso.toString()) {
                case '47':
                    this.percent = 10;
                    break;
                case '48':
                    this.percent = 25;
                    break;
                case '49':
                    this.percent = 40;
                    break;
                case '50':
                    this.percent = 45;
                    break;
                case '51':
                    this.percent = 55;
                    break;
                case '52':
                    this.percent = 70;
                    break;
                case '53':
                    this.percent = 90;
                    break;
                default:
                    this.percent = 110;
                    break;
            }
        }else{
            this.percent = 0;
        }
        
    }

};
</script>

<style lang="scss">
.border-l {
    border-color: rgba(0, 0, 0, 0.12) !important;
    border: solid;
    border-width: 0 thin 0 0;
    @media only screen and (max-width:600px){
        border-width: 0 thin thin 0;
    }
}

.border-b:not(:last-child) {
    border-color: rgba(0, 0, 0, 0.12) !important;
    border: solid;
    border-width: 0 0 thin 0;
    @media only screen and (max-width:600px){
        border-width: 0;
    }
}

.mask{
    -webkit-background-clip: text!important;
    -moz--background-clip: text!important;
    -o-background-clip: text!important;      
    background-clip: text!important;
    color: transparent!important;
}

.v-progress-linear__buffer {
    height: inherit;
    left: 0;
    position: absolute;
    top: 0;
    -webkit-transition: inherit;
    transition: inherit;
    width: 100%!important;
    z-index: 1;
}

.v-progress-linear__background{
    width: 100%!important;
}

</style>