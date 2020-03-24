<template>
    <v-col cols="12" :sm="col === '6' ? '12' : '6'" :md="col">
        <v-scale-transition v-if="title !== 0">
            <v-card class="mx-auto" width="100%" outlined>
                <v-list-item three-line>
                    <v-list-item-content>
                    <div class="overline">Hoy</div>
                    <v-list-item-title class="headline" style="white-space: normal;">{{title}}</v-list-item-title>
                    <v-list-item-subtitle class="subtitle-1">{{text}}</v-list-item-subtitle>
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
        </v-card>    
    </v-col>
</template>

<script>
import loader from '../components/loading'
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

    },
    data (){
        return{

        }
    }
}
</script>