<template>
  <div class="dashboard">
  <v-snackbar v-model="snackbar" :timeout="4000" top :color="color">
    <span>{{message}}</span>
  </v-snackbar>
    <v-dialog 
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
      v-model="profileDialog">
      <v-card>
        <v-toolbar
          flat
          dark
          class="secondary"
        >
          <v-toolbar-title>Request Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            dark
            @click="profileDialog = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="height: 100%; padding: 0px">
          <div v-if="profileDialog == true">
            <v-img
              height="100%"
              src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
            >
              <v-layout column>
                <v-flex xs12>
                  <v-avatar
                    class="profile"
                    color="grey"
                    size="164"
                    tile
                  >
                    <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
                  </v-avatar>
                </v-flex>
                <v-flex xs12>
                  <div class="ma-2" v-if="$can('individual_request_service')">
                    <div class="title white--text">{{profile.recipient.first_name}} {{profile.recipient.last_name}}</div>
                    <div class="white--text">{{profile.recipient.health_worker_profile.worker_category.name}} - {{profile.recipient.health_worker_profile.worker_sub_category.name}}</div>
                  </div>
                  <div class="ma-2" v-if="$can('receive_service')">
                    <div class="title white--text">{{profile.requester.first_name}} {{profile.requester.last_name}}</div>
                  </div>
                </v-flex>
              </v-layout>
            </v-img>
              <v-container>
                <div v-if="$can('individual_request_service')">{{profile.recipient.health_worker_profile.bio}}</div>
                <div class="my-4 subtitle-1 black--text" v-if="$can('individual_request_service')">
                  {{profile.recipient.health_worker_profile.residence}}
                </div>
                <div v-if="$can('individual_request_service')">
                  <v-rating
                    :value="profile.rating"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>
                </div>
                <div class="grey--text" v-if="$can('individual_request_service')"><v-icon small left>people</v-icon>{{profile.rating.toFixed(1)}}/5 ({{profile.reviewers}})</div>
                <div v-if="$can('receive_service')"><v-icon small left>local_phone</v-icon>{{profile.requester.phone_no}}</div>
                <div v-if="profile.status_id == 1 || profile.status_id == 2"><v-icon small left>my_location</v-icon>{{profile.distance.toFixed(2)}}Km away</div>

                <div v-if="$can('receive_service') && profile.status_id == 1">
                  <v-layout row wrap>
                    <v-flex xs6>
                      <v-btn block depressed class="green white--text text-none mr-1" :loading="acceptLoading" @click="acceptRequest(profile.id)">Accept</v-btn>
                    </v-flex>
                    <v-flex xs6>
                      <v-btn block depressed class="red white--text text-none ml-1" :loading="rejectLoading" @click="rejectRequest(profile.id)">Reject</v-btn>
                    </v-flex>
                  </v-layout>
                </div>
                <div v-if="$can('receive_service') && profile.status_id == 2">
                  <v-layout row wrap>
                    <v-flex xs6>
                      <v-btn block depressed class="green white--text text-none mr-1" :loading="completeLoading" @click="completeRequest(profile.id)">Complete</v-btn>
                    </v-flex>
                    <v-flex xs6>
                      <v-btn block depressed class="red white--text text-none ml-1" :loading="cancelLoading" @click="cancelRequest(profile.id)">Cancel</v-btn>
                    </v-flex>
                  </v-layout>
                </div>
            
                <v-divider class="mx-1 my-2"></v-divider>
                  <div v-if="profile.status_id == 1 || profile.status_id == 2">
                    <v-map v-if="$can('individual_request_service')" ref="myMapRef" style="position: absolute; width: 92%; height: 180px; z-index: 2" :center="[profile.workerLocation[0], profile.workerLocation[1]]" :zoom="15">
                      <v-icondefault class="mt-5"></v-icondefault>
                      <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                      <v-marker
                        ref = "myMarker"
                        :lat-lng="[profile.workerLocation[0], profile.workerLocation[1]]"
                        :icon="icon"
                      >
                        <v-popup :content="profile.recipient.first_name"></v-popup>
                      </v-marker>
                    </v-map>
                    <v-map v-if="$can('receive_service')" ref="myMapRef" style="position: absolute; width: 92%; height: 250px; z-index: 2" :center="[profile.latitude, profile.longitude]" :zoom="15">
                      <v-icondefault class="mt-5"></v-icondefault>
                      <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                      <v-marker
                          ref = "myMarker"
                          :lat-lng="[profile.latitude, profile.longitude]"
                          :icon="icon"
                        >
                        <v-popup :content="profile.requester.first_name"></v-popup>
                      </v-marker>
                    </v-map>
                  </div>
                  <div v-if="profile.status_id == 3 && profile.hasRated == 0">
                  <div align="center" class="my-3"><b>Review</b></div>
                    <v-layout column>
                      <v-flex xs12>
                        <v-layout row wrap>
                          <v-flex xs3>
                            <div class="grey--text mt-1">Rating</div>
                          </v-flex>
                          <v-flex xs9>
                            <v-rating 
                              color="yellow darken-3"
                              small 
                              v-model="review.userRating"></v-rating>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex xs12>
                        <v-layout row wrap>
                          <v-flex xs3>
                            <div class="grey--text">Comment</div>
                          </v-flex>
                          <v-flex xs9>
                            <v-layout column>
                              <v-flex xs12>
                                <v-textarea
                                  class="mt-1"
                                  v-model="review.userComment"
                                  name="comment"
                                  outline
                                ></v-textarea>
                              </v-flex>
                              <v-flex xs12>
                                <v-btn depressed block class="primary text-none" :loading="ratingLoader" @click="saveRating(profile.id)">Save</v-btn>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                    
                    
                  </div>
              </v-container>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-container>
      <div v-if="$can('individual_request_service')">
        <v-tabs
          color="transparent"
          grow
          dark
          slider-color="primary"
          show-arrows
        >
          <v-tab
            v-for="tab in tabs"
            :key="tab.id"
            ripple
            @click="updateTab(tab.id)"
            >
            <div class="text-none black--text">{{ tab.name }}</div>
          </v-tab>
          <v-tab-item
            :transition="false" :reverse-transition="false"
            :key="tab.id"
            v-for="tab in tabs"
          >
          </v-tab-item>
        </v-tabs>
      </div>
      <div v-if="$can('receive_service')">
        <v-tabs
          color="transparent"
          grow
          dark
          slider-color="primary"
          show-arrows
        >
          <v-tab
            v-for="tab in tabs2"
            :key="tab.id"
            ripple
            @click="updateTab(tab.id)"
            >
            <div class="text-none black--text">{{ tab.name }}</div>
          </v-tab>
          <v-tab-item
            :transition="false" :reverse-transition="false"
            :key="tab.id"
            v-for="tab in tabs"
          >
          </v-tab-item>
        </v-tabs>
      </div>
      <div v-if="activeTab == 1 && $can('individual_request_service')" class="mt-2">
        <v-layout column>
          <div class="mt-2"><v-icon small class="mr-2 orange--text">lens</v-icon>Pending</div>
          <v-divider class="my-2"></v-divider>
          <template v-for="(worker, index) in allIndividualUpcoming">
            <v-flex xs12 class="mb-1" v-if="worker.status_id == 1">
              <v-card
                elevation="0"
                class="grey lighten-4 login-circle pa-2"
                @click="goToProfile(index)"
              >
                <v-layout row wrap>
                  <v-flex xs3>
                    <v-avatar
                      size="70"
                      color="grey lighten-4"
                    >
                      <img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" alt="avatar">
                    </v-avatar>
                  </v-flex>
                  <v-flex xs9>
                    <div><b>{{worker.recipient.first_name}} {{worker.recipient.last_name}}</b></div>
                    <div class="grey--text">{{worker.recipient.health_worker_profile.worker_category.name}} - {{worker.recipient.health_worker_profile.worker_sub_category.name}}</div>
                    <div>
                      <v-rating
                      :value="worker.rating"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                      ></v-rating>
                    </div>
                    <div class="mt-2">{{worker.recipient.health_worker_profile.bio.substring(0,80)+".."}}</div>
                    <div class="mt-1"><v-icon small class="mr-2">access_time</v-icon>{{worker.from}} - {{worker.to}} Hrs</div>
                    <div class="mt-1"><v-icon small class="mr-2">my_location</v-icon>{{worker.distance.toFixed(2)}}Km from Destination</div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </template>
          
          <div class="mt-2"><v-icon small class="mr-2 green--text">lens</v-icon>Active</div>
          <v-divider class="my-2"></v-divider>
          
          <template v-for="(worker, index) in allIndividualUpcoming">
            <v-flex xs12 class="mb-1" v-if="worker.status_id == 2">
              <v-card
                elevation="0"
                class="grey lighten-4 login-circle pa-2"
                @click="goToProfile(index)"
              >
                <v-layout row wrap>
                  <v-flex xs3>
                    <v-avatar
                      size="70"
                      color="grey lighten-4"
                    >
                      <img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" alt="avatar">
                    </v-avatar>
                  </v-flex>
                  <v-flex xs9>
                    <div><b>{{worker.recipient.first_name}} {{worker.recipient.last_name}}</b></div>
                    <div class="grey--text">{{worker.recipient.health_worker_profile.worker_category.name}} - {{worker.recipient.health_worker_profile.worker_sub_category.name}}</div>
                    <div>
                      <v-rating
                      :value="worker.rating"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                      ></v-rating>
                    </div>
                    <div class="mt-2">{{worker.recipient.health_worker_profile.bio.substring(0,80)+".."}}</div>
                    <div class="mt-1"><v-icon small class="mr-2">access_time</v-icon>{{worker.from}} - {{worker.to}} Hrs</div>
                    <div class="mt-1"><v-icon small class="mr-2">my_location</v-icon>{{worker.distance.toFixed(2)}}Km from Destination</div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </div>
      <div v-if="activeTab == 1 && $can('receive_service')" class="mt-2">
        <v-layout column>
          <div class="mt-2"><v-icon small class="mr-2 orange--text">lens</v-icon>New</div>
          <v-divider class="my-2"></v-divider>
          <template v-for="(client, index) in allWorkerUpcoming">
            <v-flex xs12 class="mb-1" v-if="client.status_id == 1">
              <v-card
                elevation="0"
                class="grey lighten-4 login-circle pa-2"
                @click="goToIndividualProfile(index)"
              >
                <v-layout row wrap>
                  <v-flex xs3>
                    <v-avatar
                      size="70"
                      color="grey lighten-4"
                    >
                      <img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" alt="avatar">
                    </v-avatar>
                  </v-flex>
                  <v-flex xs9>
                    <div><b>{{client.requester.first_name}} {{client.requester.last_name}}</b></div>
                    <div class="mt-1"><v-icon small class="mr-2">access_time</v-icon>{{client.from}} - {{client.to}} Hrs</div>
                    <div class="mt-1"><v-icon small class="mr-2">my_location</v-icon>{{client.distance.toFixed(2)}}Km Away</div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </template>
          
          <div class="mt-2"><v-icon small class="mr-2 green--text">lens</v-icon>Active</div>
          <v-divider class="my-2"></v-divider>
          
          <template v-for="(client, index) in allWorkerUpcoming">
            <v-flex xs12 class="mb-1" v-if="client.status_id == 2">
              <v-card
                elevation="0"
                class="grey lighten-4 login-circle pa-2"
                @click="goToIndividualProfile(index)"
              >
                <v-layout row wrap>
                  <v-flex xs3>
                    <v-avatar
                      size="70"
                      color="grey lighten-4"
                    >
                      <img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" alt="avatar">
                    </v-avatar>
                  </v-flex>
                  <v-flex xs9>
                    <div><b>{{client.requester.first_name}} {{client.requester.last_name}}</b></div>
                    
                    <div class="mt-1"><v-icon small class="mr-2">access_time</v-icon>{{client.from}} - {{client.to}} Hrs</div>
                    <div class="mt-1"><v-icon small class="mr-2">my_location</v-icon>{{client.distance.toFixed(2)}}Km from Destination</div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </div>
      <div v-if="activeTab == 2 && $can('individual_request_service')" class="mt-2">
        <v-layout column>
          <template v-for="(worker, index) in allIndividualHistorical">
            <v-flex xs12 class="mb-1">
              <v-card
                elevation="0"
                class="grey lighten-4 login-circle pa-2"
                @click="goToHProfile(index)"
              >
                <v-layout row wrap>
                  <v-flex xs3>
                    <v-avatar
                      size="70"
                      color="grey lighten-4"
                    >
                      <img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" alt="avatar">
                    </v-avatar>
                  </v-flex>
                  <v-flex xs9>
                    <div><b>{{worker.recipient.first_name}} {{worker.recipient.last_name}}</b></div>
                    <div class="grey--text">{{worker.recipient.health_worker_profile.worker_category.name}} - {{worker.recipient.health_worker_profile.worker_sub_category.name}}</div>
                    <div>
                      <v-rating
                      :value="worker.rating"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                      ></v-rating>
                    </div>
                    <div class="mt-1"><v-icon small class="mr-2">calendar_today</v-icon>{{formattedDate(worker.created_at)}}</div>
                    <div class="mt-1"><v-icon small class="mr-2">access_time</v-icon>{{worker.from}} - {{worker.to}} Hrs</div>
                    
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </div>
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
    import format from 'date-fns/format'
    import { mapGetters, mapActions } from 'vuex'

    import * as Vue2Leaflet from 'vue2-leaflet'
    import { latLng, Icon, icon } from 'leaflet'
    import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
    import iconUrl from 'leaflet/dist/images/marker-icon.png'
    import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

    delete Icon.Default.prototype._getIconUrl;

    Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    });

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
            return{
                snackbar: false,
                message: '',
                color: '',
                loading: false,

                review: {
                  userRating: null,
                  userComment: null
                },

                acceptLoading: false,
                rejectLoading: false,
                completeLoading: false,
                cancelLoading: false,
                ratingLoader: false,

                profileDialog: false,

                activeTab: 1,

                tabs: [
                  {id: 1, name: 'Pending/Active'},
                  {id: 2, name: 'Historical'},
                ],

                tabs2: [
                  {id: 1, name: 'New/Active'},
                  {id: 2, name: 'Historical'},
                ],

                profile: {},

                popupName: null,
                icon: customicon,
                clusterOptions: {},

                profileIndex: null
            }
        },
        created(){
          this.initialize()
        },
        
        methods:{
           ...mapActions(['fetchIndividualUpcoming', 'fetchIndividualHistorical', 'fetchWorkerUpcoming', 'fetchWorkerHistorical']),
          initialize(){
            this.fetchIndividualUpcoming()
            this.fetchIndividualHistorical()
            this.fetchWorkerUpcoming()
          },
          goToProfile(index){
            this.profile = this.allIndividualUpcoming[index]
            this.profileDialog = true
          },
          goToHProfile(index){
            this.profileIndex = index
            this.profile = this.allIndividualHistorical[index]
            this.profileDialog = true
          },
          goToIndividualProfile(index){
            this.profile = this.allWorkerUpcoming[index]
            this.profileDialog = true
          },
          updateTab(tab){
            if(tab == 1){
              this.activeTab = 1
            } else {
              this.activeTab = 2
            }
          },
          saveRating(id){
            this.review.workerId = id
            if (this.review.userRating == null){
              this.message = "Please add a Rating"
              this.color="error"
              this.snackbar = true
            }else{
              this.ratingLoader = true
              apiCall({url: '/api/userRating', data: this.review, method: 'POST' })
              .then(resp => {
                this.profile.hasRated = 1
                this.message = "Review added Successfully"
                this.color="success"
                this.snackbar = true
                this.ratingLoader = false
                this.fetchIndividualHistorical()
                setTimeout(() => {
                  this.profile = this.allIndividualHistorical[this.profileIndex]
                  this.fetchIndividualUpcoming()
                }, 2000);
                
              })
              .catch(error => {
                this.ratingLoader = false
              })
            }
          },
          completeRequest(id){
            this.completeLoading = true
            var formData = {
              type: 'complete'
            }
            apiCall({url: '/api/userRequest/'+id, data: formData, method: 'PUT' })
              .then(resp => {
                this.completeLoading = false
                this.profileDialog = false
                this.fetchWorkerUpcoming()
              })
              .catch(error => {
                this.completeLoading = false
              })
          },
          cancelRequest(id){
            this.cancelLoading = true
            var formData = {
              type: 'cancel'
            }
            apiCall({url: '/api/userRequest/'+id, data: formData, method: 'PUT' })
              .then(resp => {
                this.cancelLoading = false
                this.profileDialog = false
                this.fetchWorkerUpcoming()
                this.fetchWorkerHistorical()
              })
              .catch(error => {
                this.cancelLoading = false
              })
          },
          acceptRequest(id){
            this.acceptLoading = true
            var formData = {
              type: 'accept'
            }
            apiCall({url: '/api/userRequest/'+id, data: formData, method: 'PUT' })
              .then(resp => {
                this.acceptLoading = false
                this.profileDialog = false
                this.fetchWorkerUpcoming()
              })
              .catch(error => {
                this.acceptLoading = false
              })
          },
          rejectRequest(id){
            this.rejectLoading = true
            var formData = {
              type: 'reject'
            }
            apiCall({url: '/api/userRequest/'+id, data: formData, method: 'PUT' })
              .then(resp => {
                this.rejectLoading = false
                this.profileDialog = false
                this.fetchWorkerUpcoming()
              })
              .catch(error => {
                this.rejectLoading = false
              })
          },
          formattedDate(date){
        	  return date ? format(date, 'Do MMM YYYY') : ''
    	    },
        },
        computed: {
        ...mapGetters(['allIndividualUpcoming', 'allIndividualHistorical', 'allWorkerUpcoming', 'allWorkerHistorical']),
        }
    }
</script>