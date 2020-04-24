<template>
    <v-card class="fixHeight" style="margin-top:64px;padding: 25px 45px 0 45px;background:#fdfdfd;"  min-height="570px">
        <div class="font-weight-black title" style="padding-top:10px;">Centro de notificaciones</div>
        <v-row justify="center" align="center" class="mt-5" style="padding-top:15px;">
            <div>
                <div class="px-10 font-weight-bold body-2">No hay notificaciones nuevas...</div>
                <!--v-responsive class="overflow-y-auto my-5" max-height="400">
                    <v-row justify="center" align="center" class="px-5">
                        <v-alert
                            border="left"
                            colored-border
                            color="deep-purple accent-4"
                            elevation="2"
                            type="info"
                            v-for="n in 8"
                            :key="n"
                        >
                            Aliquam eu nunc. Fusce commodo aliquam arcu. In consectetuer turpis ut velit. Nulla facilisi..
                            Morbi mollis tellus ac sapien. Fusce vel dui. Praesent ut ligula non mi varius sagittis. Vivamus consectetuer hendrerit lacus. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.
                        </v-alert>
                    </v-row>
                </v-responsive-->
            </div>
        </v-row>

    </v-card>
</template>

<script>
import {mapState} from 'vuex';
import transitions from '@/plugins/transitions'
  const DEFAULT_TRANSITION = 'slide';

    export default {
        components:{
        },
        data() {
            return {
                transitionName: DEFAULT_TRANSITION,
            }
        },
        head: {
            title() {
                return {
                    inner: "Reporteador",
                    separator:'|',
                    complement:'Notificaciones'
                };
            }
        },
        computed:{
            ...mapState(['user']),
        },

       methods:{
            ...transitions,
        },
        created() {
            this.animate(this.transitionName);
        },
         mounted() {
            this.data = Object.assign({},this.user.data);
            this.date = this.data.fecha_nac;
        },
    }
</script>

<style lang="scss">
    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active {
        transition-duration: .3s;
        transition-property: all;
        transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
        overflow: hidden;
    }
    
    .slide-left-enter,
    .slide-right-leave-active {
        opacity: 0;
        transform: translate(2em, 0);
    }
    
    .slide-left-leave-active,
    .slide-right-enter {
        opacity: 0;
        transform: translate(-2em, 0);
    }

    .fixHeight{
        @media (max-width:958px){
            margin-top:-25px!important;
            max-height: 100%!important;
        }
    }
</style>