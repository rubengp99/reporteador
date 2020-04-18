<template>
    <v-card class="fixHeight" style="margin-top:64px;padding: 25px 45px 0 45px;"  min-height="85vh" max-height="85vh">
        <div class="font-weight-black title" style="padding-top:10px;">Información de tu cuenta</div>
        <v-row justify="center" align="center" class="mt-5" style="padding-top:15px;">
             <v-col cols="12" md="6" sm="12">
                <v-text-field
                    dense
                    disabled=""
                    label="Correo"
                    placeholder="Ej: Admin@example.com"
                    outlined
                    v-model="user.data.email"
                    type="text"
                    prepend-icon="mail"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-text-field
                    dense
                    label="Usuario"
                    disabled=""
                    placeholder="Ej: Admin98"
                    outlined
                    v-model="user.data.login"
                    type="text"
                    prepend-icon="mdi-account-circle"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-text-field
                    dense
                    label="Nombre(s)"
                    placeholder="Ej: Admin"
                    outlined
                    v-model="data.nombre"
                    type="text"
                    prepend-icon="person"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-text-field
                    dense
                    label="Apellidos(s)"
                    placeholder="Ej: Super"
                    outlined
                    v-model="data.apellido"
                    type="text"
                    prepend-icon="person"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-text-field
                    dense
                    label="Nueva Contraseña"
                    placeholder="********"
                    outlined
                    v-model="password"
                    type="password"
                    prepend-icon="lock"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-text-field
                    dense
                    label="Confirmar Contraseña"
                    placeholder="********"
                    outlined
                    v-model="passwordC"
                    type="password"
                    prepend-icon="lock"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-text-field
                    dense
                    label="Teléfono"
                    placeholder="Ej: 414-0404040"
                    outlined
                    prefix="+58 "
                    v-model="telefono"
                    type="text"
                    prepend-icon="phone_iphone"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-menu
                    :close-on-content-click="false"
                    transition="scale-transition"
                    max-width="100%"
                    offset-overflow
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            dense
                            v-model="date"
                            label="Cumpleaños"
                            placeholder="Formato YYYY/MM/DD."
                            color="#005598"
                            prepend-icon="event"
                            outlined
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker 
                        v-model="date"
                        landscape
                        show-current
                        header-color="#005598"
                        color="#005598"
                        locale="es"
                    />
                </v-menu>
            </v-col>    
            <v-col cols="12" md="12" sm="12">
                <transition name="fade">
                    <v-card-actions>
                        <v-spacer></v-spacer>
                                <v-btn 
                                    color="#005598" dark
                                    :loading="loading" @click="updateUsuario(user.data.id)"
                                    class="text-capitalize body-2" 
                                    :disabled="!change" 
                                >
                                    Actualizar datos
                                </v-btn>
                        
                        <v-spacer></v-spacer>
                    </v-card-actions>
                 </transition>
            </v-col>
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