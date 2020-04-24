<template>
  <v-list-item style="padding: 0 10px 0 0;" class="border-b">
    <v-list-item-icon
      style="margin: auto 10px!important;padding: 10px!important;border-right: thin solid rgba(0, 0, 0, 0.12)!important;"
    >
      <v-img :src="require('@/assets/goal.svg')" width="55px"></v-img>
    </v-list-item-icon>
    <v-list-item-content>
      <v-row>
        <v-col cols="4" class="border-l">
          <v-list-item-title class="subtitle-1">
            <span class="bold">Completado</span>
          </v-list-item-title>
          <v-progress-linear stream color="#01579b" :buffer-value="meta" height="20" :value="progreso" class="mt-2 subtitle-2 bold" reactive>
                <template v-slot="{ value }">
                    <span class="mask" :style="'background:'+'linear-gradient(to right, #F5F5F5 ' +percent+'%, #0D0D0D '+ percent+'%);'">{{value +'%'}}</span>
                 </template>
          </v-progress-linear>
        </v-col>
        <v-col cols="2" class="border-l">
          <v-list-item-title class="subtitle-1">
            <span class="bold">Fecha límite</span>
          </v-list-item-title>
          <v-list-item-title class="body-2 mt-2">
            <span>{{ fecha }}</span>
          </v-list-item-title>
        </v-col>
        <v-col cols="2" class="border-l">
          <v-list-item-title class="subtitle-1">
            <span class="bold">Asignado a</span>
          </v-list-item-title>
          <v-list-item-title class="body-2 mt-2">
            <span>{{ responsable }}</span>
          </v-list-item-title>
        </v-col>
        <v-col cols="2" class="border-l">
          <v-list-item-title class="subtitle-1">
            <span class="bold">Meta</span>
          </v-list-item-title>
          <v-list-item-title class="body-2 mt-2">
            <span>{{ format(meta) }} {{tipo}}.</span>
          </v-list-item-title>
        </v-col>
        <v-col cols="2" class="border-l">
          <v-list-item-title class="subtitle-1">
            <span class="bold">Acciones</span>
          </v-list-item-title>
          <v-row class="mt-2">
            <v-col cols="6" style="padding:0 5px;">
              <v-btn small outlined dense color="green" style="width:80%">
                <v-icon>done_all</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6" style="padding:0 5px">
              <v-btn small outlined dense color="red" style="width:80%">
                <v-icon>close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import accounting from "accounting";

export default {
    name:'goal',
    props:{
        id:{
            type: Number,
            default: 0
        },
        responsable:{
            type: String,
            default: '',
        },
        meta:{
            type: [ Number, String],
            default: 0,
        },
        progreso:{
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
    created(){
        this.progreso *=100;
        this.progreso = Math.trunc(this.progreso);
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
                case '54':
                    this.percent = 110;
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
}

.border-b:not(:last-child) {
  border-color: rgba(0, 0, 0, 0.12) !important;
  border: solid;
  border-width: 0 0 thin 0;
}

.mask{
   -webkit-background-clip: text!important;  
   background-clip: text!important;
   color: transparent!important;
}

</style>