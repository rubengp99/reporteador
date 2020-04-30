<template>
    <v-card class="fixHeight" style="margin-top:64px;padding: 25px 45px 0 45px;background:#fdfdfd;"  min-height="570px">
        <div class="font-weight-black title" style="padding-top:10px;">Centro de Soporte al Cliente</div>
        <v-row justify="center" align="center" class="mt-3" style="padding-top:15px;">
            <div id="talkjs-container" style="width: 100%;; height: 450px"><i><v-spacer></v-spacer><loader style="padding-top:20%" /> <v-spacer></v-spacer></i></div>
        </v-row>

    </v-card>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import transitions from '@/plugins/transitions'
import Talk from 'talkjs';
import w from '@/services/variables';

const DEFAULT_TRANSITION = 'slide';
    export default {
        components:{

        },
        head: {
            title() {
                return {
                    inner: "Reporteador",
                    separator:'|',
                    complement:'Soporte'
                };
            }
        },
        data() {
            return {
                ...w,
                me: null,
                other: null,
                transitionName: DEFAULT_TRANSITION,
            }
        },
        computed:{
            ...mapState(['user','fotoChanged','foto','fotoFile']),
        },
        watch: {
            fotoFile:function(){
                console.log(this.fotoFile);
            },
            fotoChanged: function(){
                this.change = this.fotoChanged;
            },
        },
       methods:{
            ...mapActions(['setSnackbar','setFoto','setFotoChanged']),
            ...transitions,
            
        },
        created() {
            this.animate(this.transitionName);
        },
        mounted() {
            let inbox;
            Talk.ready.then(async () => {
                this.me = new Talk.User({
                    id: this.user.data.id !== 5 ? this.user.data.id : 5,
                    name: this.user.data.id !== 5 ? this.user.data.nombre + " " + this.user.data.apellido: "Soporte SOMOS SISTEMAS C.A",
                    email: this.user.data.id !== 5 ? this.user.data.email !== "" ? this.user.data.email : null : null, 
                    photoUrl: this.user.data.id !== 5 ? this.user.data.fotografia === 'default.png' ? require('@/assets/user.jpg') : this.image+this.user.data.fotografia : require('@/assets/AFTIM.png'),
                    welcomeMessage: this.user.data.id !== 5 ?  null : "En Somos Sistemas C.A, estamos encantados de ayudarte a solventar tus problemas. Déjanos un mensaje!",
                    role: 'Customer',
                    locale: 'es-ES'
                });

                window.talkSession = new Talk.Session({
                    appId: process.env.VUE_APP_TALKJS_ID,
                    me: this.me
                });
                
                
                if(this.user.data.id !== 5){
                    this.other = new Talk.User({
                        id: "5",
                        name: "Soporte SOMOS SISTEMAS C.A",
                        email: "azukadizero@gmail.com",
                        photoUrl: require('@/assets/AFTIM.png'),
                        welcomeMessage: "En Somos Sistemas C.A, estamos encantados de ayudarte a solventar tus problemas. Déjanos un mensaje!",
                        role:'Support',
                        locale: 'es-ES'
                    });

                    let conversation = window.talkSession.getOrCreateConversation(Talk.oneOnOneId(this.me, this.other));
                    conversation.setParticipant(this.me);
                    conversation.setParticipant(this.other);

                    inbox = window.talkSession.createInbox({selected: conversation});
                    
                }else{
                    window.talkSession = new Talk.Session({
                        appId: process.env.VUE_APP_TALKJS_ID,
                        me: this.me
                    });

                    let conversation = window.talkSession.getOrCreateConversation(Talk.oneOnOneId(this.me));
                    conversation.setParticipant(this.me);
                    
                    inbox = window.talkSession.createInbox({selected: conversation});
                }

                inbox.mount(document.getElementById("talkjs-container"));
                
            });
        }

    }
</script>

<style lang="scss">
    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active {
        transition-duration: .3s;
        transition-property: height, opacity, transform;
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