<template>
    <v-col cols="12" :sm="col === '6' || last ? '12' : '6'" :md="col === '4' ? '4' : '6'" :lg="col === '4' ?  '4' : col === '3' ? '3' : '6'">
        <v-scale-transition v-if="!loading">
            <v-card :class="cssClass" width="100%" height="100%" :to="path" style="background:#fdfdfd;" active-class="active" >
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
import loader from '@/components/aplicacion/loading';
import moment from 'moment';
import w from '@/services/variables';

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
            val > 0 ? this.cssClass.replace('loading','') : NaN;
        },
        
    },
    beforeMount(){
        this.$data.cssClass = (this.$props.hoverable) ? 'mx-auto fill hoverable ' : 'mx-auto fill ';
        this.$data.cssClass += (this.$props.title === 0) ? 'loading' : '';
        this.hoy = moment(w.test).locale('es').format('MMM Do YYYY').charAt(0).toUpperCase() + moment(w.test).locale('es').format('MMM Do YYYY').slice(1,14);
    }
}
</script>
