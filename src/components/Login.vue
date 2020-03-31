<template>
    <div>
        <v-form v-model="valid" class="mx-5">
            <v-text-field
                label="Usuario / Correo"
                v-model="data.user"
                type="email"
                outlined
                prepend-inner-icon="email"
                color="#005598"
                dense
                single-line
                :rules="[required('Usuario / Correo'), maxLength('Usuario / Correo',100)]"
            />    
            <v-text-field
                v-model="data.password"
                label="Contraseña"
                single-line
                :type="showPassword ? 'text' : 'password'"
                :rules="[required('Contraseña'), minLength('Contraseña',6)]"
                @click:append="showPassword = !showPassword"
                :append-icon="showPassword ?  'visibility' : 'visibility_off'"
                :prepend-inner-icon="showPassword ?  'lock_open' : 'lock'"
                outlined
                color="#005598"
                dense
            />  
            <v-hover v-slot:default="{hover}" open-delay="200">
                <v-btn 
                    block 
                    type="submit" 
                    class="text-capitalize mt-5"
                    :disabled="!valid || loading" 
                    :color="hover ? '#388E3C':'#43A047'" 
                    :dark="valid && !loading"
                    :loading="loading"
                    :elevation="hover ? 5:0"
                    @click="login()"
                >
                    Iniciar Sesión
                </v-btn>
            </v-hover>

            <Snackbar :icon="icon" :color="color" :mensaje="mensaje"/>
        </v-form>
    </div>
    
</template>

<script>
import Auth from '@/services/auth';
import validations from '../validations/validations';
import Snackbar from '@/components/Snackbar';
import {mapActions} from 'vuex';
import router from '@/router';
    export default {
        components:{
            Snackbar
        },
        data(){
            return {
                data: {
                    user: "",
                    password: "",
                },
                valid:false,
                ...validations,
                showPassword:false,
                mensaje:"",
                icon:"",
                color:"",
                loading:false,
            }
        },
        methods: {
            ...mapActions(['setSnackbar','logged','setModalSesion']),
            error(){
                this.color="#D32F2F"
                this.icon = "error";
                this.mensaje = "Usuario y/o contraseña incorrecta."
                this.setSnackbar(true);
                this.loading = false;
            },
            success(nombre,apellido){
                this.color="#388E3C"
                this.icon = "done";
                this.mensaje = "Bienvenido "+nombre+" "+apellido+".";
                this.setSnackbar(true);
                this.loading = false;
                setTimeout(() =>{ 
                    router.push('/');
                    this.setModalSesion(false);
                },1000);
            },
            login(){
                this.loading = true;
                Auth().post("/login",{data:this.data}).then((response) =>{
                    this.logged(response.data);
                    this.success(response.data.data.nombre,response.data.data.apellido);
                }).catch(e => {
                    console.log(e);
                    this.error();
                });
            }
        },
    }
</script>