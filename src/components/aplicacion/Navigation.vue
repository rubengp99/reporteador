<template>
  <nav>
      <v-navigation-drawer v-model="drawer" fixed temporary>
          <v-list-item two-line>
              <v-list-item-avatar class="no-radius">
                <img src="@/assets/AFTIM.png">
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="title">Reporteador</v-list-item-title>
                <v-list-item-subtitle>Gestión de Negocio</v-list-item-subtitle>
              </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list dense nav>
              <v-list-item v-for="item in items" :key="item.title" :to="item.path">
                  <v-list-item-avatar class="no-radius">
                      <v-img :src="item.icon" alt="AFTIM" />
                  </v-list-item-avatar>

                  <v-list-item-content>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
          </v-list>
      </v-navigation-drawer>

      <v-app-bar class="h-59" :clipped-left="$vuetify.breakpoint.lgAndUp" app color="light-blue darken-4" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-spacer></v-spacer>
        <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
            <span>
                <v-btn icon large>
                    <v-avatar size="32px" item>
                      <v-img src="@/assets/AFTIM.png" alt="Vuetify" />
                    </v-avatar>
                </v-btn>Reporteador
            </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <perfil />
        <div v-if="!user.loggedIn">
            <v-btn text to="/login" class="mx-1 font-weight-bold white--text text-capitalize" >Iniciar sesión</v-btn>
        </div>
      </v-app-bar>
  </nav>
</template>

<script>
import { mapState } from "vuex";
import Perfil from '@/components/auth/Perfil';

export default {
  props: {
    source: String
  },
  components:{
    perfil: Perfil,
  },
  data: () => ({
    dialog: false,
    drawer: false,
    items: [
      { icon:  require("@/assets/home.png"), title: "Inicio", path: "/" },
      //{ icon: 'show_chart', text: 'Rentabilidad', path: '/Rentabilidad' },
      { icon: require("@/assets/box.svg"), title: "Inventario", path: "/Inventario" },
      { icon: require("@/assets/payment.svg"), title: 'Ventas', path: '/Ventas', 
          children: [
              { icon: require("@/assets/ranking.svg"), text: 'Ranking' },
              { icon: require("@/assets/routes.svg"), text: 'Rutas' },
              { icon: require("@/assets/sellers.svg"), text: 'Vendedores' },
              { icon: require("@/assets/buyers.svg"), text: 'Clientes' },
          ],
      },
      //{ icon: 'mdi-help-circle', text: 'Ayuda', path: '/Ayuda' },
    ]
  }),
  computed: {
    ...mapState(["user"])
  }
};
</script>

<style lang="scss">
.no-radius{
  border-radius: 0;
}

.h-59{
  min-height: 59px!important;
}
</style>