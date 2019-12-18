<template>
  <div class="dashboard">
  	<v-container class="my-5">
  		<v-layout column>
  		  <v-flex xs12>
          <div align="center" class="mt-3">
								<v-img
									src="home.png"
									aspect-ratio="1.9"
									max-width="200"
								></v-img>
							</div>
        </v-flex>
        <div v-if="$can('individual_request_service', 'hospital_request_service')">
          <v-flex xs12 class="mt-4">
            <div class="primary login-circle mt-5">
              <v-layout row wrap>
                <v-flex xs3>
                  <div align="center" class="mt-3">
                    <v-img
                      src="doctor.png"
                      aspect-ratio="1"
                      max-width="200"
                    ></v-img>
                  </div>
                </v-flex>
                <v-flex xs9>
                  <v-layout column>
                    <v-flex xs12>
                      <p class="white--text title mt-5 mb-5 ml-5">Track Here</p>
                    </v-flex>
                    <v-flex xs12>

                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
          <v-flex xs12>
            <div class="primary login-circle mt-3">
              <v-layout row wrap>
                <v-flex xs3>
                  <div align="center" class="mt-3">
                    <v-img
                      src="doctor.png"
                      aspect-ratio="1"
                      max-width="200"
                    ></v-img>
                  </div>
                </v-flex>
                <v-flex xs9>
                  <v-layout column>
                    <v-flex xs12>
                      <p class="white--text title mt-5 mb-5 ml-5">Request Here</p>
                    </v-flex>
                    <v-flex xs12>

                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
        </div>
      </v-layout>
  	</v-container>

  </div>
</template>

<script>
  import apiCall from '@/utils/api'
  import Vue from 'vue'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data () {
      return {
        latitude: '-1.2921',
        longitude: '36.8219',
        location:{}
      }
    },
    created(){
      navigator.geolocation.getCurrentPosition(this.currentPosition);
    },
    methods:{
      ...mapActions(['closestStation']),
      currentPosition(position){
        var vm = this
        vm.latitude = position.coords.latitude.toString()
        vm.longitude = position.coords.longitude.toString()
        // Vue.set(this,"longitude", position.coords.longitude.toString())
        // Vue.set(this,"latitude", position.coords.latitude.toString())
      },
    }

  }
</script>
