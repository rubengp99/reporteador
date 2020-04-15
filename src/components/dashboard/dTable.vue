<template>
  <v-card width="100%" class="storages" :outlined="loading">
    <v-spacer v-show="loading"></v-spacer>
    <loader v-show="loading" class="absolute-center" />
    <v-spacer v-show="loading"></v-spacer>
    <v-row v-show="!loading" align="center" justify="center">
      <p class="title" style="margin: 5px auto;">Valor de Depósitos</p>
    </v-row>
    <v-row v-show="!loading" class="storage" align="center" justify="center">
      <v-spacer class="d-none d-sm-flex"></v-spacer>
      <v-col cols="3" sm="2">
        <p class="subtitle-2 fix-lowRes">Depósito</p>
      </v-col>
      <v-col cols="3" sm="2">
        <p class="subtitle-2 fix-lowRes">Conceptos</p>
      </v-col>
      <v-col cols="3">
        <p class="subtitle-2 fix-lowRes">Bolívares</p>
      </v-col>
      <v-col cols="3">
        <p class="subtitle-2 fix-lowRes">Dólares</p>
      </v-col>
    </v-row>
    <v-row v-show="!loading" class="storage" align="center" justify="center" v-for="object in objects" :key="object.id">
      <v-col cols="2" class="d-none d-sm-flex">
        <v-img :src="require('@/assets/storage.svg')" aspect-ratio="1.3" contain></v-img>
      </v-col>
      <v-col cols="3" sm="2">
        <p class="subtitle-2">{{typeof object.id !== 'undefined' ? object.id : ''}}</p>
      </v-col>
      <v-col cols="3" sm="2">
        <p class="subtitle-2">{{typeof object.count !== 'undefined' ? object.count : ''}}</p>
      </v-col>
      <v-col cols="3">
        <p class="subtitle-2">{{typeof object.Bs !== 'undefined' ? object.Bs : ''}}</p>
      </v-col>
      <v-col cols="3">
        <p class="subtitle-2">{{typeof object.$ !== 'undefined' ? object.$ : ''}}</p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import loader from "@/components/aplicacion/loading"

export default {
  name: "dTable",
  components: {
    loader: loader
  },
  props: {
    objects: Array,
    loading:{
      type:Boolean,
      default: false,
    }
  },
  data() {
    return {};
  },
  beforeMount() {}
};
</script>

<style lang="scss">
.storages {
  position: relative;
  padding: 10px 15px;
  overflow: auto;

  @media (max-width: 1024px) {
    min-height: 300px;
  }

  @media (min-width: 1024px) {
    height: 100%;
  }
}

.storages p {
  margin: 0;
}

.storages > .storage:not(:last-child) {
  border-bottom: 1px solid rgba($color: #0d0d0d, $alpha: 0.12);
}
</style>