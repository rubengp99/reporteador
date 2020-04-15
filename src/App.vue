<template>
  <v-app id="app" style="background: #FAFAFA;">
    <navigation  class="v-application"/>
    <transition :name="transitionName" mode="out-in" @beforeLeave="beforeLeave" @enter="enter" @afterEnter="afterEnter">
        <router-view/>
    </transition>
  </v-app>
</template>

<script>
  import navigation from './components/aplicacion/Navigation'
  import transitions from './plugins/transitions'

  const DEFAULT_TRANSITION = 'fade';
  export default {
    name: 'app',
    components: {
      navigation: navigation
    },
    data() {
     return {
        prevHeight: 0,
        transitionName: DEFAULT_TRANSITION,
     };
   },
    methods:{
      ...transitions
    },
    created() {
      this.animate(this.transitionName);
    },
  }
</script>

