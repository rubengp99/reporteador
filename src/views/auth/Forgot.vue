<template>
    <div>
        <v-row justify="center" align="center" style="margin-top:86px;">
            <v-col cols="12" md="4" lg="4" class="hidden-sm-and-down">
                <v-img contain width="100%" height="400" :src="require('@/assets/lost.svg')"></v-img>
            </v-col>

            <v-col cols="12" md="4" sm="12">
                <v-card width="100%" height="400" elevation="5" class="pa-5">
                    <v-row justify="center" align="center" class="mt-1">
                        <v-img contain width="130" height="45" :src="require('@/assets/AFTIM.png')"></v-img>
                    </v-row>
                    <div class="text-center my-3 font-weight-black subtitle-1">¿No puede iniciar sesión?</div>

                    <v-card-text>
                        <div class="font-weight-black body-2 mb-2">Le enviaremos un enlace de recuperación</div>
                        <v-form v-model="valid" @submit.prevent>
                            <v-text-field
                                label="Introduzca su correo electrónico"
                                single-line
                                outlined 
                                dense
                                color="#005598"
                                v-model="correo"
                                type="text"
                                :rules="[required('Correo Electrónico')]"
                            />
                            <v-hover v-slot:default="{hover}">
                                <v-btn 
                                    block 
                                    type="submit" 
                                    class="text-capitalize mt-1"
                                    :disabled="!valid || loading" 
                                    color="#005598" 
                                    :dark="valid && !loading"
                                    :loading="loading"
                                    :elevation="hover ? 5:0"
                                    @click="sendMail"
                                >
                                    Enviar enlace
                                </v-btn>
                            </v-hover>
                        </v-form>
                    </v-card-text>

                    <div class="mx-10 my-3">
                        <v-divider></v-divider>
                    </div>

                    <v-hover v-slot:default="{hover}">
                        <div @click="push()" class="text-center" >
                            <a :class="hover ? 'mx-1 subtitle-2 text-color decoracion':'mx-2 subtitle-2 text-color'">
                                Recordé mi contraseña.
                            </a>
                        </div>
                    </v-hover>
                </v-card>
            </v-col>
             <v-col cols="12" md="4" lg="4" class="hidden-sm-and-down">
                <v-img contain width="100%" height="300" :src="require('@/assets/lost2.svg')"></v-img>
            </v-col>
        </v-row>

    </div>
</template>

<script>
import validations from '@/validations/validations';
import Auth from '@/services/auth';
import router from '@/router';
    export default {    

        data() {
            return {
                valid:false,
                loading:false,
                send:false,
                correo:'',
                codigo:'',
                ...validations
            }
        },
        methods: {
            push(){ router.push('/login') },
            push2(){ router.push('/reset') },
            
            sendMail(){
                this.loading = true;
                Auth().post("/sendmail",{data:{mail:this.correo}}).then((response) => {
                    console.log(response);
                    this.$toasted.success("Código enviado exitosamente.", { 
                        theme: "bubble", 
                        position: "bottom-right", 
                        duration : 2000,
                        icon : 'done_all'
                    });
                    this.send = true;
                }).catch(e => {
                    console.log(e);
                    this.$toasted.error("Error al envía el código.", { 
                        theme: "bubble", 
                        position: "bottom-right", 
                        duration : 2000,
                        icon : 'error_outline'
                    });
                });
            },
            validCode(){
                this.loading = true;
                Auth().post("/validcode",{data:{mail:this.correo,hash:this.codigo}}).then((response) => {
                    console.log(response);
                    this.$toasted.success("Su código fue verificado con éxito.", { 
                        theme: "bubble", 
                        position: "bottom-right", 
                        duration : 2000,
                        icon : 'done_all'
                    });
                    this.push2();
                }).catch(e => {
                    console.log(e);
                    this.$toasted.error("Ha ocurrido un problema al verificar su código.", { 
                        theme: "bubble", 
                        position: "bottom-right", 
                        duration : 2000,
                        icon : 'error_outline'
                    });
                });
            },
        },
        head: {
            title() {
                return {
                    inner: "Recuperar Contraseña",
                    separator: "|",
                    complement: " "
                };
            }
        }
    }
</script>

<style scoped>
    .background {
        background-color: rgba(0, 82, 152, 0.8);
        height: 30%;
        width: 100%;
    }
    .text-color {
        color: #005598;
    }
    .decoracion {
        text-decoration: underline;
        text-decoration-color: #005598;
        transition-delay: 2s;
        transition-duration: 1s;
    }
</style>