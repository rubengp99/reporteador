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

        <Snackbar v-if="!mensaje === ''" :mensaje="mensaje" :icon="icon" :color="color" />
    </v-card>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import Usuario from '@/services/Usuario';
import Snackbar from '@/components/aplicacion/Snackbar';
import transitions from '@/plugins/transitions'
  const DEFAULT_TRANSITION = 'slide';

    export default {
        components:{
            Snackbar
        },
        data() {
            return {
                mensaje:'',
                color:'',
                icon:'',
                loading:false,
                change:false,
                passwordC:'',
                //imageName: '',
                //imageUrl: '',
                //imageFile: '',
                data:{},
                telefono:null,
                password:'',
                reader:null,
                date: new Date().toISOString().substr(0, 10),
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
            ...mapState(['user','fotoChanged','foto','fotoFile']),
        },
        watch: {
            fotoFile:function(){
                console.log(this.fotoFile);
            },
            fotoChanged: function(){
                this.change = this.fotoChanged;
            },
            data:{
                handler(){
                    if(!this.fotoChanged && this.data.nombre === this.user.data.nombre && this.data.apellido === this.user.data.apellido && this.data.email === this.user.data.email && this.data.login === this.user.data.login){
                        this.change = false;
                    }else{
                        this.change = true;
                    }
                },
                deep:true
            },
            
        },
       methods:{
            ...mapActions(['setSnackbar','setFoto','setFotoChanged']),
            ...transitions,
            mensajeSnackbar(color,icon,mensaje){
                this.color = color;
                this.icon = icon;
                this.mensaje = mensaje;
                this.setSnackbar(true);
                this.loading = false;
            },
            updateUsuario(id){
                this.loading = true;
                this.data.
                this.data.fecha_nac = this.date;
                Usuario().post(`/${id}`,{data:this.data}).then(() => {
                    this.mensajeSnackbar('#388E3C','done','Actualizado exitosamente.');
                    this.user.data = this.data;
                    this.change = false;
                }).catch(e => {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','error','Opsss, Error al intentar actualizar.');
                });
            },
            /*fotoUpload(e){
                const files = e.target.files
                if(files[0] !== undefined) {
                    this.imageName = files[0].name
                    const fr = new FileReader ();
                    fr.readAsDataURL(files[0])
                    fr.addEventListener('load', () => {
                        this.imageUrl = fr.result
                        this.imageFile = files[0] // this is an image file that can be sent to server...
                        this.setFotoChanged(true);
                        this.setFoto(this.imageUrl);
                    })
                } else {
                    this.imageName = ''
                    this.imageFile = ''
                    this.imageUrl = ''
                    this.setFotoChanged(false);
                    this.setFoto(this.user.data.fotografia);
                }
                
            }*/
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