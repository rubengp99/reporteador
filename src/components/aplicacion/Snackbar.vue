<template>
    <v-snackbar v-model="snackbars" :color="color" right :timeout="time">
        <div>
            <v-icon color="#fff" class="mx-2">{{icon}}</v-icon>{{mensaje}}
        </div>
    </v-snackbar>
</template>

<script>
import {mapActions,mapState} from "vuex";
    export default {
        computed:{
            ...mapState(['snackbar']),
            snackbars:{
                get(){
                    return this.snackbar;
                },
                set(val){
                    this.setSnackbar(val);
                }
            }
        },
        methods: {
            ...mapActions(['setSnackbar'])
        },
        props:{
            color:{
                Type:String,
                default:''
            },
            mensaje:{
                Type:String,
                default:''
            },
            icon:{
                type:String,
                default:''
            },
            time:{
                type:Number,
                default:3000
            }
        }
    }
</script>