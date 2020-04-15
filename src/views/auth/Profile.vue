<template>
    <div>
        <div class="font-weight-black subtitle-1">Información de tu cuenta</div>

        <v-row justify="center" align="center" class="mt-2">
            <v-col cols="12" md="5" sm="12">
                <div class="grey--text font-regular mb-2">Nombre(s)</div>
                <v-text-field
                    single-line
                    solo
                    dense
                    color="#005598"
                    label="Nombre(s)"
                    v-model="user.data.nombre"
                    type="text"
                />
            </v-col>
            <v-col cols="12" md="5" sm="12">
                <div class="grey--text font-regular mb-2">Apellido(s)</div>
                <v-text-field
                    solo
                    single-line
                    dense
                    color="#005598"
                    label="Apellido(s)"
                    v-model="user.data.apellido"
                    type="text"
                />
            </v-col>
            <v-col cols="12" md="5" sm="12">
                <div class="grey--text font-regular mb-2">Correo electrónico</div>
                <v-text-field
                    solo
                    dense
                    single-line
                    color="#005598"
                    append-icon="lock"
                    disabled
                    label="Correo electrónico"
                    v-model="user.data.email"
                    type="text"
                />
            </v-col>
            <v-col cols="12" md="5" sm="12">
                <div class="grey--text font-regular mb-2">Usuario</div>
                <v-text-field
                    solo
                    dense
                    single-line
                    color="#005598"
                    append-icon="lock"
                    disabled
                    label="Usuario"
                    v-model="user.data.login"
                    type="text"
                />
            </v-col>
            <v-col cols="12" md="5" sm="12">
                <div class="grey--text font-regular mb-2">Celular</div>
                <v-text-field
                    solo
                    single-line
                    dense
                    color="#005598"
                    append-icon="phone_iphone"
                    label="Celular"
                    prefix="0-"
                    v-model="telefono"
                    type="text"
                />
            </v-col>
            <v-col cols="12" md="5" sm="12">
                <div class="grey--text font-regular mb-2">Fecha de nacimiento</div>
                <v-menu
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            v-model="date"
                            label="Date"
                            hint="YYYY/MM/DD format"
                            persistent-hint
                            color="#005598"
                            append-icon="event"
                            solo
                            single-line
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker 
                        v-model="date" no-title 
                        header-color="#005598"
                        color="#005598"
                    />
                </v-menu>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-hover v-slot:default="{hover}">
                        <v-btn 
                            color="#005598" dark :elevation="hover ? 2:0" 
                            :loading="loading" @click="updateUsuario(user.data.id)"
                            class="text-capitalize body-2" rounded disabled
                        >
                            Atualizar datos
                        </v-btn>
                    </v-hover>
                </v-card-actions>
            </v-col>
        </v-row>

        <Snackbar v-if="!mesage === ''" :mensaje="mensaje" :icon="icon" :color="color" />
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import Usuario from '@/services/Usuario';
import Snackbar from '@/components/aplicacion/Snackbar';
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
                telefono:null,
                date: new Date().toISOString().substr(0, 10),
            }
        },
        computed:{
            ...mapState(['user'])
        },
        methods:{
            ...mapActions(['setSnackbar']),
            
            mensajeSnackbar(color,icon,mensaje){
                this.color = color;
                this.icon = icon;
                this.mensaje = mensaje;
                this.setSnackbar(true);
                this.loading = false;
            },
            updateUsuario(id){
                let data ={
                    nombre:this.user.data.nombre,
                    apellido: this.user.data.apellido,
                    fecha_nac:this.date
                }
                this.loading = true;
                Usuario().post(`/${id}`,{data:data}).then(() => {
                    this.mensajeSnackbar('#388E3C','done','Actualizado exitosamente.');
                }).catch(e => {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','error','Ha ocurrido un error inesperado.');
                });
            }
        }
    }
</script>