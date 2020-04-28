<template>
    <v-card class="fixHeight" style="margin-top:64px;padding: 25px 45px 0 45px;background:#fdfdfd;" min-height="570px">
        <div class="font-weight-black title" style="padding-top:10px;">Información de tu cuenta</div>
        <v-row justify="center" align="center" class="mt-3" style="padding-top:15px;">
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
                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="100%" offset-overflow>
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

                    <v-date-picker v-model="date" landscape show-current  header-color="#005598" color="#005598"  locale="es"/>
                </v-menu>
            </v-col>    
            <v-col cols="12" md="12" sm="12">
                <transition name="fade">
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="#005598" dark :loading="loading" @click="updateUsuario(user.data.id)" class="text-capitalize body-2 fixPos" :disabled="!change">
                             Actualizar datos
                        </v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                 </transition>
            </v-col>
        </v-row>

    </v-card>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import Usuario from '@/services/Usuario';
import Auth from '@/services/auth';
import transitions from '@/plugins/transitions'
import Images from '@/services/Imagenes';
import _ from 'lodash';

  const DEFAULT_TRANSITION = 'slide';

    export default {
        components:{
        },
        data() {
            return {
                loading:false,
                change:false,
                passwordC:'',
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
                    complement:'Perfil'
                };
            }
        },
        computed:{
            ...mapState(['user','fotoChanged','foto','fotoFile']),
        },
        watch: {
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
            ...mapActions(['setFoto','setFotoChanged','setFotoFile']),
            ...transitions,
            async updateUsuario(id){
                let newUserData = {};
                this.loading = true;
                typeof this.date !== 'undefined' && this.date !== '' ? newUserData.fecha_nac = this.date : NaN;
                this.data.nombre !== this.user.data.nombre ? newUserData.nombre = this.data.nombre : NaN;
                this.data.apellido !== this.user.data.apellido ? newUserData.apellido = this.data.apellido : NaN;
                this.password === "" ? NaN 
                : this.password === this. passwordC ?
                    Auth().post('/resetpassword',{data:{user:this.user.data.login,password: this.password}}) 
                    : this.$toasted.error("Las contraseñas no coinciden.", { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'error_outline'
                        });
                
                if(this.fotoFile !== null){
                    let formdata = new FormData();
                    formdata.append('image',this.fotoFile);
                    Images().post(`/main/usuarios/${this.user.data.id}/`,formdata).then(()=> this.setFotoFile(null));
                    newUserData.fotografia = this.foto;
                }

                if(!_.isEqual(this.data,this.user.data) || this.telefono !== "" || typeof this.date !== 'undefined'){
                    Usuario().post(`/${id}`,{data:newUserData}).then(async () => {
                        let updatedUser = await Usuario().get('/'+id);
                        this.user.data = {...updatedUser.data.data};
                        this.change = false;
                        this.$toasted.info("Información Actualizada", { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'done_all'
                        });
                        this.loading = false;
                    }).catch(e => {
                        console.log(e);
                        this.$toasted.error("Ha ocurrido un error inesperado.", { 
                            theme: "bubble", 
                            position: "bottom-right", 
                            duration : 2000,
                            icon : 'error_outline'
                        });
                        this.loading = false;
                    });
                }
            },
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

    .fixPos{
         @media (max-width:958px){
            transform: translateY(-25px);
        }
    }
</style>