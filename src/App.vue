<template>
  <v-app class="grey lighten-4">
    <Navbar v-if="['Login', 'Register'].indexOf($route.name) == -1"/>
    <v-content class="mx-4 mb-4 mt-2">
      <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components: {
    Navbar
  },
  data () {
    return {
      //
    }
  }
}
</script>
