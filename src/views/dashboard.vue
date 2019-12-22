<template>
  <div class="dashboard">
  <v-snackbar v-model="snackbar" :timeout="4000" top :color="snackbarColor">
    <span>{{message}}</span>
  </v-snackbar>
  <v-dialog 
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    v-model="requestDialog">
    <v-card>
	    <v-toolbar
        flat
        dark
        class="secondary"
      >
      <v-btn
          flat
          icon
          dark
          color="secondary"
          v-if="progress != 'Time' && progress != 'Category'"
        >
          <v-icon color="secondary">keyboard_backspace</v-icon>
        </v-btn>
        <v-btn
          icon
          dark
          v-if="progress == 'Time'"
          @click="showMap"
        >
          <v-icon>keyboard_backspace</v-icon>
        </v-btn>
        <v-btn
          icon
          dark
          v-if="progress == 'Category'"
          @click="showClock"
        >
          <v-icon>keyboard_backspace</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>New Request</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          dark
          @click="requestDialog = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-progress-linear :value="progressBar"  v-if="requestDialog == true"></v-progress-linear>
        <div v-if="progress == 'Location'">
          <v-layout column>
            <v-flex xs12>
              <v-map ref="myMapRef" style="position: absolute; width: 92%; height: 85%; z-index: 2" :center="[latitude, longitude]" :zoom=15>
                <v-icondefault class="mt-5"></v-icondefault>
                <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                <v-marker  
                  ref = "myMarker"
                  :lat-lng="[latitude, longitude]"
                  :icon="icon"
                  :draggable='true'
                >
                  <v-popup content="Me"></v-popup>
                </v-marker>
                  <v-btn class="secondary white--text text-none" style="position: absolute; z-index: 500; bottom: 5%;" block  @click="newPos">Next</v-btn>
              </v-map>
            </v-flex>
          </v-layout>
        </div>
        <div v-if="progress == 'Time'">
          <v-layout column>
            <v-container>
              <v-flex xs12>
                <p class="headline">Pick Time</p>
              </v-flex>
              <v-flex xs12>
                <div v-if="progress == 'Time'">
                  <v-menu
                    ref="menu11"
                    v-model="menu1"
                    :close-on-content-click="false"
                    :return-value.sync="requestData.from"
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="requestData.from"
                        label="Start Time"
                        append-icon="access_time"
                        readonly
                        v-on="on"
                        outline
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu1"
                      v-model="requestData.from"
                      :allowed-minutes="allowedStep"
                      full-width
                      color="blue"
                      @click:minute="$refs.menu11.save(requestData.from)"
                      format="24hr"
                      :min="now"
                    ></v-time-picker>
                  </v-menu>
                </div>
              </v-flex>
              <v-flex xs12>
                <div v-if="progress == 'Time'">
                  <v-menu
                    ref="menu12"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :return-value.sync="requestData.to"
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="requestData.to"
                        label="End Time"
                        append-icon="access_time"
                        readonly
                        v-on="on"
                        outline
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu2"
                      v-model="requestData.to"
                      :allowed-minutes="allowedStep"
                      full-width
                      color="blue"
                      @click:minute="$refs.menu12.save(requestData.to)"
                      format="24hr"
                      :min="requestData.from"
                    ></v-time-picker>
                  </v-menu>
                </div>
              </v-flex>
            </v-container>
          </v-layout>
          <v-btn class="secondary white--text text-none mx-5" style="position: absolute; bottom: 5%; left:-12%"  block @click="selectCategory">Next</v-btn>
        </div>
        <div v-if="progress == 'Category'">
          <v-container>
            <v-layout column>
              <v-flex xs12>
                <p class="headline">Pick Category</p>
              </v-flex>
              <v-flex xs12>
                <v-layout column>
                  <v-flex xs12>
                    <v-layout row wrap>
                      <v-flex xs6 class="mt-2">
                      <v-card
                          @click="pickCategory(1)"
                          :color="generalColor" class="white--text mx-1"
                        >
                          <v-card-text>
                          <div align="center" class="mt-3">
                              <v-img
                                src="general.png"
                                aspect-ratio="1"
                              ></v-img>
                            </div>
                            <div>
                              <div class="secondary--text headline mb-1">General Doctor</div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                      <v-flex xs6 class="mt-2">
                      <v-card
                          @click="pickCategory(2)"
                          :color="specializedColor" class="white--text mx-1"
                        >
                          <v-card-text>
                          <div align="center" class="mt-3">
                              <v-img
                                src="doctor.png"
                                aspect-ratio="1"
                              ></v-img>
                            </div>
                            <div>
                              <div class="secondary--text headline mb-1">Specialised Doctor</div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 class="mt-2">
                    <v-layout row wrap>
                      <v-flex xs6>
                      <v-card
                          @click="pickCategory(3)"
                          :color="nurseColor" class="white--text mx-1"
                        >
                          <v-card-text>
                          <div align="center" class="mt-3">
                              <v-img
                                src="doctor.png"
                                aspect-ratio="1"
                              ></v-img>
                            </div>
                            <div>
                              <div class="secondary--text headline mb-1">Nurse</div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
        
    
      </v-card-text>
    </v-card>
  </v-dialog>

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
        <div v-if="$can('individual_request_service') || $can('hospital_request_service')">
          <div>
            <v-flex xs12 class="mt-4">
              <div class="primary login-circle mt-5" @click="newRequest">
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
                        <p class="white--text title mt-5 mb-5 ml-5">Track Here</p>
                      </v-flex>
                      <v-flex xs12>

                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
          </div>
        </div>
      </v-layout>
  	</v-container>

  </div>
