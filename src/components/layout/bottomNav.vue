<template>
    <v-bottom-nav
      fixed
      app
      :active.sync="bottomNav"
      :value="true"
      color="white"
    >
      <v-btn
      icon
        flat
        router to="/"
      >
        <span>Home</span>
        <v-icon dark>home</v-icon>
      </v-btn>

      <v-btn
        router to="/workers"
      >
        <span>Health Workers</span>
        <v-icon dark>person</v-icon>
      </v-btn>

      <v-btn
        router to="/favourites"
      >
        <span>Favourites</span>
        <v-icon>star</v-icon>
      </v-btn>

      <v-btn
        router to="/map"
      >
        <span>Map</span>
        <v-icon dark>map</v-icon>
      </v-btn>

    </v-bottom-nav>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {
        bottomNav: 'dashboard',
      }
    },
    methods: {
      signOut: function () {
        this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'))
      },
    },
    computed: {
      
    }
  }
</script>