<template>
    <div>
        <v-row style="padding:0 10px;">
            <v-col cols="12" md=3>
                <v-card class="bg" :height="clicked ? '85vh' : '24.5vh'" @click="clicked = !clicked">
                    <v-list dense nav style="margin-top: 64px;background: none;">
                        <v-list-item two-line>
                            
                            <v-list-item-avatar size="115" v-if="!$route.name === 'Perfil'">
                                <v-img :src="user.data.fotografia === 'default.png' && !fotoChanged? fotoChanged ? foto  : require('@/assets/user.jpg') :  fotoChanged ? foto : image+user.data.fotografia"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-avatar class="border" size="115" v-else>
                                <croppa 
                                    ref="avatar"
                                    placeholder="" 
                                    disable-click-to-choose 
                                    disable-scroll-to-zoom 
                                    disable-pinch-to-zoom 
                                    remove-button-color="black" 
                                    show-loading class="bg-center" 
                                    :width="115" 
                                    :height="115" 
                                    v-model="fotoAux" 
                                    canvas-color="transparent"
                                    @new-image-drawn="onNewImage()" 
                                    :style="(user.data.fotografia === 'default.png' && !fotoChanged? fotoChanged ? 'background:url('+foto+');'  : 'background:url('+require('@/assets/user.jpg')+');' :  fotoChanged ? 'background:url('+foto+');' : 'background:url('+image+user.data.fotografia+');')"
                                >
                                </croppa>
                            </v-list-item-avatar>
                            <v-avatar @click.native="!fotoChanged ? uploadFoto() : restoreFoto() " v-if="$route.name === 'Perfil'" class="abs_center" size="35" style="z-index:2;" color="#F5F5F5">
                                <v-icon style="font-size:21px;">{{ !fotoChanged ? 'mdi-camera' : 'close' }}</v-icon>
                            </v-avatar>
                            <v-list-item-content class="white--text font-weight-bold">
                                <v-list-item-title class="subtitle-1 mb-1" style="text-overflow:none; white-space:normal;">Super usuario</v-list-item-title>
                                <v-list-item-subtitle class="subtitle-2 white--text font-weight-bold">{{user.data.nombre +' '+ user.data.apellido}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                    <v-divider class="back" v-show="clicked"></v-divider>

                    <v-expand-transition>
                        <v-card-actions v-show="clicked">
                            <v-list dense nav style="background: none;width:100%">
                                <v-list-item 
                                    v-for="item in items" 
                                    :key="item.title" 
                                    link 
                                    :to="item.to"
                                    active-class="white--text color font-weight-bold sombra"
                                >
                                    <v-list-item-icon>
                                        <v-icon dark>{{ item.icon }}</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title class="subtitle-2 white--text font-weight-bold">{{ item.title }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card-actions>
                    </v-expand-transition>
                </v-card>
            </v-col>
            <v-col cols=12 md="9">
                <transition  :name="transitionName" mode="out-in" @beforeLeave="beforeLeave" @enter="enter" @afterEnter="afterEnter">
                    <router-view></router-view>
                </transition>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import variables from '@/services/variables';
import transitions from '@/plugins/transitions'
  const DEFAULT_TRANSITION = 'slide';
    export default {
        data() {
            return {
                ...variables,
                transitionName: DEFAULT_TRANSITION,
                fotoAux:{},
                items: [
                    { title: 'Perfil', icon: 'mdi-account-circle',to:'perfil' },
                    { title: 'Notificaciones', icon: 'mdi-bell',to:'notificaciones' },
                    { title: 'Ayuda', icon: 'mdi-help',to:'ayuda' },
                ],
                clicked:true,
            }
        },
        methods:{
            ...transitions,
            ...mapActions(['setFoto','setFotoChanged','setFotoFile']),
            restoreFoto(){
                this.fotoAux.remove();
                this.setFotoChanged(false);
                this.setFoto(this.user.data.fotografia);
                this.setFotoFile(null);
            },
            uploadFoto(){
                this.fotoAux.chooseFile();
            },
            onNewImage(){
                this.setFotoFile(this.fotoAux.getChosenFile());
                this.setFotoChanged(true);
                this.setFoto(this.fotoAux.generateDataUrl());
            }
        },
        computed:{
            ...mapState(['user','fotoChanged','foto']),
        },
        created() {
            this.animate(this.transitionName);
            this.setFoto(this.user.data.fotografia);
            this.setFotoChanged(false);
        },
        mounted(){
            this.fotoAux.remove();
        }
    }
</script>

<style lang="scss" scoped>
    .color{
        background: #17468b;
    }
    .back{
        background: #fff;
    }
    .sombra{
        background:#01579b !important;
    }

    .bg{
        background-image: linear-gradient(to right top, rgba(100, 115, 201, 0.33), rgba(25, 32, 72, 0.7)), url(../../assets/bg.jpg);
        background-position: center center;
        transition: height .2s ease-in-out;
    }

    .bg-center{
        background-position:center center!important;
        width: 115px;
        height: 115px;
        border-radius:50%;
    }

    .border{
         border: 2px solid #F5F5F5;
    }

    .abs_center{
        position: absolute;
        top: 95px;
        left: 85px;
    }

    .abs_center:hover{
        cursor: pointer;
        background: #ededed!important;
    }

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
</style>