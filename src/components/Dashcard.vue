<template>
    <v-col cols="12" :sm="col === '6' || last ? '12' : '6'" :md="col">
        <v-scale-transition v-if="!loading">
            <v-card :class="cssClass" width="100%" :to="path">
                <v-list-item three-line>
                    <v-list-item-content>
                    <div class="overline mb-1">{{'Hoy, '+ hoy}}</div>
                    <v-list-item-title class="headline mb-1" style="white-space: normal;">{{title}}</v-list-item-title>
                    <v-list-item-subtitle class="subtitle-1" style="line-height: 1.15rem;">{{text}}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-avatar v-if="icon" tile size="80" color="none">
                        <img :src="require('@/assets/'+img+'.svg')" />
                    </v-list-item-avatar>
                </v-list-item>
            </v-card>
        </v-scale-transition>
        <v-card v-else class="mx-auto" width="100%" outlined>
            <br>
            <loader/>
            <br>
            <div class="snake"></div>
        </v-card>    
    </v-col>
</template>

<script>
import loader from '../components/loading'
import moment from 'moment';

export default {
    name:'dCard',
    components:{
        loader: loader,
    },
    props: {
        col: [String, Number],
        icon:{
            type:Boolean,
            default:false
        },
        img:{
            type: String,
            default: 'box'
        },
        title:{
            type: [String, Number],
            default: ''
        },
        text:{
            type: String,
            default: ''
        },
        hoverable:{
            type:Boolean,
            default:false
        },
        path:{
            type:String,
            default:''
        },
        last:{
            type:Boolean,
            default:false
        },
        loading:{
            type:Boolean,
            default:false
        },
    },
    data (){
        return{
            cssClass: '',
            hoy: '',
        }
    },
    watch:{
        title: function(val){
            val > 0 ? this.cssClass.replace('loading','') : NaN
        } 
    },
    beforeMount(){
        this.$data.cssClass = (this.$props.hoverable) ? 'mx-auto fill hoverable' : 'mx-auto fill ';
        this.$data.cssClass += (this.$props.title === 0) ? 'loading' : '';
        this.hoy = moment().locale('es').format('MMM Do YYYY').charAt(0).toUpperCase() + moment().locale('es').format('MMM Do YYYY').slice(1,14);
    }
}
</script>

<style lang="scss">
.hoverable{
    cursor: pointer;
}

.hoverable:hover{
    background: #ECEFF1!important;
}

$stroke: linear-gradient(to right top, #4527a0, #402da0, #3c32a1, #3836a0, #343aa0, #3142a6, #2e4aac, #2c51b1, #295fbf, #256ccc, #217ad9, #1e88e5);
$surrounding: white;
$width:null;
$height: null;
$square-size: 50px;
$stroke-size: 2px;
$size:null;
$fraction:null;

.mx-auto{
    .loading{
        animation: snake 1s linear 1 infinite;
        $width: 100% !global;
        $height: 100% !global;
        $size: calc($width + $height) + $stroke-size !global;
        $fraction: $stroke-size / $size !global;
    }
}

@keyframes snake {
  0% {
    box-shadow:
    square(0,-1),
    square(-1,0),
    square(0,1),
    square(1,0),
    square(0,0,$stroke);
  }
  25% {
    box-shadow:
    square(-1 - $fraction,-1),
    square(-1,0),
    square(0,1),
    square(1,0),
    square(0,0,$stroke);
  }
  50% {
    box-shadow:
    square(-1 - $fraction,-1),
    square(-1,1 + $fraction),
    square(0,1),
    square(1,0),
    square(0,0,$stroke);
  }
  75% {
    box-shadow:
    square(-1 - $fraction,-1),
    square(-1,1 + $fraction),
    square(1 + $fraction,1),
    square(1,0),
    square(0,0,$stroke);
  }
  100% {
    box-shadow:
    square(-1 - $fraction,-1),
    square(-1,1 + $fraction),
    square(1 + $fraction,1),
    square(1,-1 - $fraction),
    square(0,0,$stroke);
  }
}

.fill{
    position: relative;
    height: 100%;
}
</style>