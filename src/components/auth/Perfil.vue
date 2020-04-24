<template>
  <div v-if="user.loggedIn">
    <v-menu :transition="transition()" bottom open-on-click offset-y>
      <template v-slot:activator="{ on }">
        <v-avatar v-on="on" color="#f5f5f5" size="55" class="mx-3 elevation-3 border">
          <v-img
            :src="user.data.fotografia === 'default.png' && !fotoChanged? fotoChanged ? foto  : require('@/assets/user.jpg') :  fotoChanged ? foto : image+user.data.fotografia"
          ></v-img>
        </v-avatar>
      </template>
      <!-- lista de opciones-->
      <v-card class="customized">
        <v-list width="250" elevation="0">
          <v-list-item>
            <v-list-item-avatar size="80" class="border">
              <v-img class="" :src="user.data.fotografia === 'default.png' && !fotoChanged? fotoChanged ? foto  : require('@/assets/user.jpg') :  fotoChanged ? foto : image+user.data.fotografia"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="color" v-text="user.data.nombre+' '+user.data.apellido"></v-list-item-title>
              <v-list-item-subtitle>Administrador</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list dense>
          <v-hover v-slot:default="{hover}">
            <v-list-item to="/cuenta/perfil">
              <v-list-item-icon>
                <v-icon :color="hover ? '#005598':null">settings</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Ajustes</v-list-item-title>
            </v-list-item>
          </v-hover>
          <v-hover v-slot:default="{hover}">
            <v-list-item @click="logOut()">
              <v-list-item-icon>
                <v-icon :color="hover ? '#005598':null">exit_to_app</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Cerrar sesíon</v-list-item-title>
            </v-list-item>
          </v-hover>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import variables from "@/services/variables";
import router from "@/router";
export default {
  name: "perfil",
  data() {
    return {
      ...variables
    };
  },
  computed: {
    ...mapState(['user','fotoChanged','foto']),
  },
  methods: {
    ...mapActions(["logout","setFotoChanged","setFoto"]),
    transition() {
      return "slide-y-transition";
    },
    logOut() {
      this.logout();
      router.push("/login");
    }
  }
};
</script>

<style lang="scss">
 .border{
         border: 1px solid #F5F5F5;
    }
.customized {
  margin-top: 10px;
}

.customized {
  border: 1px solid #d5cec8;
  display: block;
  background: white;
}
.customized:before,
.customized:after {
  content: " ";
  height: 0;
  position: absolute;
  width: 0;
  border: 11px solid transparent;
  /* arrow size */
  right: 1%;
  transform: translateX(-100%);
}

.customized:before {
  border-bottom: 12px solid rgba(0, 0, 0, 0.1);
  border-right: 12px solid rgba(0, 0, 0, 0);
  border-top: 12px solid rgba(0, 0, 0, 0);
  content: "";
  display: inline-block;
  position: absolute;
  top: -24px;
}
.customized:after {
  border-bottom: 12px solid #fff;
  border-right: 12px solid rgba(0, 0, 0, 0);
  border-top: 12px solid rgba(0, 0, 0, 0);
  content: "";
  display: inline-block;
  position: absolute;
  top: -22px;
}
</style>