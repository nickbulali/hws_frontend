<template>
  <div class="dashboard">
  <v-snackbar v-model="snackbar" :timeout="4000" top :color="color">
    <span>{{message}}</span>
  </v-snackbar>
  <v-dialog
      v-model="commentsLoader"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="secondary"
        dark
      >
        <v-card-text>
          Fetching Comments..
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  <v-dialog
      v-model="filterDialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="secondary"
        dark
      >
        <v-card-text>
          Applying Filter
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="workerlistDialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="secondary"
        dark
      >
        <v-card-text>
          Finding Professionals..
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  <v-dialog 
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    v-model="commentsDialog">
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
        >
          <v-icon color="secondary">keyboard_backspace</v-icon>
        </v-btn>
        <v-toolbar-title>Comments</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          dark
          @click="commentsDialog = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-layout column>
            <div v-if="workerComments.length == 0">No Comments</div>
            <v-flex xs12 v-for="(comment, index) in workerComments" :key="index" class="mb-1">
              <v-card
                elevation="0"
                class="grey lighten-4 login-circle pa-2"
              >
                <v-layout row wrap>
                  <v-flex xs3>
                    <v-avatar
                      size="70"
                      color="grey lighten-4"
                    >
                      <img :src="path+'/pictures/'+comment.client.image" alt="avatar">
                    </v-avatar>
                  </v-flex>
                  <v-flex xs9>
                    <div><b>{{comment.client.first_name}} {{comment.client.last_name}}</b></div>
                    <div>
                      <v-rating
                      :value="comment.rating"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                      ></v-rating>
                    </div>
                    <div>{{formattedDate(comment.created_at)}}</div>
                    <div class="mt-2">{{comment.comment}}</div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>

      </v-card-text>
    </v-card>
  </v-dialog>




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
          v-if="progress != 'Time' && progress != 'Category' && progress !='hospitalList' && progress != 'Worker List' && progress != 'Profile'"
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
          v-if="progress == 'hospitalList'"
          @click="backHospitallList"
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
        <v-btn
          icon
          dark
          v-if="progress == 'Worker List'"
          @click="showCategories"
        >
          <v-icon>keyboard_backspace</v-icon>
        </v-btn>
        <v-btn
          icon
          dark
          v-if="progress == 'Profile'"
          @click="showWorkerList"
        >
          <v-icon>keyboard_backspace</v-icon>
        </v-btn>
        <v-toolbar-title>New Request</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="seeHospitalList" icon flat>
          <v-badge
            v-if="$can('hospital_request_service')"
            overlap
            color="red">
            <v-icon
              color="white"
            >
              assignment
            </v-icon>
            <span slot="badge" v-if="hospitalWorkerList.length !=0"> {{hospitalWorkerList.length}} </span>
          </v-badge>
        </v-btn>
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
              <v-map ref="myMapRef" style="position: absolute; width: 92%; height: 85%; z-index: 2" :center="[latitude, longitude]" :zoom="15">
                <v-icondefault class="mt-5"></v-icondefault>
                <v-tilelayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></v-tilelayer>
                <v-marker  
                  ref = "myMarker"
                  :lat-lng="[latitude, longitude]"
                  :icon="icon"
                  :draggable='true'
                >
                  <v-popup content="Me"></v-popup>
                </v-marker>
                  <v-btn class="primary white--text text-none" style="position: absolute; z-index: 500; bottom: 5%;" block  @click="newPos">Next</v-btn>
              </v-map>
            </v-flex>
          </v-layout>
        </div>
        <div v-if="progress == 'Time'">
          <v-layout column>
              <v-flex xs12>
                <p class="headline">Request Date/Time</p>
              </v-flex>
              <v-flex xs12>
                <v-flex xs12>
                  <div v-if="progress == 'Time'">
                  <v-layout row wrap>
                    <v-flex xs5>
                      <div class="mt-2">
                        <v-icon>calendar_today</v-icon>
                        Start Date
                      </div>                      
                    </v-flex>
                    <v-flex xs7>
                      <v-menu
                        :nudge-left="60"
                        transition="scale-transition"
                      >
                        <v-text-field
                          :rules="inputRules"
                          :value="formattedStratDate"
                          slot="activator"
                          single-line
                          hide-details
                          class="input_field"
                          readonly
                        ></v-text-field>
                        <v-date-picker
                          color="secondary"
                          v-model="requestData.dateFrom"
                          :min="dateToday"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>                    
                  </div>
                </v-flex>
                <div v-if="progress == 'Time'">
                <v-layout row wrap>
                  <v-flex xs5>
                      <div class="mt-2">
                        <v-icon>access_time</v-icon>
                        Start Time
                      </div>                      
                    </v-flex>
                    <v-flex xs7>
                      <v-menu
                        ref="startTime"
                        v-model="menu1"
                        :close-on-content-click="false"
                        :return-value.sync="requestData.from"
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                        :nudge-left="80"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="requestData.from"
                            readonly
                            v-on="on"
                            single-line
                            hide-details
                            class="input_field"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="menu1"
                          v-model="requestData.from"
                          :allowed-minutes="allowedStep"
                          full-width
                          color="secondary"
                          @click:minute="$refs.startTime.save(requestData.from)"
                          format="24hr"
                          :min="now"
                        ></v-time-picker>
                      </v-menu>
                    </v-flex>
                </v-layout>
                  
                </div>
              </v-flex>
              <v-divider class="my-2"></v-divider>
              <v-flex xs12>
              <v-layout row wrap>
                    <v-flex xs5>
                      <div class="mt-2">
                        <v-icon>calendar_today</v-icon>
                        Finish Date
                      </div>                      
                    </v-flex>
                    <v-flex xs7>
                      <v-menu
                        :nudge-left="60"
                        transition="scale-transition"
                      >
                        <v-text-field
                          :rules="inputRules"
                          :value="formattedEndDate"
                          slot="activator"
                          single-line
                          hide-details
                          class="input_field"
                          readonly
                        ></v-text-field>
                        <v-date-picker
                          color="secondary"
                          v-model="requestData.dateTo"
                          :min="requestData.dateFrom"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                <div v-if="progress == 'Time'">
                <v-layout row wrap>
                  <v-flex xs5>
                    <div class="mt-2">
                      <v-icon>access_time</v-icon>
                      Finish Time
                    </div>                      
                  </v-flex>
                  <v-flex xs7>
                    <v-menu
                    ref="endTime"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :return-value.sync="requestData.to"
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                    :nudge-left="80"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="requestData.to"
                        readonly
                        v-on="on"
                        single-line
                        hide-details
                        class="input_field"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu2"
                      v-model="requestData.to"
                      :allowed-minutes="allowedStep"
                      full-width
                      color="secondary"
                      @click:minute="$refs.endTime.save(requestData.to)"
                      format="24hr"
                      :min="endMin"
                    ></v-time-picker>
                  </v-menu>
                  </v-flex>
                </v-layout>
                  
                </div>
              </v-flex>
          </v-layout>
          <v-btn class="primary white--text text-none mx-5" style="position: absolute; bottom: 5%; left:-12%"  block @click="selectCategory">Next</v-btn>
        </div>
        <div v-if="progress == 'Category'">
          <v-layout column>
            <v-flex xs12>
              <p class="headline">Pick Category</p>
            </v-flex>
            <v-flex xs12>
              <v-layout column>
                <v-flex xs12  class="mb-2">
                  <v-layout row wrap>
                    <v-flex xs5 class="mt-2">
                    <v-card
                        elevation="0"
                        @click="pickCategory(1)"
                        :color="doctorColor" class="white--text login-circle"
                      >
                        <v-card-text>
                        <div align="center" class="mt-3">
                            <v-img
                              src="doctor.png"
                              aspect-ratio="0.7"
                            ></v-img>
                          </div>
                          <div>
                            <div align="center" class="secondary--text title mb-1 mt-2">Doctor</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-divider vertical class="mx-4"></v-divider>
                    <v-flex xs5 class="mt-2">
                      <v-card
                        elevation="0"
                        @click="pickCategory(2)"
                        :color="nurseColor" class="white--text login-circle"
                      >
                        <v-card-text>
                        <div align="center" class="mt-3">
                            <v-img
                              src="nurse.png"
                              aspect-ratio="0.7"
                            ></v-img>
                          </div>
                          <div>
                            <div align="center" class="secondary--text title mb-1 mt-2">Nurse</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="mt-1">
                  <v-layout row wrap>
                    <v-flex xs5>
                      <v-divider></v-divider>
                      <v-card
                        elevation="0"
                        @click="pickCategory(3)"
                        :color="clinicalOfficerColor" class="white--text login-circle"
                      >
                        <v-card-text>
                        <div align="center" class="mt-3">
                            <v-img
                              src="clinical.png"
                              aspect-ratio="0.7"
                            ></v-img>
                          </div>
                          <div>
                            <div align="center" class="secondary--text title mb-1 mt-2">Clinical Officer</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-divider vertical class="mx-4 mt-3"></v-divider>
                    <v-flex xs5>
                      <v-divider></v-divider>
                      <v-card
                        elevation="0"
                        @click="pickCategory(4)"
                        :color="pharmacistColor" class="white--text login-circle"
                      >
                        <v-card-text>
                        <div align="center" class="mt-3">
                            <v-img
                              src="pharmacist.png"
                              aspect-ratio="0.7"
                            ></v-img>
                          </div>
                          <div>
                            <div align="center" class="secondary--text title mb-1 mt-2 mb-4">Pharmacist</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <!--
            <v-flex 12>
              <v-btn class="primary white--text text-none mx-5" style="position: absolute; bottom: 5%; left:-12%"  block @click="listWorkers" :loading="loading">Next</v-btn>
            </v-flex>
            -->
          </v-layout>
        </div>
        <div v-if="progress == 'hospitalList'">
          <v-layout column>
            <div v-if="hospitalWorkerList.length == 0">List is Empty</div>
            <v-flex xs12 v-for="(worker, index) in hospitalWorkerList" :key="index" class="mb-1">
              <v-card
                elevation="0"
                class="grey lighten-4 login-circle pa-2"
              >
                <v-layout row wrap>
                  <v-flex xs3>
                    <v-avatar
                      size="70"
                      color="grey lighten-4"
                    >
                      <img :src="path+'/pictures/'+worker.recipient.image" alt="avatar">
                    </v-avatar>
                  </v-flex>
                  <v-flex xs9>
                    <div><b>{{worker.recipient.first_name}} {{worker.recipient.last_name}}</b></div>
                    <div class="grey--text">{{worker.health_worker_profile.worker_category.name}} - {{worker.health_worker_profile.worker_sub_category.name}}</div>
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
                    <div class="mt-2">{{worker.health_worker_profile.bio.substring(0,80)+".."}}</div>
                    <div class="mt-1"><v-icon small class="mr-2">my_location</v-icon>{{worker.distance.toFixed(2)}}Km</div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-divider class="mx-4"></v-divider>
              <div align="center">
                  <v-btn
                    :loading="loading"
                    depressed
                    class="primary white--text text-none mt-2"
                    text
                    @click="completeHospitalRequest"
                  >
                    Complete
                    <v-icon right class="white--text">
                      done_all
                    </v-icon>
                  </v-btn>
              </div>
            </v-flex>
          </v-layout>   
        </div>
        <div v-if="progress == 'Worker List'">
          <v-layout column>
            <div v-if="workers.length == 0">No Results Found</div>
            <v-flex xs12 v-for="(worker, index) in workers" :key="index" class="mb-1">
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
                      <img :src="path+'/pictures/'+worker.image" alt="avatar">
                    </v-avatar>
                  </v-flex>
                  <v-flex xs9>
                    <div><b>{{worker.first_name}} {{worker.last_name}}</b></div>
                    <div class="grey--text">{{worker.health_worker_profile.worker_category.name}} - {{worker.health_worker_profile.worker_sub_category.name}}</div>
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
                    <div class="mt-2">{{worker.health_worker_profile.bio.substring(0,80)+".."}}</div>
                    <div class="mt-1"><v-icon small class="mr-2">my_location</v-icon>{{worker.distance.toFixed(2)}}Km</div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <div v-if="workersLength" class="text-xs-center">
                  <v-pagination
                    :length="workersLength"
                    total-visible="5"
                    v-model="workersPagination.current_page"
                    @input="filterResults"
                    circle>
                  </v-pagination>
                </div>
            </v-flex>
            <v-flex xs12>
              <v-btn block depressed class="primary white--text text-none" @click="sheet = !sheet">
                Filters
              </v-btn>
            </v-flex>
            
            <v-bottom-sheet v-model="sheet">
              <v-sheet class="text-center">
                <div class="pa-2">
                  <v-layout column>
                    <v-flex xs12 class="my-1">
                      <v-layout row wrap>
                        <v-flex xs3>
                          <div class="grey--text mt-2">Gender</div>
                        </v-flex>
                        <v-flex xs9>
                          <v-chip :outline="maleOutline" :dark="darkMale" color="secondary" @click="filterGender(1)">Male</v-chip>
                          <v-chip :outline="femaleOutline" :dark="darkFemale" color="secondary" @click="filterGender(2)">Female</v-chip>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-divider class="grey--text"></v-divider>
                    <v-flex xs12 class="my-1">
                      <v-layout row wrap>
                        <v-flex xs3>
                          <div class="grey--text mt-2">Distance</div>
                        </v-flex>
                        <v-flex xs9>
                          <v-chip :outline="outline5km" :dark="dark5km" color="secondary" @click="filterDistance(1)">5Km</v-chip>
                          <v-chip :outline="outline10km" :dark="dark10km" color="secondary" @click="filterDistance(2)">10km</v-chip>
                          <v-chip :outline="outline15km" :dark="dark15km" color="secondary" @click="filterDistance(3)">15km</v-chip>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <!-- <v-divider class="grey--text"></v-divider>
                    <v-flex xs12 class="my-1">
                      <v-layout row wrap>
                        <v-flex xs3>
                          <div class="grey--text mt-2">Rating</div>
                        </v-flex>
                        <v-flex xs9>
                          <v-chip outline color="secondary">
                            Ascending
                          </v-chip>
                          <v-chip outline color="secondary">
                            Descending
                          </v-chip>
                        </v-flex>
                      </v-layout>
                    </v-flex> -->
                    <v-divider class="grey--text"></v-divider>
                    <v-flex xs12 class="my-1">
                      <v-layout row wrap>
                        <v-flex xs3>
                          <div class="grey--text mt-2">Sub Group</div>
                        </v-flex>
                        <v-flex xs9>
                          <template v-for="(job, index) in subjobs.worker_sub_category">
                            <v-chip v-if="subIndex == index" dark color="secondary" @click="filterBySubGroup(job.id, index)">{{job.name}}</v-chip>
                            <v-chip v-else outline color="secondary" @click="filterBySubGroup(job.id, index)">{{job.name}}</v-chip>
                          </template>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12>
                      <v-btn block depressed class="primary white--text text-none" @click="resetFilter" :loading="loading">
                        Reset Filters
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </div>
              </v-sheet>
            </v-bottom-sheet>
          </v-layout>           
        </div>
        <div v-if="progress == 'Profile'">
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
                  <v-img :src="path+'/pictures/'+profile.image"></v-img>
                </v-avatar>
              </v-flex>
              <v-flex xs12>
                <div class="ma-2">
                  <div class="title white--text">{{profile.first_name}} {{profile.last_name}}</div>
                  <div class="white--text">{{profile.health_worker_profile.worker_category.name}} - {{profile.health_worker_profile.worker_sub_category.name}}</div>
                </div>
              </v-flex>
            </v-layout>
          </v-img>
          
          <div class="mt-3">{{profile.health_worker_profile.bio}}</div>
          <div class="my-4 subtitle-1 black--text">
            {{profile.health_worker_profile.residence}}
          </div>
          <div>
            <v-rating
              :value="profile.rating"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>
            <div class="mt-2" @click="showComments(profile)"><a>Comments</a></div>
          </div>
          <div class="grey--text mt-2"><v-icon small left>people</v-icon>{{profile.rating.toFixed(1)}}/5 ({{profile.reviewers}})</div>
          <div class="mt-2"><v-icon small left>my_location</v-icon>{{profile.distance.toFixed(2)}}Km away</div>
          <div class="mt-2"><v-icon small left>money</v-icon>Kshs {{profile.rate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}/Hr</div>
        
        <v-divider class="mx-4"></v-divider>
      
            <div align="center">
                <v-btn
                  v-if="$can('individual_request_service')"
                  :loading="loading"
                  depressed
                  class="primary white--text text-none mt-2"
                  text
                  @click="completeRequest"
                >
                  Complete
                  <v-icon right class="white--text">
                    done_all
                  </v-icon>
                </v-btn>
                <v-btn
                  v-if="$can('hospital_request_service')"
                  :loading="loading"
                  depressed
                  class="primary white--text text-none mt-2"
                  text
                  @click="addHospitalList"
                >
                  Add to List
                  <v-icon right class="white--text">
                    assignment
                  </v-icon>
                </v-btn>
            </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  	<v-container class="my-2">
  		<v-layout column>
      <div v-if="$can('receive_service')" class="mb-2">
          <v-layout column>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-avatar
                    class="profile"
                    color="grey"
                    size="164"
                    tile
                  >
                    <v-img :src="path+'/pictures/'+stats.image">
                      <v-icon v-if="stats.profile.active == 1" small style="position: absolute; right: 2px;" class="green--text">lens</v-icon>
                      <v-icon v-if="stats.profile.active == 0" small style="position: absolute; right: 2px;" class="red--text">lens</v-icon>
                    </v-img>
                  </v-avatar>
                </v-flex>
                <v-flex xs6>
                  <v-layout column>
                    <v-flex xs12>
                      <div align="center" class="grey--text headline">{{stats.first_name}} {{stats.last_name}}</div>
                    </v-flex>
                    <v-flex xs12 class="mt-4">
                      <v-layout row wrap>
                    
                    <v-flex xs6>
                      <v-layout column>
                        <v-flex xs12>
                          <div align="center" class="grey--text title">
                            Visits
                          </div>
                        </v-flex>
                        <v-flex xs12>
                          <div align="center" class="grey--text">
                            {{stats.totalVisits}}
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs6>
                      <v-layout column>
                        <v-flex xs12>
                          <div align="center" class="grey--text title">
                            Rating
                          </div>
                        </v-flex>
                        <v-flex xs12>
                          <div align="center" class="grey--text">
                            {{stats.rating.toFixed(1)}}/5
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                    </v-flex>
                  </v-layout>
                  
                  <v-divider></v-divider>
                  <div>
                    <v-btn depressed block class="text-none orange darken-4 white--text" :loading="offlineLoading" v-if="stats.profile.active == 1" @click="goOffline">
                      Go Offline
                      <v-icon right small>settings_ethernet</v-icon>
                    </v-btn>
                    <v-btn depressed block class="text-none green darken-1 white--text" :loading="onlineLoading" v-if="stats.profile.active == 0" @click="goOnline">
                      Go Online
                      <v-icon right small>settings_input_antenna</v-icon>
                    </v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>
  		  <v-flex xs12>
          <div align="center" class="mt-3">
            <v-img
             src="logo.png"
                  aspect-ratio="1"
                  max-width="200"
            ></v-img>
          </div>

           <div class="title white--text"> Welcome {{getProfile.first_name}} {{getProfile.last_name}}</div>
        </v-flex>
        <div v-if="$can('individual_request_service') || $can('hospital_request_service')">
          <div>
            <v-flex xs12 class="mt-4">
              <div class="primary login-circle mt-5" @click="newRequest">
                <v-layout row wrap>
                  <v-flex xs3>
                    <div align="center" class="mt-3">
                      <v-img
                        src="pin.png"
                        aspect-ratio="0.8"
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
            <!--<v-flex xs12>
              <div class="primary login-circle mt-3">
                <v-layout row wrap>
                  <v-flex xs3>
                    <div align="center" class="mt-3 mb-4">
                      <v-img
                        src="map.png"
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
            </v-flex>-->
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
  import 'leaflet/dist/leaflet.css'
  import format from 'date-fns/format'

  import * as Vue2Leaflet from 'vue2-leaflet'
  import { latLng, Icon, icon } from 'leaflet'
  import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
  import iconUrl from 'leaflet/dist/images/marker-icon.png'
  import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

  Vue.component('v-marker-cluster', Vue2LeafletMarkerCluster)

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

      return {
        path: process.env.VUE_APP_API_URL,
        commentsLoader: false,
        filterDialog: false,
        commentsDialog: false,
        workerlistDialog: false,

        offlineLoading: false,
        onlineLoading: false,
        maleOutline: true,
        femaleOutline: true,
        darkMale: false,
        darkFemale: false,

        outline5km: true,
        outline10km: true,
        outline15km: true,
        dark5km: false,
        dark10km: false,
        dark15km: false,

        subIndex: -1,
        subOutline: true,

        requestDialog: false,
        menu1: false,
        menu12: false,
        menu2: false,
        sheet: false,
        //showMap: false,
        color: '',

        snackbar: false,
        message: '',
        color: '',
        loading: false,

        doctorColor: 'transparent',
        nurseColor: 'transparent',
        clinicalOfficerColor: 'transparent',
        pharmacistColor: 'transparent',

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
          dateFrom: null,
          dateTo: null,

          from: null,
          to: null,
          category: null,
          workerId: null,

          genderId: null,
          distance: 50,
          subGroup: null,
        },

        workers: [],
        hospitalWorkerList: [],
        profile: {},

        workersPagination: {
          search: ' ',
          current_page: 1,
          per_page: 0,
          total: 0,
          visible: 10
        },
        workerComments: [],
        workerCommentsPagination: {
          search: ' ',
          current_page: 1,
          per_page: 0,
          total: 0,
          visible: 10
        },
        currentProgress: '',

        inputRules: [
          v=>v.length >= !v || 'Field is required'
        ],
        months: ["01","02","03","04","05","06","07","08","09","10","11","12"]
      }
    },
    created(){
      navigator.geolocation.getCurrentPosition(this.currentPosition);
      this.initialize()
    },
    mounted () {
          
        },
    watch: {
      
    },
    methods:{
      ...mapActions(['fetchstats', 'fetchWorkerCategories', 'fetchIndividualUpcoming', 'fetchIndividualHistorical', 'fetchWorkerUpcoming', 'fetchWorkerHistorical']),
      allowedStep: m => m % 5 === 0,
      initialize(){
        this.fetchHospitalList()
        this.fetchstats()
        this.fetchWorkerCategories()
        this.fetchIndividualUpcoming(this.individualUpcomingPagination.current_page)
        this.fetchIndividualHistorical(this.individualHistoricalPagination.current_page)
        this.fetchWorkerUpcoming()
      },
      showComments(profile){
        this.commentsLoader = true
        apiCall({url: '/api/userRating?type=comments&user='+profile.id, method: 'GET' })
          .then(resp => {
            this.workerComments = resp.data,
            this.workerCommentsPagination.current_page = resp.current_page
		        this.workerCommentsPagination.total = resp.total
		        this.workerCommentsPagination.per_page = resp.per_page
            this.commentsDialog=true
            this.commentsLoader = false
          })
          .catch(error => {
            
          })
      },
      seeHospitalList(){
        console.log("here")
        this.currentProgress = this.progress
        this.progress = 'hospitalList'
      },
      fetchHospitalList(){
        apiCall({url: '/api/userRequest?type=hospitalList', method: 'GET' })
          .then(resp => {
            this.hospitalWorkerList = resp
          })
          .catch(error => {
            
          })
      },
      goOnline(){
        var formData = {
          type: 'online'
        }
        this.onlineLoading = true
        apiCall({url: '/api/user/'+this.getProfile.id, data: formData, method: 'PUT' })
          .then(resp => {
            this.stats.profile.active = 1
            this.onlineLoading = false
            this.fetchstats()
          })
          .catch(error => {
            this.onlineLoading = false
          })
      },
      goOffline(){
        var formData = {
          type: 'offline'
        }
        this.offlineLoading = true
        apiCall({url: '/api/user/'+this.getProfile.id, data: formData, method: 'PUT' })
          .then(resp => {
            this.stats.profile.active = 0
            this.offlineLoading = false
            this.fetchstats()
          })
          .catch(error => {
            this.offlineLoading = false
          })
      },
      resetFilter(){
        this.maleOutline = true
        this.femaleOutline = true
        this.darkMale = false
        this.darkFemale = false
        this.requestData.genderId = null

        this.outline5km = true
        this.outline10km = true
        this.outline15km = true
        this.dark5km = false,
        this.dark10km = false,
        this.dark15km = false,
        this.requestData.distance = 50

        this.subIndex = -1
        this.requestData.subGroup = null

        this.loading = true
        apiCall({url: '/api/userRequest?type=filter&page='+this.workersPagination.current_page, data: this.requestData, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.sheet = false
              this.workers = resp.data
              this.workersPagination.current_page = resp.current_page
		          this.workersPagination.total = resp.total
		          this.workersPagination.per_page = resp.per_page

            })
            .catch(error => {
              this.loading = false
              this.message = "An Error Occured, Please Try Again."
              this.color = 'error'
              this.snackbar = true
            })
      },
      filterGender(gender){
        if(gender == 1){
          this.maleOutline = false
          this.femaleOutline = true
          this.darkMale = true
          this.darkFemale = false
          this.requestData.genderId = 1
          this.filterResults()
        } else {
          this.maleOutline = true
          this.femaleOutline = false
          this.darkMale = false
          this.darkFemale = true
          this.requestData.genderId = 2
          this.filterResults()
        }
      },
      filterDistance(distance){
        if(distance == 1){
          this.outline5km = false,
          this.outline10km = true,
          this.outline15km = true,
          this.dark5km = true,
          this.dark10km = false,
          this.dark15km = false,
          this.requestData.distance = 5
          this.filterResults()
        } else if(distance == 2){
          this.outline5km = true,
          this.outline10km = false,
          this.outline15km = true,
          this.dark5km = false,
          this.dark10km = true,
          this.dark15km = false,
          this.requestData.distance = 10
          this.filterResults()
        } else {
          this.outline5km = true,
          this.outline10km = true,
          this.outline15km = false,
          this.dark5km = false,
          this.dark10km = false,
          this.dark15km = true,
          this.requestData.distance = 15
          this.filterResults()
        }
      },
      filterBySubGroup(id, index){
        this.subIndex = index
        this.requestData.subGroup = id
        this.filterResults()
      },
      currentPosition(position){
        var vm = this
        vm.latitude = position.coords.latitude.toString()
        vm.longitude = position.coords.longitude.toString()
        Vue.set(this,"longitude", position.coords.longitude.toString())
        Vue.set(this,"latitude", position.coords.latitude.toString())

        var formData = {
          longitude: vm.longitude,
          latitude: vm.latitude
        }

        console.log(formData)

        apiCall({url: '/api/userDevice', data: formData, method: 'POST' })
          .then(resp => {

          })
          .catch(error => {
            
          })
      },
      showMap(){
        this.progress = 'Location'
        this.progressBar = 0
      },
      backHospitallList(){
        this.progress = this.currentProgress
      },
      showClock(){
        this.progress = 'Time'
        this.progressBar = 25
      },
      showCategories(){
        this.progress = 'Category'
        this.progressBar = 50
      },
      showWorkerList(){
        this.progress = 'Worker List'
        this.progressBar = 75
      },
      newPos(){
        this.requestData.location = this.$refs.myMarker.mapObject.getLatLng()
        this.progress = 'Time'
        this.progressBar = 25
      },
      selectCategory(){
        if(this.requestData.from == null || this.requestData.to == null){
          this.message = 'Please Pick Start/End Time'
          this.snackbar = true
          this.color = 'error'
        }else{
          this.progress = 'Category'
          this.progressBar = 50
          this.menu1 = false
          this.menu2 = false
        }
        
      },
      listWorkers(){
        if(this.requestData.category == null){
          this.message = 'Please Pick a Category'
          this.snackbar = true
          this.color = 'error'
        }else{
          this.loading = true
          apiCall({url: '/api/userRequest?type=new', data: this.requestData, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.workers = resp.data
              this.workersPagination.current_page = resp.current_page
		          this.workersPagination.total = resp.total
		          this.workersPagination.per_page = resp.per_page

              this.progress = 'Worker List'
              this.progressBar = 75
            })
            .catch(error => {
              this.loading = false
              this.message = "An Error Occured, Please Try Again."
              this.color = 'error'
              this.snackbar = true
            })
        }
      },
      filterResults(){
        this.filterDialog = true
          apiCall({url: '/api/userRequest?type=filter&page='+this.workersPagination.current_page, data: this.requestData, method: 'POST' })
            .then(resp => {
              this.filterDialog = false
              this.workers = resp.data
              this.workersPagination.current_page = resp.current_page
		          this.workersPagination.total = resp.total
		          this.workersPagination.per_page = resp.per_page

            })
            .catch(error => {
              this.filterDialog = false
              this.message = "An Error Occured, Please Try Again."
              this.color = 'error'
              this.snackbar = true
            })
      },
      goToProfile(index){
        this.progress = 'Profile'
        this.progressBar = 100
        this.profile = this.workers[index]
        this.requestData.workerId = this.workers[index].id
      },
      addHospitalList(){
        console.log("profile", this.requestData)
        this.loading = true
        apiCall({url: '/api/userRequest?type=hospitalList', data: this.requestData, method: 'POST' })
          .then(resp => {
            this.fetchHospitalList()
            this.loading = false
            this.message = "Successfully Added to List"
            this.color = 'success'
            this.snackbar = true
          })
          .catch(error => {
            this.loading = false
            this.message = "An Error Occured, Please Try Again."
            this.color = 'error'
            this.snackbar = true
          })
      },
      completeHospitalRequest(){
        this.loading = true
        apiCall({url: '/api/userRequest?type=hospitalComplete', data: this.requestData, method: 'POST' })
          .then(resp => {
            this.fetchHospitalList()
            this.loading = false
            this.progress = 'Location'
            this.progressBar = 0
            this.requestDialog = false
            this.message = "Request Completed Successfully."
            this.color = 'success'
            this.snackbar = true

            this.requestData.dateFrom = null
            this.requestData.dateTo = null
            this.requestData.from = null
            this.requestData.to = null
            this.requestData.category = null
            this.requestData.workerId = ''
            this.clinicalOfficerColor = 'transparent'
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.pharmacistColor = 'transparent'
          })
          .catch(error => {
            this.loading = false
            this.message = "An Error Occured, Please Try Again."
            this.color = 'error'
            this.snackbar = true
          })
      },
      completeRequest(){
        this.loading = true
        apiCall({url: '/api/userRequest?type=complete', data: this.requestData, method: 'POST' })
          .then(resp => {
            this.loading = false
            this.progress = 'Location'
            this.progressBar = 0
            this.requestDialog = false
            this.message = "Request Completed Successfully."
            this.color = 'success'
            this.snackbar = true

            this.requestData.dateFrom = null
            this.requestData.dateTo = null
            this.requestData.from = null
            this.requestData.to = null
            this.requestData.category = null
            this.requestData.workerId = ''
            this.clinicalOfficerColor = 'transparent'
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.pharmacistColor = 'transparent'
          })
          .catch(error => {
            this.loading = false
            this.message = "An Error Occured, Please Try Again."
            this.color = 'error'
            this.snackbar = true
          })
      },
      formattedDate(date){
        return date ? format(date, 'Do MMM YYYY') : ''
      },
      newRequest(){
        this.requestDialog = true
        this.$nextTick(() => {
            this.$refs.myMapRef.mapObject.invalidateSize();
          })
      },
      pickCategory(category){
        if(category == 1){
          if(this.requestData.category == 1){
            this.requestData.category = null
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.clinicalOfficerColor = 'transparent'
            this.pharmacistColor = 'transparent'
          } else {
            this.requestData.category = 1
            this.doctorColor = 'primary'
            this.nurseColor = 'transparent'
            this.clinicalOfficerColor = 'transparent'
            this.pharmacistColor = 'transparent'
            this.workerlistDialog = true
            apiCall({url: '/api/userRequest?type=new', data: this.requestData, method: 'POST' })
            .then(resp => {
              this.workerlistDialog = false
              this.loading = false
              this.workers = resp.data
              this.workersPagination.current_page = resp.current_page
		          this.workersPagination.total = resp.total
		          this.workersPagination.per_page = resp.per_page

              this.progress = 'Worker List'
              this.progressBar = 75
            })
            .catch(error => {
              this.workerlistDialog = false
              this.loading = false
              this.message = "An Error Occured, Please Try Again."
              this.color = 'error'
              this.snackbar = true
            })
          }
        } else if(category == 2){
          if(this.requestData.category == 2){
            this.requestData.category = null
            this.nurseColor = 'transparent'
            this.doctorColor = 'transparent'
            this.clinicalOfficerColor = 'transparent'
            this.pharmacistColor = 'transparent'
          } else {
            this.requestData.category = 2
            this.nurseColor = 'primary'
            this.doctorColor = 'transparent'
            this.clinicalOfficerColor = 'transparent'
            this.pharmacistColor = 'transparent'
            this.workerlistDialog = true
            apiCall({url: '/api/userRequest?type=new', data: this.requestData, method: 'POST' })
            .then(resp => {
              this.workerlistDialog = false
              this.loading = false
              this.workers = resp.data
              this.workersPagination.current_page = resp.current_page
		          this.workersPagination.total = resp.total
		          this.workersPagination.per_page = resp.per_page

              this.progress = 'Worker List'
              this.progressBar = 75
            })
            .catch(error => {
              this.workerlistDialog = false
              this.loading = false
              this.message = "An Error Occured, Please Try Again."
              this.color = 'error'
              this.snackbar = true
            })
          }
        } else if(category == 3){
          if(this.requestData.category == 3){
            this.requestData.category = null
            this.clinicalOfficerColor = 'transparent'
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.pharmacistColor = 'transparent'
          } else {
            this.requestData.category = 3
            this.clinicalOfficerColor = 'primary'
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.pharmacistColor = 'transparent'
            this.workerlistDialog = true
            apiCall({url: '/api/userRequest?type=new', data: this.requestData, method: 'POST' })
            .then(resp => {
              this.workerlistDialog = false
              this.loading = false
              this.workers = resp.data
              this.workersPagination.current_page = resp.current_page
		          this.workersPagination.total = resp.total
		          this.workersPagination.per_page = resp.per_page

              this.progress = 'Worker List'
              this.progressBar = 75
            })
            .catch(error => {
              this.workerlistDialog = false
              this.loading = false
              this.message = "An Error Occured, Please Try Again."
              this.color = 'error'
              this.snackbar = true
            })
          }
        } else if(category == 4){
          if(this.requestData.category == 4){
            this.requestData.category = null
            this.clinicalOfficerColor = 'transparent'
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.pharmacistColor = 'transparent'
          } else {
            this.requestData.category = 4
            this.clinicalOfficerColor = 'transparent'
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.pharmacistColor = 'primary'
            this.workerlistDialog = true
            apiCall({url: '/api/userRequest?type=new', data: this.requestData, method: 'POST' })
            .then(resp => {
              this.workerlistDialog = false
              this.loading = false
              this.workers = resp.data
              this.workersPagination.current_page = resp.current_page
		          this.workersPagination.total = resp.total
		          this.workersPagination.per_page = resp.per_page

              this.progress = 'Worker List'
              this.progressBar = 75
            })
            .catch(error => {
              this.workerlistDialog = false
              this.loading = false
              this.message = "An Error Occured, Please Try Again."
              this.color = 'error'
              this.snackbar = true
            })
          }
        }         

      }
    },
    computed: {
      ...mapGetters([
        'getProfile',
        'stats',
        'allWorkerCategories',
        'individualUpcomingPagination',
        'individualHistoricalPagination'
      ]),
      formattedStratDate(){
        return this.requestData.dateFrom ? format(this.requestData.dateFrom, 'Do MMM YYYY') : ''
      },
      formattedEndDate(){
        return this.requestData.dateTo ? format(this.requestData.dateTo, 'Do MMM YYYY') : ''
      },
      dateToday(){
        var today = new Date();

        var timestamp = today.getFullYear()+"-"+(this.months[today.getMonth()])+"-"+today.getDate()
        return timestamp
      },
      now(){
        var today = new Date();

        var timestamp = today.getFullYear()+"-"+(this.months[today.getMonth()])+"-"+today.getDate()
        if(this.requestData.dateFrom == timestamp){
          var now = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        
        return now
        }
        
      },
      endMin(){
        if(this.requestData.dateFrom == this.requestData.dateTo){
          return this.requestData.from
        }
      },
      workersLength: function() {
	        return Math.ceil(this.workersPagination.total / this.workersPagination.per_page);
	    },
      subjobs(){
        return this.$store.getters.allWorkerCategories.find((category) => category.id == this.requestData.category)
      },
    }

  }
</script>
