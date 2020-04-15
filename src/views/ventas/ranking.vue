<template>
  <v-col cols="12">
    <v-card class="mx-auto" max-width="100vw" style="padding: 15px 25px;" :outlined="loading">
      <v-card-title class="title" style="padding:5px;">
        <v-spacer></v-spacer>
        Ranking de Ventas
        <v-spacer></v-spacer>
      </v-card-title>
      <v-row v-if="!loading">
        <v-col cols="12" sm="4" v-for="item in ranking" :key="item.id">
          <v-card class="mx-auto" max-width="344" height="100%">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Top {{i}}</div>
                <v-list-item-title class="subtitle-1 mb-1" style="line-height: 1.25rem;text-overflow:none;white-space:normal;word-wrap:nowrap;">
                    {{item.nombre}}
                </v-list-item-title>
                <v-list-item-subtitle>{{item.codigo}}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar tile size="100" color="grey">
                <v-img
                  :src="item.imagen === 'default.png' ? require('@/assets/box.svg') : image+item.imagen"
                ></v-img>
              </v-list-item-avatar>
            </v-list-item>

            <v-card-actions>
              <v-list-item-title class="subtitle-2 mb-1" style="text-overflow:none;white-space:normal;word-wrap:nowrap;">
                {{(typeof apiGroups.data.data.find(group => group.id === item.grupos_id || group.id === item.adm_grupos_id) !== 'undefined')?
                apiGroups.data.data.find(group => group.id === item.grupos_id || group.id === item.adm_grupos_id).nombre : '-'}}
              </v-list-item-title>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <div v-else class="mx-auto" width="100%" outlined>
        <br />
        <loader />
        <br />
        <div class="snake"></div>
      </div>
    </v-card>
  </v-col>
</template>

<script>
//import dCard from "@/components/aplicacion/Dashcard";
import concept from "@/services/Conceptos"
import variables from "@/services/variables";
import groups from "@/services/Grupos";
import subGroups from "@/services/SubGrupos";

export default {
   name: "ranking",
   components: {
    //dCard: dCard,
    //loader: loader,    
  },
  data: () => {
    return {
      ...variables,
      ranking: [],
      i: 0,
      loading: true,
      apiGroups: null,
      apiSubGroups: null,
    };
  },
  async beforeMount(){
    try {
      this.$data.ranking = await concept().get("?limit=1");
      this.$data.ranking = await concept().get("/mostSold/?limit="+this.$data.ranking.data.totalCount);
      this.$data.ranking = this.$data.ranking.data.data;
      this.$data.apiGroups = await groups().get();
      this.$data.apiGroups = await groups().get('?limit='+this.$data.apiGroups.data.totalCount);
      this.$data.apiSubGroups = await subGroups().get('?limit=1');
      this.$data.apiSubGroups = await subGroups().get('?limit='+this.$data.apiSubGroups.data.totalCount);
      this.$data.apiSubGroups = this.$data.apiSubGroups.data.data;
      this.$data.loading = false;
    } catch (error) {
      this.$data.ranking = [];
    }
  }
}
</script>