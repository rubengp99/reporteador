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

        </v-form>
    </div>
    
</template>

<script>
import Auth from '@/services/auth';
import validations from '@/validations/validations';
import {mapActions} from 'vuex';
import router from '@/router';
    export default {
        data(){
            return {
                data: {
                    user: "",
                    password: "",
                },
                valid:false,
                ...validations,
                showPassword:false,
                loading:false,
            }
        },
        methods: {
            ...mapActions(['logged']),
            error(){
                this.$toasted.error("Las credenciales son incorrectas.", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'error_outline'
                });
                this.loading = false;
            },
            success(nombre,apellido){
                this.$toasted.success("Bienvenido "+nombre+" "+apellido+".", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'done_all'
                });
                this.loading = false;
                setTimeout(() =>{ 
                    router.push('/');
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