</template>
<style>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
html, body {
  height: 100%;
  margin: 0;
}
</style>

<script>
  import apiCall from '@/utils/api'
  import Vue from 'vue'
  import { mapGetters, mapActions } from 'vuex'
  import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '@/store/actions/user'

  import * as Vue2Leaflet from 'vue2-leaflet'
  import { latLng, Icon, icon } from 'leaflet'
  import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
  import iconUrl from 'leaflet/dist/images/marker-icon.png'
  import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

  Vue.component('v-marker-cluster', Vue2LeafletMarkerCluster)

  export default {
    components: {
      'v-map': Vue2Leaflet.LMap,
      'v-tilelayer': Vue2Leaflet.LTileLayer,
      'v-icondefault': Vue2Leaflet.LIconDefault,
      'v-marker': Vue2Leaflet.LMarker,
      'v-popup': Vue2Leaflet.LPopup
    },

    data () {
      let customicon = icon(Object.assign({},
        Icon.Default.prototype.options,
        {iconUrl, shadowUrl}
      ))

      return {
        requestDialog: false,
        menu1: false,
        menu2: false,
        //showMap: false,

        snackbar: false,
        message: '',
        snackbarColor: '',

        generalColor: 'transparent',
        specializedColor: 'transparent',
        nurseColor: 'transparent',

        progress: 'Location',

        popupName: null,
        icon: customicon,
        clusterOptions: {},

        progressBar: 0,
        latitude: '',
        longitude: '',
        location: '',

        requestData: {
          location: {},
          from: null,
          to: null,
          category: ''
        }
      }
    },
    created(){
      navigator.geolocation.getCurrentPosition(this.currentPosition);
      this.USER_REQUEST()
    },
    watch: {
      
    },
    methods:{
      ...mapActions(['closestStation', 'USER_REQUEST']),
      allowedStep: m => m % 5 === 0,
      currentPosition(position){
        var vm = this
        vm.latitude = position.coords.latitude.toString()
        vm.longitude = position.coords.longitude.toString()
        Vue.set(this,"longitude", position.coords.longitude.toString())
        Vue.set(this,"latitude", position.coords.latitude.toString())
        //Vue.set(this,"showMap", true)
      },
      showMap(){
        this.progress = 'Location'
        this.progressBar = 0
      },
      showClock(){
        this.progress = 'Time'
        this.progressBar = 25
      },
      newPos(){
        this.requestData.location = this.$refs.myMarker.mapObject.getLatLng()
        console.log("moved", this.requestData.location)
        this.progress = 'Time'
        this.progressBar = 25
      },
      selectCategory(){
        if(this.requestData.from == null || this.requestData.to == null){
          this.message = 'Please Pick Start/End Time'
          this.snackbar = true
          this.snackbarColor = 'error'
        }else{
          this.progress = 'Category'
          this.progressBar = 50
          this.menu1 = false
          this.menu2 = false
        }
        
      },
      newRequest(){
        this.requestDialog = true
      },
      pickCategory(category){
        if(category == 1){
          if(this.requestData.category == 1){
            this.requestData.category = ''
            this.generalColor = 'transparent'
            this.specializedColor = 'transparent'
            this.nurseColor = 'transparent'
          } else {
            this.requestData.category = 1
            this.generalColor = 'primary'
            this.specializedColor = 'transparent'
            this.nurseColor = 'transparent'
          }
        } else if(category == 2){
          if(this.requestData.category == 2){
            this.requestData.category = ''
            this.specializedColor = 'transparent'
            this.generalColor = 'transparent'
            this.nurseColor = 'transparent'
          } else {
            this.requestData.category = 2
            this.specializedColor = 'primary'
            this.generalColor = 'transparent'
            this.nurseColor = 'transparent'
          }
        } else if(category == 3){
          if(this.requestData.category == 3){
            this.requestData.category = ''
            this.nurseColor = 'transparent'
             this.generalColor = 'transparent'
             this.specializedColor = 'transparent'
          } else {
            this.requestData.category = 3
            this.nurseColor = 'primary'
             this.generalColor = 'transparent'
             this.specializedColor = 'transparent'
          }
        }
          

      }
    },
    computed: {
      now(){
        var today = new Date();
        var now = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return now
      },
    }

  }
</script>
