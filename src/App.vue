<template>
  <v-app id="app">
    <navigation  class="v-application"/>
    <transition name="fade">
      <router-view/>
    </transition>  
  </v-app>
</template>

<script>
  import navigation from './components/Navigation'
  export default {
    name: 'app',
    components: {
      navigation: navigation
    }
  }
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif!important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }

  .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }
}
</style>
